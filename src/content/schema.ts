import { z } from "zod";

/**
 * MINDSTEP content schemas.
 *
 * All shipped educational content (modules, lessons, quizzes, scenarios,
 * support services, references) is plain typed data validated with Zod at
 * import time. Invalid content fails loudly (build/test time), never silently.
 *
 * These schemas mirror the production database model documented in
 * `docs/architecture.md` and `supabase/schema.sql`.
 */

/* ── References ──────────────────────────────────────────── */

export const referenceSchema = z.object({
  id: z.string().regex(/^R\d+$/),
  title: z.string().min(3),
  institution: z.string().min(2),
  year: z.number().int().min(1997).max(2030),
  url: z.string().url(),
  /** Last date we retrieved and checked this source. */
  accessDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Reference = z.infer<typeof referenceSchema>;

/* Re-exported inferred domain types (used across app + lib). */
export type Lesson = z.infer<typeof lessonSchema>;
export type SupportService = z.infer<typeof supportServiceSchema>;

/* ── Modules & lessons ───────────────────────────────────── */

export const moduleSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  order: z.number().int().min(1),
  title: z.string().min(3),
  summary: z.string().min(10),
  /** One-line description of why this module exists (shown on the landing page). */
  problem: z.string().min(10),
  estimatedMinutes: z.number().int().min(1),
  lessonIds: z.array(z.string()).min(1),
  quizQuestionIds: z.array(z.string()).min(2),
});

export const lessonSectionSchema = z.object({
  id: z.string(),
  heading: z.string().min(3),
  body: z.string().min(20),
  /** Optional deeper explanation, progressively disclosed. */
  detail: z.string().min(20).optional(),
  /** Optional short example drawn from everyday Ghanaian student/young-adult life. */
  example: z.string().min(20).optional(),
});

export const lessonSchema = z.object({
  id: z.string().min(3),
  moduleId: z.string().min(3),
  order: z.number().int().min(1),
  title: z.string().min(3),
  objective: z.string().min(10),
  sections: z.array(lessonSectionSchema).min(3),
  keyPoints: z.array(z.string()).min(2),
  /** Reference ids that back the substantive claims in this lesson. */
  referenceIds: z.array(z.string().regex(/^R\d+$/)).min(1),
  /** Educational, never diagnostic. */
  disclaimer: z.string().refine((s) => s.includes("educational"), {
    message: "Lesson disclaimer must state the content is educational.",
  }),
  quizQuestionIds: z.array(z.string()).min(2),
});

/* ── Quizzes ─────────────────────────────────────────────── */

export const quizOptionSchema = z.object({
  text: z.string().min(1),
  /** Short explanation shown after answering, for each option. */
  feedback: z.string().min(10),
});

export const quizQuestionSchema = z.object({
  id: z.string().min(3),
  moduleId: z.string().min(3),
  prompt: z.string().min(10),
  options: z.array(quizOptionSchema).min(3).max(5),
  correctIndex: z.number().int().min(0),
  /** Educational principle behind the question. */
  principle: z.string().min(10),
  referenceIds: z.array(z.string().regex(/^R\d+$/)).min(1),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

/* ── Scenarios ───────────────────────────────────────────── */

export const scenarioChoiceSchema = z.object({
  id: z.string(),
  text: z.string().min(5),
  /** How well this choice responds to the situation. */
  quality: z.enum(["best", "acceptable", "poor"]),
  /** What the user handled well. Always present; feedback is never shaming. */
  strengths: z.string().min(15),
  /** Limits of this choice, even for the best one. */
  limitations: z.string().min(15),
  /** What plausibly happens next. */
  consequence: z.string().min(15),
  /** Node id to go to next. Terminal considerations live on the node. */
  next: z.string().min(2),
});

export const scenarioNodeSchema = z
  .object({
    id: z.string(),
    /** Situation narration / continuation, shown before the choice. */
    narration: z.string().min(20),
    prompt: z.string().min(5),
    /** ≥1 choice for decision nodes; the (single) terminal node has none, 
     * cross-reference validation enforces exactly one 0-choice terminal. */
    choices: z.array(scenarioChoiceSchema).max(4),
  })
  .superRefine((node, ctx) => {
    if (node.choices.length >= 2) {
      const ids = node.choices.map((c) => c.id);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({ code: "custom", message: `Duplicate choice ids in node ${node.id}` });
      }
    }
  });

export const scenarioEndSchema = z.object({
  /** Educational principle summary. */
  principles: z.array(z.string().min(15)).min(1),
  /** Optional concrete next steps surfaced through the product (never "just get over it"). */
  nextStep: z.string().min(15),
  nextStepLink: z.string().regex(/^\//),
});

export const scenarioSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(3),
  summary: z.string().min(10),
  /** Where this scene takes place / who is involved. */
  context: z.string().min(20),
  moduleId: z.string().min(3),
  minutes: z.number().int().min(1),
  nodes: z.array(scenarioNodeSchema).min(3),
  startNodeId: z.string().min(2),
  end: scenarioEndSchema,
});
export type Scenario = z.infer<typeof scenarioSchema>;

/* ── Support services ────────────────────────────────────── */

export const serviceTypes = z.enum([
  "helpline",
  "hospital",
  "clinic",
  "counselling",
  "emergency",
  "directory",
]);
export type ServiceType = z.infer<typeof serviceTypes>;

export const verificationSchema = z.object({
  /** "verified" = confirmed against the cited official source at the date. */
  status: z.enum(["verified", "awaiting-verification"]),
  sourceTitle: z.string().min(3),
  sourceUrl: z.string().url(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Human-readable note about what exactly was verified. */
  note: z.string().min(5),
});

export const supportServiceSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  region: z.string().min(2),
  city: z.string().min(2).nullable(),
  description: z.string().min(10),
  types: z.array(serviceTypes).min(1),
  /** E.164-style local display number, only when published in a cited source. */
  /** Ghana emergency numbers can be 3 digits (112); helplines 10. */
  phone: z.string().min(3).nullable(),
  phoneNote: z.string().min(5).nullable().optional(),
  website: z.string().url().nullable(),
  /** Deliberately null when unverified. We never invent addresses. */
  address: z.string().min(5).nullable(),
  costInfo: z.string().min(10).nullable(),
  accessibility: z.string().min(10).nullable(),
  verification: verificationSchema,
});
