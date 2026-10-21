/**
 * Reproducible seed — resets the local-mode database to a known state.
 *
 *   node scripts/seed.ts          # reset to a clean register
 *   node scripts/seed.ts --demo   # additionally add one demo profile with
 *                                 # sample progress, so reviewers can see
 *                                 # the progress page without clicking through
 *
 * The demo profile binds to the printed session id: set the `ms_sid` cookie
 * to that value (or sign up fresh on /get-started) to browse as the demo user.
 *
 * The file store honours MINDSTEP_DATA_DIR if set; defaults to ./data.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Node 24 strips types natively; explicit .ts extension is required here.
const store = await import(new URL("../src/lib/store/types.ts", import.meta.url).href);
const { DEFAULT_DB } = store as { DEFAULT_DB: unknown };

const DATA_DIR = process.env.MINDSTEP_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "mindstep-db.json");

const wantDemo = process.argv.includes("--demo");

type Db = {
  version: 1;
  profiles: Record<string, unknown>;
  verifications: unknown[];
  revisions: { id: string; at: string; actor: string; action: string; summary: string }[];
  overrides: { unpublishedLessonIds: string[] };
};

const db = structuredClone(DEFAULT_DB) as Db;
db.revisions.push({
  id: `rev_${crypto.randomBytes(8).toString("hex")}`,
  at: new Date().toISOString(),
  actor: "seed",
  action: "seed",
  summary: `Database seeded by scripts/seed.ts at ${new Date().toISOString()}${wantDemo ? " (with demo profile)" : ""}.`,
});

if (wantDemo) {
  const id = crypto.randomUUID();
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();
  db.profiles[id] = {
    id,
    kind: "guest",
    createdAt: daysAgo(12),
    onboarding: { goal: "support-others", topics: ["stigma", "communication"], pace: "steady", completedAt: daysAgo(12) },
    lessonProgress: {
      "fundamentals-what-is-mental-health": { completed: true, lastSectionId: "check", savedAt: daysAgo(10) },
      "fundamentals-myths-vs-facts": { completed: true, lastSectionId: "check", savedAt: daysAgo(9) },
      "stress-what-happens-in-your-body": { lastSectionId: "signs", savedAt: daysAgo(2) },
    },
    savedLessonIds: ["fundamentals-myths-vs-facts"],
    quizAttempts: [
      { id: `qa_${crypto.randomBytes(8).toString("hex")}`, moduleId: "mental-health-fundamentals", percentage: 85, correct: 4, total: 4, attemptedAt: daysAgo(9), missedQuestionIds: [] },
      { id: `qa_${crypto.randomBytes(8).toString("hex")}`, moduleId: "stress-coping", percentage: 65, correct: 4, total: 6, attemptedAt: daysAgo(3), missedQuestionIds: ["stress-q2", "stress-q4"] },
    ],
    scenarioRuns: [
      { id: `run_${crypto.randomBytes(8).toString("hex")}`, scenarioId: "worried-friend", finishedAt: daysAgo(6), worstChoiceQuality: "acceptable" },
    ],
    actions: [
      { id: `act_${crypto.randomBytes(6).toString("hex")}`, kind: "identify-trusted-person", title: "Ask Efua if she can come with me to the clinic", detail: "She went with her brother last year.", done: true, createdAt: daysAgo(5), doneAt: daysAgo(4) },
      { id: `act_${crypto.randomBytes(6).toString("hex")}`, kind: "prepare-questions", title: "Write three questions to ask at the OPD", detail: "", done: false, createdAt: daysAgo(4), doneAt: null },
    ],
    preferences: {},
  };
  db.revisions.push({
    id: `rev_${crypto.randomBytes(8).toString("hex")}`,
    at: new Date().toISOString(),
    actor: "seed",
    action: "seed-demo-profile",
    summary: `Added demo profile — set cookie ms_sid=${id} to browse as the demo user.`,
  });
  console.log(`Demo profile session id (set cookie ms_sid to this): ${id}`);
}

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
console.log(`Seeded ${DB_FILE}`);
