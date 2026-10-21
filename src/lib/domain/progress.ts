import { lessons } from "@/content/lessons";
import { scenarios } from "@/content/scenarios";

/**
 * Progress metrics. All indicators describe EDUCATIONAL ENGAGEMENT, 
 * never psychological state. Each metric is explainable in plain language
 * (the progress page displays the explanation strings below alongside values).
 */

export type ProgressProfile = {
  lessonProgress: Record<string, { completed?: boolean }>;
  quizAttempts: { moduleId: string; percentage: number; attemptedAt: string }[];
  scenarioRuns: { scenarioId: string; finishedAt: string }[];
  actions: { done: boolean }[];
};

export const metricExplanations: Record<string, string> = {
  lessonsCompleted:
    "Counted as lessons where every section was opened and the end-of-lesson knowledge check was marked done.",
  quizPerformance:
    "Your most recent score per module, as a percentage of correct answers. It is a knowledge indicator only, it is not a clinical or diagnostic score and cannot identify any condition.",
  scenariosPractised:
    "Counted as branching scenarios you carried to their concluding summary at least once.",
  reviewQueue:
    "Lessons tied to questions you answered incorrectly or modules whose latest check scored below 70%.",
  goalsCompleted: "Action plan items you marked done yourself.",
};

export function lessonsCompleted(p: { lessonProgress: ProgressProfile["lessonProgress"] }): number {
  return lessons.filter((l) => p.lessonProgress[l.id]?.completed).length;
}

export function lessonsTotal(): number {
  return lessons.length;
}

export type TopicScore = {
  moduleId: string;
  topicTitle: string;
  latest: number | null;
  attempts: number;
  explanation: string;
};

export function topicScores(p: { quizAttempts: ProgressProfile["quizAttempts"] }): TopicScore[] {
  const byModule = new Map<string, { latest: number | null; attempts: number }>();
  for (const a of p.quizAttempts) {
    const cur = byModule.get(a.moduleId) ?? { latest: null as number | null, attempts: 0 };
    cur.attempts += 1;
    cur.latest = a.percentage; // attempts stored oldest->newest
    byModule.set(a.moduleId, cur);
  }
  return Array.from(byModule.entries()).map(([moduleId, v]) => ({
    moduleId,
    topicTitle: moduleTitle(moduleId),
    latest: v.latest,
    attempts: v.attempts,
    explanation: metricExplanations.quizPerformance,
  }));
}

function moduleTitle(moduleId: string): string {
  // avoid importing full module map to keep this module light in tests
  const titles: Record<string, string> = {
    "mental-health-fundamentals": "Mental health fundamentals",
    "stress-coping": "Stress and coping",
    "understanding-anxiety": "Understanding anxiety",
    "understanding-depression": "Understanding depression",
    "myths-stigma": "Mental health myths and stigma",
    "supportive-communication": "Supportive communication",
    "when-to-seek-help": "When professional help may be appropriate",
    "navigating-services-ghana": "Navigating mental health services in Ghana",
  };
  return titles[moduleId] ?? moduleId;
}

export function scenariosPractised(p: { scenarioRuns: ProgressProfile["scenarioRuns"] }): number {
  return new Set(p.scenarioRuns.map((r) => r.scenarioId)).size;
}

export function scenariosTotal(): number {
  return scenarios.length;
}

export function reviewQueueLessonIds(
  p: { lessonProgress: ProgressProfile["lessonProgress"]; quizAttempts: ProgressProfile["quizAttempts"] },
  missedByModule: Record<string, string[]>,
): string[] {
  const ids = new Set<string>();
  // Modules with a weak recent attempt → their incomplete lessons
  const weak = new Set(p.quizAttempts.filter((a) => a.percentage < 70).map((a) => a.moduleId));
  for (const l of lessons) {
    if (!p.lessonProgress[l.id]?.completed && (weak.has(l.moduleId) || (missedByModule[l.moduleId]?.length ?? 0) > 0)) {
      ids.add(l.id);
    }
  }
  return lessons.filter((l) => ids.has(l.id)).map((l) => l.id);
}

export function goalsCompleted(p: { actions: { done: boolean }[] }): number {
  return p.actions.filter((a) => a.done).length;
}
