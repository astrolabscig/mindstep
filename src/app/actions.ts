"use server";

import { z } from "zod";
import { readDb, persist, ensureProfile } from "@/lib/store/file-store";
import type { Db } from "@/lib/store/types";
import {
  readSessionProfileId,
  setSessionCookie,
  newProfileId,
  newActionId,
  newRecordId,
  hashPassword,
  verifyPassword,
  validateAdminKey,
  readAdminFlag,
  setAdminCookie,
  clearAdminCookie,
  clearSessionCookie,
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
  persist(db);
  if (created) await setSessionCookie(id);
  return fn(id, db);
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

const actionSchema = z.object({
  kind: z.enum([
    "identify-trusted-person",
    "prepare-questions",
    "plan-conversation",
    "revisit-lesson",
    "reflection",
    "custom-goal",
  ]),
  title: z.string().trim().min(3).max(120),
  detail: z.string().trim().max(2000).optional(),
  actionId: z.string().optional(), // present when updating
});

const idSchema = z.string().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/);

const scenarioRunSchema = z.object({
  scenarioId: idSchema,
  worstQuality: z.enum(["best", "acceptable", "poor"]),
  walked: z.number().int().min(1).max(200),
});

const accountSchema = z.object({
  displayName: z.string().trim().min(2).max(40),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(72),
});

const signInSchema = z.object({ email: z.string().trim().email().max(120), password: z.string().min(1).max(72) });

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

/* ── Action planner ────────────────────────────────────────── */

export async function upsertAction(input: unknown): Promise<{ ok: boolean }> {
  const parsed = actionSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    if (parsed.data.actionId) {
      const existing = p.actions.find((a) => a.id === parsed.data.actionId);
      if (existing) {
        existing.title = parsed.data.title;
        existing.detail = parsed.data.detail ?? existing.detail;
        existing.kind = parsed.data.kind;
      }
    } else {
      p.actions.push({
        id: newActionId(),
        kind: parsed.data.kind,
        title: parsed.data.title,
        detail: parsed.data.detail ?? "",
        done: false,
        createdAt: new Date().toISOString(),
        doneAt: null,
      });
    }
  });
  return { ok: true };
}

export async function toggleAction(actionId: string): Promise<{ ok: boolean }> {
  if (!/^act_[a-z0-9]+$/.test(actionId)) return { ok: false };
  await withProfile((id, db) => {
    const a = db.profiles[id].actions.find((x) => x.id === actionId);
    if (a) {
      a.done = !a.done;
      a.doneAt = a.done ? new Date().toISOString() : null;
    }
  });
  return { ok: true };
}

export async function deleteAction(actionId: string): Promise<{ ok: boolean }> {
  if (!/^act_[a-z0-9]+$/.test(actionId)) return { ok: false };
  await withProfile((id, db) => {
    const p = db.profiles[id];
    p.actions = p.actions.filter((a) => a.id !== actionId);
  });
  return { ok: true };
}

/* ── Accounts (local mode) ─────────────────────────────────── */

export async function registerAccount(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = accountSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check your details (password must be at least 8 characters)." };
  const db = readDb();
  if (Object.values(db.profiles).some((p) => p.email?.toLowerCase() === parsed.data.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists. Sign in instead." };
  }
  const guestId = await readSessionProfileId();
  const accountId = newProfileId();
  db.profiles[accountId] = {
    id: accountId,
    kind: "account",
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    passwordHash: hashPassword(parsed.data.password),
    createdAt: new Date().toISOString(),
    onboarding: null,
    lessonProgress: {},
    savedLessonIds: [],
    quizAttempts: [],
    scenarioRuns: [],
    actions: [],
    preferences: {},
  };
  // Migrate any guest data into the new account
  if (guestId && db.profiles[guestId]?.kind === "guest") {
    const guest = db.profiles[guestId];
    db.profiles[accountId].onboarding = guest.onboarding;
    db.profiles[accountId].lessonProgress = guest.lessonProgress;
    db.profiles[accountId].savedLessonIds = guest.savedLessonIds;
    db.profiles[accountId].quizAttempts = guest.quizAttempts;
    db.profiles[accountId].scenarioRuns = guest.scenarioRuns;
    db.profiles[accountId].actions = guest.actions;
    delete db.profiles[guestId];
  }
  persist(db);
  await setSessionCookie(accountId);
  return { ok: true };
}

export async function signIn(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." };
  const db = readDb();
  const account = Object.values(db.profiles).find(
    (p) => p.email?.toLowerCase() === parsed.data.email.toLowerCase() && p.passwordHash,
  );
  if (!account || !account.passwordHash || !verifyPassword(parsed.data.password, account.passwordHash)) {
    return { ok: false, error: "Email or password is incorrect." };
  }
  const guestId = await readSessionProfileId();
  const guest = guestId ? db.profiles[guestId] : undefined;
  if (guest?.kind === "guest") {
    // Merge guest progress into the signed-in account
    for (const [lessonId, rec] of Object.entries(guest.lessonProgress)) {
      if (!db.profiles[account.id].lessonProgress[lessonId] || rec.completed) {
        db.profiles[account.id].lessonProgress[lessonId] = rec;
      }
    }
    db.profiles[account.id].quizAttempts.push(...guest.quizAttempts);
    db.profiles[account.id].scenarioRuns.push(...guest.scenarioRuns);
    db.profiles[account.id].savedLessonIds = Array.from(
      new Set([...db.profiles[account.id].savedLessonIds, ...guest.savedLessonIds]),
    );
    if (!db.profiles[account.id].onboarding) db.profiles[account.id].onboarding = guest.onboarding;
    db.profiles[account.id].actions.push(...guest.actions);
    if (guestId) delete db.profiles[guestId];
    persist(db);
  }
  await setSessionCookie(account.id);
  return { ok: true };
}

export async function signOut(): Promise<{ ok: boolean }> {
  await clearSessionCookie();
  return { ok: true };
}

/** Full data deletion: erases the profile bound to this session. */
export async function deleteMyData(): Promise<{ ok: boolean }> {
  const id = await readSessionProfileId();
  if (!id) return { ok: true };
  await withProfile((pid, db) => {
    void pid;
    db.profiles[id] = {
      id,
      kind: "guest",
      createdAt: new Date().toISOString(),
      onboarding: null,
      lessonProgress: {},
      savedLessonIds: [],
      quizAttempts: [],
      scenarioRuns: [],
      actions: [],
      preferences: {},
    };
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
