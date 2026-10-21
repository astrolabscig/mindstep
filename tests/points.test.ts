import { describe, it, expect } from "vitest";
import { buildPoints, keyLineFrom, splitSentences } from "@/lib/domain/points";
import { lessons } from "@/content/lessons";

const sample = {
  id: "test-lesson",
  moduleId: "test-module",
  order: 1,
  title: "Test lesson",
  objective: "Understand the test structure.",
  sections: [
    {
      id: "s1",
      heading: "First point",
      body: "Mental health is health. It covers how we think, feel and cope. Everyone has it.",
      detail: "Detail paragraph exists for depth seekers.",
      example: "Ama felt restless before exams.",
    },
    {
      id: "s2",
      heading: "Second point",
      body: "A very long first sentence without terminal punctuation flows on an on and does not stop and therefore cannot be split cleanly at any boundary because there is no punctuation and the parser must fall back gracefully and still produce a single usable key line for the card without crashing or losing text",
      detail: "Extra depth.",
    },
  ],
  keyPoints: ["Health applies to the mind too", "Recovery is common with support"],
  disclaimer: "This lesson is educational only.",
  quizQuestionIds: ["q-test-1"],
} as unknown as Parameters<typeof buildPoints>[0];

describe("point-by-point delivery (micro-learning cards)", () => {
  it("splits prose on sentence boundaries", () => {
    expect(splitSentences("Mental health is health. Everyone has it! Right?")).toEqual([
      "Mental health is health.",
      "Everyone has it!",
      "Right?",
    ]);
  });

  it("key line is the first sentence, verbatim", () => {
    const key = keyLineFrom("Recovery is common. Many people improve with support.");
    expect(key).toBe("Recovery is common.");
  });

  it("long unpunctuated text still yields a capped key line without emptying", () => {
    const long = "a".repeat(300);
    const key = keyLineFrom(long);
    expect(key.length).toBeLessThanOrEqual(170 + 1); // + ellipsis char
    expect(key.startsWith("aaa")).toBe(true);
  });

  it("one card per section plus exactly one summary card", () => {
    const points = buildPoints(sample);
    expect(points.length).toBe(sample.sections.length + 1);
    expect(points.filter((p) => p.isSummary).length).toBe(1);
    expect(points[0].sectionId).toBe("s1");
    expect(points[points.length - 1].sectionId).toBe("");
  });

  it("summary card carries the hand-authored key points and disclaimer", () => {
    const summary = buildPoints(sample).at(-1)!;
    expect(summary.bullets).toEqual(["Health applies to the mind too", "Recovery is common with support"]);
    expect(summary.disclaimer).toContain("educational");
  });

  it("real content: every lesson produces a deck with non-empty key lines and the disclaimer", () => {
    for (const lesson of lessons) {
      const points = buildPoints(lesson);
      expect(points.length).toBeGreaterThanOrEqual(4); // min 3 sections + summary
      for (const p of points) {
        expect(p.key.length).toBeGreaterThan(0);
        expect(p.key.startsWith(" ") || p.key.endsWith(" ") && !p.key.endsWith("…")).toBe(false);
      }
      expect(points.at(-1)?.disclaimer).toMatch(/educational/);
    }
  });

  it("key line never rewrites the text (ellipsis cuts are the only edit)", () => {
    const body = "First.? Second. Third.";
    const points = buildPoints({ ...sample, sections: [{ id: "x", heading: "H", body }] } as unknown as Parameters<typeof buildPoints>[0]);
    expect(points[0].key).toBe("First.?");
  });
});
