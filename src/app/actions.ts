"use server";

import { z } from "zod";
import { readDb, persist, ensureProfile, deleteProfileData } from "@/lib/store/file-store";
import type { Db } from "@/lib/store/types";
import {
  readSessionProfileId,
  setSessionCookie,
  newProfileId,
  newRecordId,
} from "@/lib/session";
import { questionById, questionsOfModule, moduleBySlug, lessonById, scenarioById } from "@/content";
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
