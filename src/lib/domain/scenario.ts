import type { Scenario } from "@/content/schema";

/**
 * Scenario engine.
 * Navigation is a pure function over validated scenario graphs
 * (graphs are validated at import time in `src/content/index.ts`).
 */

export type ScenarioStep =
  | {
      type: "node";
      node: { id: string; narration: string; prompt: string };
      choices: Scenario["nodes"][number]["choices"];
    }
  | { type: "end" };

export function getStep(scenario: Scenario, nodeId: string): ScenarioStep {
  const node = scenario.nodes.find((n) => n.id === nodeId);
  if (!node) return { type: "end" };
  if (node.choices.length === 0) return { type: "end" };
  return {
    type: "node",
    node: { id: node.id, narration: node.narration, prompt: node.prompt },
    choices: node.choices,
  };
}

export function getChoice(scenario: Scenario, nodeId: string, choiceId: string) {
  return scenario.nodes
    .find((n) => n.id === nodeId)
    ?.choices.find((c) => c.id === choiceId);
}

/** Path length guard: a session may never walk more nodes than exist twice over. */
export function maxWalkLength(scenario: Scenario): number {
  return scenario.nodes.length * 2;
}

export function scenarioMinutes(scenario: Scenario): number {
  return scenario.minutes;
}
