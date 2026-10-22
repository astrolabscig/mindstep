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

export type Db = {
  version: 1;
  profiles: Record<string, Profile>;
};

export const DEFAULT_DB: Db = {
  version: 1,
  profiles: {},
};
