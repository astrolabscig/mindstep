"use server";

import { z } from "zod";
import { readDb, persist, ensureProfile, deleteProfileData } from "@/lib/store/file-store";
import type { Db } from "@/lib/store/types";
import {
  readSessionProfileId,
  setSessionCookie,
  newProfileId,
  newRecordId,
  validateAdminKey,
  readAdminFlag,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/session";
import { serviceById, questionById, questionsOfModule, moduleBySlug, lessonById, scenarioById } from "@/content";
import { evaluateAnswer, scoreAttempt, missedQuestions, type AnsweredQuestion } from "@/lib/domain/quiz";

/**
 * Server actions. Every user mutation is validated with Zod on the
 * server, and the profile is always resolved from the session cookie,
 * never from client input (see docs/architecture.md access rules).
 */

/* ── Session/profile bootstrap ─────────────────────────────── */

async function withProfile<T>(fn: (profileId: string, db: Db) => T): Promise<T> {
  const existing = await readSessionProfileId();
  const db = readDb();
  const id = existing ?? newProfileId();
  const created = !existing;
  ensureProfile(db, id);
  if (created) await setSessionCookie(id);
  const result = fn(id, db);
  persist(db);
  return result;
}

/* ── Schemas ───────────────────────────────────────────────── */

const onboardingSchema = z.object({
  goal: z.enum(["self-understanding", "support-others", "find-services", "school-work", "explore"]),
  topics: z.array(z.string().min(2)).max(16),
  pace: z.enum(["slow", "steady", "fast"]),
  reduceMotion: z.boolean().optional(),
});

const quizSubmissionSchema = z.object({
  slug: z.string().min(2),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(2),
        selected: z.number().int().min(0).max(4),
      }),
    )
    .min(1)
    .max(64),
});

const idSchema = z.string().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/);

const scenarioRunSchema = z.object({
  scenarioId: idSchema,
  worstQuality: z.enum(["best", "acceptable", "poor"]),
  walked: z.number().int().min(1).max(200),
});

const adminKeySchema = z.object({ key: z.string().min(1).max(200) });

const adminVerifySchema = z.object({
  serviceId: idSchema,
  status: z.enum(["verified", "awaiting-verification"]),
  note: z.string().trim().min(5).max(500),
});

/* ── Onboarding & preferences ──────────────────────────────── */

export async function saveOnboarding(input: unknown): Promise<{ ok: boolean }> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    p.onboarding = { ...parsed.data, completedAt: new Date().toISOString() };
    if (parsed.data.reduceMotion !== undefined) p.preferences.reduceMotion = parsed.data.reduceMotion;
  });
  return { ok: true };
}

export async function setReducedMotionPreference(value: boolean): Promise<{ ok: boolean }> {
  await withProfile((id, db) => {
    db.profiles[id].preferences.reduceMotion = value;
  });
  return { ok: true };
}

/* ── Lessons ───────────────────────────────────────────────── */

export async function markLessonSection(lessonId: string, sectionId: string): Promise<{ ok: boolean }> {
  if (!idSchema.safeParse(lessonId).success || !idSchema.safeParse(sectionId).success) return { ok: false };
  const lesson = lessonById(lessonId);
  if (!lesson) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    const rec = p.lessonProgress[lessonId] ?? { savedAt: new Date().toISOString() };
    rec.lastSectionId = sectionId;
    rec.savedAt = new Date().toISOString();
    p.lessonProgress[lessonId] = rec;
  });
  return { ok: true };
}

export async function saveLessonProgress(lessonId: string, completed: boolean): Promise<{ ok: boolean }> {
  if (!idSchema.safeParse(lessonId).success) return { ok: false };
  const lesson = lessonById(lessonId);
  if (!lesson) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    const rec = p.lessonProgress[lessonId] ?? { savedAt: new Date().toISOString() };
    rec.completed = completed;
    rec.savedAt = new Date().toISOString();
    if (!rec.lastSectionId) {
      rec.lastSectionId = lesson.sections[lesson.sections.length - 1]?.id;
    }
    p.lessonProgress[lessonId] = rec;
  });
  return { ok: true };
}

export async function toggleSaveLesson(lessonId: string): Promise<{ ok: boolean; saved?: boolean }> {
  if (!idSchema.safeParse(lessonId).success) return { ok: false };
  const lesson = lessonById(lessonId);
  if (!lesson) return { ok: false };
  let saved = false;
  await withProfile((id, db) => {
    const p = db.profiles[id];
    if (p.savedLessonIds.includes(lessonId)) {
      p.savedLessonIds = p.savedLessonIds.filter((x) => x !== lessonId);
    } else {
      p.savedLessonIds.push(lessonId);
      saved = true;
    }
  });
  return { ok: true, saved };
}

/* ── Quizzes (server-side scoring for integrity) ───────────── */

export async function submitQuizAttempt(
  input: unknown,
): Promise<
  | { ok: false }
  | {
      ok: true;
      score: { percentage: number; correct: number; total: number; band: string };
      answerResults: { questionId: string; correct: boolean; correctAnswer: number }[];
    }
> {
  const parsed = quizSubmissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const mod = moduleBySlug(parsed.data.slug);
  if (!mod) return { ok: false };

  const allowed = new Set(questionsOfModule(mod.id).map((q) => q.id));
  const seen = new Set<string>();
  const answered: AnsweredQuestion[] = [];
  for (const a of parsed.data.answers) {
    if (!allowed.has(a.questionId) || seen.has(a.questionId)) continue;
    const question = questionById(a.questionId);
    if (!question) continue;
    seen.add(a.questionId);
    answered.push({ question, selected: a.selected });
  }
  if (answered.length !== allowed.size) return { ok: false };

  const results = answered.map((a) => evaluateAnswer(a.question, a.selected));
  const score = scoreAttempt(results);
  const missedIds = missedQuestions(answered).map((q) => q.id);

  await withProfile((id, db) => {
    const p = db.profiles[id];
    p.quizAttempts.push({
      id: newRecordId("qa"),
      moduleId: mod.id,
      percentage: score.percentage,
      correct: score.correct,
      total: score.total,
      attemptedAt: new Date().toISOString(),
      missedQuestionIds: missedIds,
    });
  });

  return {
    ok: true,
    score,
    answerResults: results.map((r, i) => ({
      questionId: answered[i].question.id,
      correct: r.correct,
      correctAnswer: r.correctAnswer,
    })),
  };
}

/* ── Scenarios ─────────────────────────────────────────────── */

export async function recordScenarioRun(input: unknown): Promise<{ ok: boolean }> {
  const parsed = scenarioRunSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const scenario = scenarioById(parsed.data.scenarioId);
  if (!scenario) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    p.scenarioRuns.push({
      id: newRecordId("run"),
      scenarioId: parsed.data.scenarioId,
      finishedAt: new Date().toISOString(),
      worstChoiceQuality: parsed.data.worstQuality,
    });
  });
  return { ok: true };
}

/* ── Data deletion ─────────────────────────────────────────── */

/** Erases the learning profile bound to this browser session. */
export async function deleteMyData(): Promise<{ ok: boolean }> {
  const id = await readSessionProfileId();
  if (!id) return { ok: true };
  await withProfile((pid, db) => {
    deleteProfileData(db, pid);
  });
  return { ok: true };
}

/* ── Admin ─────────────────────────────────────────────────── */

export async function adminLogin(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = adminKeySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter the admin key." };
  if (!validateAdminKey(parsed.data.key)) return { ok: false, error: "Key rejected. Ask your project lead." };
  await setAdminCookie();
  return { ok: true };
}

export async function adminLogout(): Promise<{ ok: boolean }> {
  await clearAdminCookie();
  return { ok: true };
}

/* ── Admin content management ──────────────────────────────── */

/** Publish/unpublish a lesson (content overrides, revision-logged). */
export async function adminSetLessonPublished(lessonId: string, published: boolean): Promise<{ ok: boolean }> {
  if (!idSchema.safeParse(lessonId).success) return { ok: false };
  const lesson = lessonById(lessonId);
  if (!lesson) return { ok: false };
  if (!(await readAdminFlag())) return { ok: false };
  readDbAndApply((db) => {
    const set = new Set(db.overrides.unpublishedLessonIds);
    if (published) {
      set.delete(lessonId);
    } else {
      set.add(lessonId);
    }
    db.overrides.unpublishedLessonIds = Array.from(set);
    db.revisions.push({
      id: newRecordId("rev"),
      at: new Date().toISOString(),
      actor: "admin",
      action: published ? "publish-lesson" : "unpublish-lesson",
      summary: `Lesson "${lesson.title}" set to ${published ? "published" : "unpublished"}.`,
    });
  });
  return { ok: true };
}

function readDbAndApply(fn: (db: Db) => void): void {
  const db = readDb();
  fn(db);
  persist(db);
}

export async function adminVerifyService(input: unknown): Promise<{ ok: boolean }> {
  const parsed = adminVerifySchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  if (!(await readAdminFlag())) return { ok: false };
  const service = serviceById(parsed.data.serviceId);
  if (!service) return { ok: false };
  await withProfile((id, db) => {
    void id;
    db.verifications.push({
      id: newRecordId("vf"),
      serviceId: parsed.data.serviceId,
      status: parsed.data.status,
      verifiedAt: new Date().toISOString().slice(0, 10),
      note: parsed.data.note,
      sourceTitle: service.verification.sourceTitle,
      sourceUrl: service.verification.sourceUrl,
    });
    db.revisions.push({
      id: newRecordId("rev"),
      at: new Date().toISOString(),
      actor: "admin",
      action: "verify-service",
      summary: `${service.name}: marked ${parsed.data.status}, ${parsed.data.note}`,
    });
  });
  return { ok: true };
}
