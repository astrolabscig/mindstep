import { z } from "zod";
import {
  moduleSchema,
  lessonSchema,
  quizQuestionSchema,
  scenarioSchema,
  supportServiceSchema,
  referenceSchema,
} from "./schema";
import { modules } from "./modules";
import { lessons } from "./lessons";
import { questions } from "./quizzes";
import { scenarios } from "./scenarios";
import { supportServices } from "./support-services";
import { references, referenceMap } from "./references";

type Lesson = z.infer<typeof lessonSchema>;
type QuizQuestion = z.infer<typeof quizQuestionSchema>;
type Scenario = z.infer<typeof scenarioSchema>;
type SupportService = z.infer<typeof supportServiceSchema>;

/**
 * Content assembly. Every export is validated against its Zod schema on
 * first import, so a content error fails the build/test, not the user.
 */

export function validateContent(): { ok: true } {
  moduleSchema.array().parse(modules);
  lessonSchema.array().parse(lessons);
  quizQuestionSchema.array().parse(questions);
  scenarioSchema.array().parse(scenarios);
  supportServiceSchema.array().parse(supportServices);
  referenceSchema.array().parse(references);
  return { ok: true };
}

/* Cross-reference integrity: no dangling ids anywhere. */

export function validateCrossReferences(): { errors: string[] } {
  const errors: string[] = [];
  const lessonIds = new Set(lessons.map((l) => l.id));
  const moduleIds = new Set(modules.map((m) => m.id));
  const questionIds = new Set(questions.map((q) => q.id));
  const lessonByModule = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const list = lessonByModule.get(l.moduleId) ?? [];
    list.push(l);
    lessonByModule.set(l.moduleId, list);
  }
  const distributedQuestions = new Set<string>();
  for (const l of lessons) for (const q of l.quizQuestionIds) distributedQuestions.add(q);

  for (const m of modules) {
    for (const lid of m.lessonIds) {
      if (!lessonIds.has(lid)) errors.push(`Module "${m.id}" references missing lesson "${lid}"`);
    }
    for (const m2 of lessonByModule.get(m.id) ?? []) {
      if (m2.moduleId !== m.id) errors.push(`Module "${m.id}" lessons contain mismatched module id "${m2.moduleId}"`);
    }
    if ((lessonByModule.get(m.id) ?? []).length !== m.lessonIds.length) {
      errors.push(`Module "${m.id}" lessonIds count does not match attached lessons`);
    }
    for (const qid of m.quizQuestionIds) {
      if (!questionIds.has(qid)) errors.push(`Module "${m.id}" references missing question "${qid}"`);
    }
  }

  for (const l of lessons) {
    if (!moduleIds.has(l.moduleId)) errors.push(`Lesson "${l.id}" references missing module "${l.moduleId}"`);
    for (const rid of l.referenceIds) {
      if (!referenceMap[rid]) errors.push(`Lesson "${l.id}" references missing reference "${rid}"`);
    }
    for (const qid of l.quizQuestionIds) {
      if (!questionIds.has(qid)) errors.push(`Lesson "${l.id}" references missing question "${qid}"`);
    }
  }

  for (const q of questions) {
    if (!moduleIds.has(q.moduleId)) errors.push(`Question "${q.id}" references missing module "${q.moduleId}"`);
    for (const rid of q.referenceIds) {
      if (!referenceMap[rid]) errors.push(`Question "${q.id}" references missing reference "${rid}"`);
    }
  }
  // Each module's quizQuestionIds should equal the union of its lessons' embedded checks (context check on totals)
  for (const m of modules) {
    const embedded = (moduleLessons(m.id) as Lesson[]).flatMap((l) => l.quizQuestionIds);
    const moduleQuiz = new Set(m.quizQuestionIds);
    for (const q of embedded) {
      if (!moduleQuiz.has(q)) errors.push(`Module "${m.id}" quiz omits embedded question "${q}"`);
    }
    for (const q of m.quizQuestionIds) {
      if (!embedded.includes(q)) errors.push(`Module "${m.id}" quiz contains question "${q}" not embedded in any lesson`);
    }
  }

  for (const s of scenarios) {
    if (!moduleIds.has(s.moduleId)) errors.push(`Scenario "${s.id}" references missing module "${s.moduleId}"`);
    const nodeIds = new Set(s.nodes.map((n) => n.id));
    if (!nodeIds.has(s.startNodeId)) errors.push(`Scenario "${s.id}" startNode missing`);
    const dupNodes = s.nodes.map((n) => n.id);
    if (new Set(dupNodes).size !== dupNodes.length) errors.push(`Scenario "${s.id}" has duplicate node ids`);
    for (const n of s.nodes) {
      for (const c of n.choices) {
        if (!nodeIds.has(c.next)) errors.push(`Scenario "${s.id}" node "${n.id}" choice "${c.id}" -> missing node "${c.next}"`);
      }
    }
    // Every path terminates: walk the graph (choices form end via 'end' node with no choices)
    const endNodes = s.nodes.filter((n) => n.choices.length === 0);
    if (endNodes.length !== 1) errors.push(`Scenario "${s.id}" must have exactly one terminal node`);
    const beforeEach = new Set<string>();
    const terminalId = endNodes[0]?.id;
    if (s.end && terminalId) {
      // DFS from start; detect nodes that can never reach the terminal
      const reachesEnd = (id: string, seen: Set<string>): boolean => {
        if (id === terminalId) return true;
        if (seen.has(id)) return false;
        const nextSeen = new Set(seen).add(id);
        return (s.nodes.find((n) => n.id === id)?.choices ?? []).some((c) => reachesEnd(c.next, nextSeen));
      };
      for (const n of s.nodes) {
        if (!reachesEnd(n.id, beforeEach)) errors.push(`Scenario "${s.id}" node "${n.id}" cannot reach the terminal node (possible loop)`);
      }
    }
    for (const s2 of s.nodes) {
      if (s2.id === terminalId && s2.choices.length > 0) errors.push(`Scenario "${s.id}" terminal node has choices`);
    }
  }

  // Orphan check: every question belongs to exactly one module's quiz set
  const moduleQuestionMap = new Map<string, number>();
  for (const m of modules) {
    for (const qid of m.quizQuestionIds) {
      moduleQuestionMap.set(qid, (moduleQuestionMap.get(qid) ?? 0) + 1);
    }
  }
  for (const q of questions) {
    const moduleCount = moduleQuestionMap.get(q.id) ?? 0;
    if (moduleCount !== 1) {
      errors.push(`Question "${q.id}" appears in ${moduleCount} module quiz sets (expected exactly 1)`);
    }
  }

  return { errors };
}

validateContent();
const { errors } = validateCrossReferences();
if (errors.length > 0) {
  throw new Error(`MINDSTEP content validation failed:\n- ${errors.join("\n- ")}`);
}

/* ── Typed accessors ─────────────────────────────────────────── */

export function lessonsOfModule(moduleId: string): Lesson[] {
  return (lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order));
}

export function lessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function moduleLessons(moduleId: string): Lesson[] {
  return lessonsOfModule(moduleId);
}

export function moduleById(id: string): (typeof modules)[number] | undefined {
  return modules.find((m) => m.id === id);
}

export function moduleBySlug(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function questionsOfModule(moduleId: string): QuizQuestion[] {
  return questions.filter((q) => q.moduleId === moduleId);
}

export function questionById(id: string): QuizQuestion | undefined {
  return questions.find((q) => q.id === id);
}

export function scenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function serviceById(id: string): SupportService | undefined {
  return supportServices.find((s) => s.id === id);
}

import { moduleMap } from "@/content/modules";
export { modules, lessons, questions, scenarios, supportServices, references, referenceMap, moduleMap };
