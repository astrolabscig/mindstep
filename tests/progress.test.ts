import { describe, it, expect } from "vitest";
import {
  lessonsCompleted,
  lessonsTotal,
  topicScores,
  scenariosPractised,
  scenariosTotal,
  reviewQueueLessonIds,
  goalsCompleted,
  metricExplanations,
  type ProgressProfile,
} from "@/lib/domain/progress";
import { lessonsOfModule } from "@/content";
import { modules } from "@/content/modules";

const blank: ProgressProfile = {
  lessonProgress: {},
  quizAttempts: [],
  scenarioRuns: [],
  actions: [],
};

describe("progress metrics", () => {
  it("explanations exist for every displayed metric and are written in plain language", () => {
    for (const key of ["lessonsCompleted", "quizPerformance", "scenariosPractised", "reviewQueue", "goalsCompleted"]) {
      const text = metricExplanations[key];
      expect(text, `explanation for ${key}`).toBeTruthy();
      expect(text.length).toBeGreaterThan(30);
    }
    // The core honesty claim: metrics describe learning, not psychological state.
    expect(metricExplanations.quizPerformance).toMatch(/knowledge indicator only/i);
  });

  it("a blank profile shows zeros everywhere", () => {
    expect(lessonsCompleted(blank)).toBe(0);
    expect(lessonsTotal()).toBeGreaterThan(0);
    expect(scenariosPractised(blank)).toBe(0);
    expect(scenariosTotal()).toBeGreaterThan(0);
    expect(goalsCompleted(blank)).toBe(0);
    expect(topicScores(blank)).toEqual([]);
  });

  it("counts completed lessons and deduplicates scenario practice", () => {
    // real lesson ids so the content-based counter matches
    const [l1, l2, l3] = ["what-is-mental-health", "how-people-learn-recovery", "stress-basics"];
    const p: ProgressProfile = {
      lessonProgress: {
        [l1]: { completed: true },
        [l2]: { completed: true },
        [l3]: {},
      },
      quizAttempts: [],
      scenarioRuns: [
        { scenarioId: "s1", finishedAt: "2026-10-01T00:00:00Z" },
        { scenarioId: "s1", finishedAt: "2026-10-02T00:00:00Z" },
        { scenarioId: "s2", finishedAt: "2026-10-03T00:00:00Z" },
      ],
      actions: [{ done: true }, { done: false }, { done: true }],
    };
    expect(lessonsCompleted(p)).toBe(2);
    expect(scenariosPractised(p)).toBe(2); // s1 counted once
    expect(goalsCompleted(p)).toBe(2);
  });

  it("reports the latest score per module with an attempt count", () => {
    const p: ProgressProfile = {
      ...blank,
      quizAttempts: [
        { moduleId: "m1", percentage: 50, attemptedAt: "2026-10-01T00:00:00Z" },
        { moduleId: "m1", percentage: 75, attemptedAt: "2026-10-10T00:00:00Z" },
        { moduleId: "m2", percentage: 90, attemptedAt: "2026-10-02T00:00:00Z" },
      ],
    };
    const scores = topicScores(p);
    const m1 = scores.find((s) => s.moduleId === "m1")!;
    expect(m1.latest).toBe(75); // attempts stored oldest → newest
    expect(m1.attempts).toBe(2);
    expect(scores.find((s) => s.moduleId === "m2")!.latest).toBe(90);
  });

  it("queues incomplete lessons of weak modules and of modules with missed questions", () => {
    // use real content ids so the queue's content-filter passes
    const weakModule = modules.find((m) => m.id === "myths-stigma")!;
    const weakLesson = lessonsOfModule(weakModule.id)[0].id;
    const missedModule = modules.find((m) => m.id === "stress-coping")!;
    const missedLesson = lessonsOfModule(missedModule.id)[0].id;
    const healthyModule = modules[0];
    const healthyLesson = lessonsOfModule(healthyModule.id)[0].id;

    const p: ProgressProfile = {
      lessonProgress: {
        [missedLesson]: {},
        [weakLesson]: {},
        [healthyLesson]: { completed: true },
      },
      quizAttempts: [
        { moduleId: weakModule.id, percentage: 55, attemptedAt: "2026-10-01T00:00:00Z" },
        { moduleId: missedModule.id, percentage: 80, attemptedAt: "2026-10-02T00:00:00Z" },
        { moduleId: healthyModule.id, percentage: 100, attemptedAt: "2026-10-03T00:00:00Z" },
      ],
      scenarioRuns: [],
      actions: [],
    };
    const queue = reviewQueueLessonIds(p, {
      [weakModule.id]: ["q1"],
      [missedModule.id]: ["q2"],
      [healthyModule.id]: [],
    });
    expect(queue).toContain(weakLesson);
    expect(queue).toContain(missedLesson);
    expect(queue).not.toContain(healthyLesson);
  });
});
