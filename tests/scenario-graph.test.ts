import { describe, it, expect } from "vitest";
import { scenarios } from "@/content/scenarios";
import { scenarioById } from "@/content";

/**
 * Scenario graph integrity. The branching engine (scenario-runner) depends
 * on every path terminating, every choice resolving, and every node being
 * reachable — broken graphs would strand a learner mid-scenario.
 */

describe("scenario branch graphs", () => {
  it("every scenario's choices resolve to existing nodes", () => {
    for (const s of scenarios) {
      const ids = new Set(s.nodes.map((n) => n.id));
      for (const n of s.nodes) {
        for (const c of n.choices) {
          expect(ids.has(c.next)).toBe(true);
        }
      }
    }
  });

  it("every path from the start reaches the terminal node (no dead ends, no loops)", () => {
    for (const s of scenarios) {
      const terminal = s.nodes.find((n) => n.choices.length === 0);
      expect(terminal).toBeDefined();
      // DFS with memo: which nodes can reach the terminal?
      const memo = new Map<string, boolean>();
      const canReach = (id: string, stack: Set<string>): boolean => {
        if (id === terminal!.id) return true;
        if (memo.has(id) && !stack.has(id)) return memo.get(id)!;
        if (stack.has(id)) return false; // loop
        stack.add(id);
        const node = s.nodes.find((n) => n.id === id)!;
        const result = node.choices.some((c) => canReach(c.next, stack));
        stack.delete(id);
        memo.set(id, result);
        return result;
      };
      for (const n of s.nodes) {
        expect(canReach(n.id, new Set()), `${s.id}/${n.id} must reach terminal`).toBe(true);
      }
    }
  });

  it("every choice has strengths/limitations/consequence feedback and a quality marker", () => {
    for (const s of scenarios) {
      for (const n of s.nodes) {
        for (const c of n.choices) {
          expect(c.strengths.length).toBeGreaterThan(10);
          expect(c.limitations.length).toBeGreaterThan(10);
          expect(c.consequence.length).toBeGreaterThan(10);
          expect(["best", "acceptable", "poor"]).toContain(c.quality);
        }
      }
    }
  });

  it("scenario lookups resolve and start nodes exist", () => {
    for (const s of scenarios) {
      expect(scenarioById(s.id)?.id).toBe(s.id);
      expect(s.nodes.find((n) => n.id === s.startNodeId)).toBeDefined();
    }
  });
});
