import { modules } from "@/content/modules";
import { lessonById, lessons } from "@/content";
import { scenarios } from "@/content/scenarios";

/**
 * Explainable recommendation engine.
 * Every recommendation carries a human-readable reason. No opaque ranking.
 * Signals used (in priority order):
 *   1. QUIZ_REVIEW, a recent attempt below 70% on a module
 *   2. CONTINUE, a partially completed lesson
 *   3. NEXT_LESSON, the next unstarted lesson in the user's ordered path
 *   4. PRACTICE, an unpractised scenario
 *   5. START. Nudges toward untouched modules (implicit in #3's ordering)
 */

export type RecommendationKind = "quiz-rereview" | "continue-lesson" | "next-lesson" | "practice";

export type Recommendation = {
  kind: RecommendationKind;
  moduleId: string;
  moduleTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  href: string;
  reason: string;
};

export type ProgressSnapshot = {
  completedLessonIds: string[];
  partiallyCompletedLessonIds: string[];
  /** moduleId -> latest attempt percentage */
  latestAttempts: Record<string, { percentage: number; attemptedAt: string }>;
  practisedScenarioIds: string[];
};

export function buildRecommendations(
  snapshot: ProgressSnapshot,
  opts: { limit?: number } = {},
): Recommendation[] {
  const { completedLessonIds, partiallyCompletedLessonIds } = snapshot;
  const limit = opts.limit ?? 3;
  const out: Recommendation[] = [];
  const doneCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const doneText = `${doneCount} of ${lessons.length} lessons`;

  // 1. Quiz review. Weakest recent attempts first
  const attempts = Object.entries(snapshot.latestAttempts)
    .filter(([, a]) => a.percentage < 70)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 2);
  for (const [moduleId, attempt] of attempts) {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) continue;
    out.push({
      kind: "quiz-rereview",
      moduleId,
      moduleTitle: mod.title,
      href: `/quiz/${mod.slug}`,
      reason: `Your latest knowledge check scored ${attempt.percentage}%. Below the 70% “solid” mark. Retaking the check, or revising the lesson, refreshes this topic.`,
    });
  }

  // 2. Continue a partially completed lesson (respect module order)
  for (const m of modules) {
    for (const lessonId of m.lessonIds) {
      if (partiallyCompletedLessonIds.includes(lessonId) && !completedLessonIds.includes(lessonId)) {
        const lesson = lessonById(lessonId);
        if (lesson) {
          out.push({
            kind: "continue-lesson",
            moduleId: m.id,
            moduleTitle: m.title,
            lessonId,
            lessonTitle: lesson.title,
            href: `/lesson/${lessonId}`,
            reason: `You started “${lesson.title}” but haven't finished it. Finishing it completes the ${m.title} module.`,
          });
        }
      }
    }
  }

  // 3. Next unstarted lesson (strict module + lesson order)
  outer: for (const m of modules) {
    const fullyDone = m.lessonIds.every((l) => completedLessonIds.includes(l));
    if (fullyDone) continue;
    for (const lessonId of m.lessonIds) {
      if (!completedLessonIds.includes(lessonId) && !partiallyCompletedLessonIds.includes(lessonId)) {
        const lesson = lessonById(lessonId);
        if (lesson) {
          const isModuleStart = lessonId === m.lessonIds[0];
          out.push({
            kind: "next-lesson",
            moduleId: m.id,
            moduleTitle: m.title,
            lessonId,
            lessonTitle: lesson.title,
            href: `/lesson/${lessonId}`,
            reason: isModuleStart && doneCount === 0
              ? `A natural first read, “${lesson.title}” opens the ${m.title} module.`
              : `“${lesson.title}” is next in the ${m.title} module (${doneText} completed).`,
          });
          break outer;
        }
      }
    }
  }

  // 4. Practice. First scenario not yet practised
  const unpractised = scenarios.find((s) => !snapshot.practisedScenarioIds.includes(s.id));
  if (unpractised) {
    out.push({
      kind: "practice",
      moduleId: unpractised.moduleId,
      moduleTitle: "Scenario Lab",
      href: `/scenarios/${unpractised.id}`,
      reason: `“${unpractised.title}” hasn't been practised yet. Scenarios turn what you've learned into a response you could actually use.`,
    });
  }

  return out.slice(0, limit);
}
