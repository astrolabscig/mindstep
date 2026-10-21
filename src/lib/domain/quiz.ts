import type { QuizQuestion } from "@/content/schema";

/**
 * Quiz domain. Scoring and ordering. Educational only:
 * scores summarise knowledge-check results, never clinical state.
 */

export type AnsweredQuestion = {
  question: QuizQuestion;
  selected: number;
};

export type QuizResult = {
  correct: boolean;
  selectedAnswer: number;
  correctAnswer: number;
};

/** Deterministic pseudo-random shuffle (Fisher. Yates with an LCG seeded by hash). */
export function shuffleQuestions<T>(items: T[], seed: string): T[] {
  const array = [...items];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function evaluateAnswer(question: QuizQuestion, selected: number): QuizResult {
  return {
    correct: selected === question.correctIndex,
    selectedAnswer: selected,
    correctAnswer: question.correctIndex,
  };
}

export type QuizAttemptScore = {
  correct: number;
  total: number;
  percentage: number;
  /** Transparent, human-readable band. NOT a clinical score. */
  band: "Needs review" | "Developing" | "Solid" | "Strong";
};

export function scoreAttempt(results: QuizResult[]): QuizAttemptScore {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  const band: QuizAttemptScore["band"] =
    percentage >= 90 ? "Strong" : percentage >= 70 ? "Solid" : percentage >= 50 ? "Developing" : "Needs review";
  return { correct, total, percentage, band };
}

export function missedQuestions(results: AnsweredQuestion[]): QuizQuestion[] {
  return results.filter((a) => a.selected !== a.question.correctIndex).map((a) => a.question);
}
