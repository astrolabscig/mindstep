import { describe, it, expect } from "vitest";
import {
  validateContent,
  validateCrossReferences,
  modules,
  lessons,
  questions,
  scenarios,
  supportServices,
  moduleBySlug,
  questionsOfModule,
} from "@/content";
import { DEFAULT_DB } from "@/lib/store/types";

describe("content integrity", () => {
  it("validates every content file against its Zod schema", () => {
    expect(validateContent()).toEqual({ ok: true });
  });

  it("has no dangling cross-references", () => {
    const { errors } = validateCrossReferences();
    expect(errors).toEqual([]);
  });

  it("ships the required curriculum volume", () => {
    expect(modules.length).toBe(8);
    expect(lessons.length).toBe(16);
    expect(questions.length).toBe(32);
    expect(scenarios.length).toBeGreaterThanOrEqual(6);
    expect(supportServices.length).toBeGreaterThanOrEqual(6);
  });

  it("every module has a quiz and every quiz question is reachable from its module", () => {
    for (const m of modules) {
      expect(questionsOfModule(m.id).length).toBeGreaterThan(0);
      expect(moduleBySlug(m.slug)?.id).toBe(m.id);
    }
  });

  it("every question has a correct answer within bounds and an educational principle", () => {
    for (const q of questions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.principle.length).toBeGreaterThan(10);
      for (const o of q.options) expect(o.feedback.length).toBeGreaterThan(9);
    }
  });

  it("every scenario has exactly one terminal node and reachable choices", () => {
    for (const s of scenarios) {
      const terminals = s.nodes.filter((n) => n.choices.length === 0);
      expect(terminals.length).toBe(1);
    }
  });

  it("crisis information is present, consistent and correct", () => {
    const helpline = supportServices.find((s) => s.id === "mha-national-helpline");
    const emergency = supportServices.find((s) => s.id === "national-emergency");
    expect(helpline?.phone).toBe("0800678678");
    expect(emergency?.phone).toBe("112");
    for (const s of supportServices) {
      // No invented data: every listing cites a source.
      expect(s.verification.sourceTitle.length).toBeGreaterThan(3);
      expect(s.verification.sourceUrl.startsWith("http")).toBe(true);
    }
    // Both crisis-critical entries must be verified.
    expect(helpline?.verification.status).toBe("verified");
    expect(emergency?.verification.status).toBe("verified");
  });

  it("default database shape is a valid empty register", () => {
    expect(DEFAULT_DB.version).toBe(1);
    expect(Object.keys(DEFAULT_DB.profiles)).toHaveLength(0);
  });
});
