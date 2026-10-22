/**
 * Persistence types (local mode). Mirrors `supabase/schema.sql`.
 */

export type OnboardingAnswers = {
  goal: string;
  topics: string[];
  pace: "slow" | "steady" | "fast";
  reduceMotion?: boolean;
  completedAt: string;
};

export type QuizAttemptRecord = {
  id: string;
  moduleId: string;
  percentage: number;
  correct: number;
  total: number;
  attemptedAt: string;
  missedQuestionIds: string[];
};

export type ScenarioRunRecord = {
  id: string;
  scenarioId: string;
  finishedAt: string;
  worstChoiceQuality: "best" | "acceptable" | "poor";
};

export type LessonProgressRecord = {
  lastSectionId?: string;
  completed?: boolean;
  savedAt: string;
};

export type Profile = {
  id: string;
  createdAt: string;
  onboarding: OnboardingAnswers | null;
  lessonProgress: Record<string, LessonProgressRecord>;
  savedLessonIds: string[];
  quizAttempts: QuizAttemptRecord[];
  scenarioRuns: ScenarioRunRecord[];
  preferences: { reduceMotion?: boolean };
};

/** Service verification entries, appended on every admin re-verification. */
export type VerificationRecord = {
  id: string;
  serviceId: string;
  status: "verified" | "awaiting-verification";
  verifiedAt: string;
  note: string;
  sourceTitle: string;
  sourceUrl: string;
};

export type RevisionRecord = {
  id: string;
  at: string;
  actor: string;
  action: string;
  summary: string;
};

export type ContentOverrides = {
  /** Lesson id -> published (default published=true; overrides unset it) */
  unpublishedLessonIds: string[];
};

export type Db = {
  version: 1;
  profiles: Record<string, Profile>;
  verifications: VerificationRecord[];
  revisions: RevisionRecord[];
  overrides: ContentOverrides;
};

export const DEFAULT_DB: Db = {
  version: 1,
  profiles: {},
  verifications: [],
  revisions: [
    {
      id: "rev-seed-1",
      at: "2026-10-18T00:00:00.000Z",
      actor: "build",
      action: "seed",
      summary: "Content register seeded from code-based content validated at build time.",
    },
  ],
  overrides: { unpublishedLessonIds: [] },
};
