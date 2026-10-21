import { describe, it, expect } from "vitest";
import { evaluateAnswer, scoreAttempt, missedQuestions, shuffleQuestions } from "@/lib/domain/quiz";
import { buildRecommendations } from "@/lib/domain/recommend";
import { filterServices, regionsOf, typesOf } from "@/lib/domain/directory";
import { questionsOfModule } from "@/content";
import { supportServices } from "@/content/support-services";

describe("quiz scoring", () => {
  it("marks a correct answer correct and reports the correct index", () => {
    const q = questionsOfModule("mental-health-fundamentals")[0];
    const result = evaluateAnswer(q, q.correctIndex);
    expect(result.correct).toBe(true);
    expect(result.correctAnswer).toBe(q.correctIndex);
  });

  it("marks a wrong answer wrong but still reveals the correct index", () => {
    const q = questionsOfModule("mental-health-fundamentals")[0];
    const wrong = (q.correctIndex + 1) % q.options.length;
    const result = evaluateAnswer(q, wrong);
    expect(result.correct).toBe(false);
    expect(result.correctAnswer).toBe(q.correctIndex);
  });

  it("scores a full set of correct answers as 100% with a band", () => {
    const qs = questionsOfModule("mental-health-fundamentals");
    const results = qs.map((q) => evaluateAnswer(q, q.correctIndex));
    const score = scoreAttempt(results);
    expect(score.percentage).toBe(100);
    expect(score.correct).toBe(qs.length);
    expect(score.band).toBe("Strong");
  });

  it("scores a partial set proportionally", () => {
    const qs = questionsOfModule("mental-health-fundamentals");
    const results = qs.map((q, i) =>
      evaluateAnswer(q, i % 2 === 0 ? q.correctIndex : (q.correctIndex + 1) % q.options.length),
    );
    const score = scoreAttempt(results);
    expect(score.percentage).toBe(Math.round((score.correct / qs.length) * 100));
    expect(score.band).not.toBe("Strong");
  });

  it("lists missed questions for revision", () => {
    const qs = questionsOfModule("mental-health-fundamentals");
    const answered = qs.map((q, i) => ({
      question: q,
      selected: i === 0 ? (q.correctIndex + 1) % q.options.length : q.correctIndex,
    }));
    const missed = missedQuestions(answered);
    expect(missed.map((q) => q.id)).toEqual([qs[0].id]);
  });

  it("shuffle is deterministic for a seed and keeps every question", () => {
    const qs = questionsOfModule("mental-health-fundamentals");
    const a = shuffleQuestions(qs, "seed-1");
    const b = shuffleQuestions(qs, "seed-1");
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    expect(a.length).toBe(qs.length);
    expect(new Set(a.map((q) => q.id)).size).toBe(qs.length);
  });
});

describe("explainable recommendations", () => {
  it("always returns a human-readable reason and a valid href", () => {
    const recs = buildRecommendations({
      completedLessonIds: [],
      partiallyCompletedLessonIds: ["what-is-mental-health"],
      latestAttempts: {},
      practisedScenarioIds: [],
    }, { limit: 3 });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) {
      expect(r.reason.length).toBeGreaterThan(10);
      expect(r.href.startsWith("/")).toBe(true);
    }
    expect(recs[0].kind).toBe("continue-lesson");
  });

  it("flags weak quiz modules for review and mentions the score in the reason", () => {
    const recs = buildRecommendations({
      completedLessonIds: [],
      partiallyCompletedLessonIds: [],
      latestAttempts: { "stress-coping": { percentage: 45, attemptedAt: "2026-10-18T00:00:00Z" } },
      practisedScenarioIds: [],
    }, { limit: 5 });
    const review = recs.find((r) => r.kind === "quiz-rereview");
    expect(review).toBeDefined();
    expect(review!.reason).toContain("45");
  });

  it("never recommends a module that scored 70%+ for re-review", () => {
    const recs = buildRecommendations({
      completedLessonIds: [],
      partiallyCompletedLessonIds: [],
      latestAttempts: { "stress-coping": { percentage: 90, attemptedAt: "2026-10-18T00:00:00Z" } },
      practisedScenarioIds: ["friend-withdrawn", "myth-rebuttal", "exam-overwhelm", "persistent-distress", "first-appointment", "worrying-post", "nametag-problem"],
    }, { limit: 5 });
    expect(recs.find((r) => r.kind === "quiz-rereview")).toBeUndefined();
  });

  it("is deterministic for identical activity", () => {
    const input = {
      completedLessonIds: ["what-is-mental-health"],
      partiallyCompletedLessonIds: [],
      latestAttempts: {},
      practisedScenarioIds: [],
    };
    const a = buildRecommendations(input, { limit: 3 });
    const b = buildRecommendations(input, { limit: 3 });
    expect(a).toEqual(b);
  });
});

describe("directory filtering", () => {
  it("filters by region", () => {
    const national = filterServices(supportServices, { region: "National (all regions)" });
    expect(national.length).toBeGreaterThan(0);
    for (const s of national) expect(s.region).toBe("National (all regions)");
  });

  it("filters by service type", () => {
    const helplines = filterServices(supportServices, { type: "helpline" });
    expect(helplines.length).toBeGreaterThan(0);
    for (const s of helplines) expect(s.types).toContain("helpline");
  });

  it("matches search text case-insensitively across name and description", () => {
    const hits = filterServices(supportServices, { text: "confidential" });
    expect(hits.length).toBeGreaterThan(0);
  });

  it("verifiedOnly excludes awaiting-verification entries", () => {
    const all = filterServices(supportServices, {});
    const verified = filterServices(supportServices, { verifiedOnly: true });
    expect(verified.length).toBeLessThanOrEqual(all.length);
    for (const s of verified) expect(s.verification.status).toBe("verified");
  });

  it("an empty query returns everything; regions/types derive from content", () => {
    expect(filterServices(supportServices, {}).length).toBe(supportServices.length);
    expect(regionsOf(supportServices).length).toBeGreaterThan(1);
    expect(typesOf(supportServices).length).toBeGreaterThan(1);
  });
});
