import { DEFAULT_DB, type Db } from "./types";

/**
 * File-backed store. Development/local mode only. See docs/architecture.md
 * for the documented production path (Supabase adapter, SQL in supabase/schema.sql).
 *
 * Guarantees:
 * - Atomic writes (write to temp file, rename over the target).
 * - One process-wide instance (dev server may reload modules; we cache by
 *   resolved path + check mtime to pick up external edits, e.g. the seed script).
 * - Pure in-memory version (`createMemoryDb`) for unit tests.
 */

import fs from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.MINDSTEP_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "mindstep-db.json");

export function createMemoryDb(): Db {
  return structuredClone(DEFAULT_DB);
}

let cache: { db: Db; loadedAt: number } | null = null;

function statMtime(): number {
  try {
    return fs.statSync(DB_FILE).mtimeMs;
  } catch {
    return -1;
  }
}

export function readDb(): Db {
  const mtime = statMtime();
  if (cache && cache.db && mtime === cache.loadedAt) return cache.db;
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Db;
    if (parsed?.version !== 1 || typeof parsed?.profiles !== "object") {
      throw new Error("Database file has an unexpected shape. Re-run the seed script");
    }
    cache = { db: parsed, loadedAt: mtime };
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("[mindstep] failed to read db file, falling back to empty db", err);
    }
    const fresh = createMemoryDb();
    cache = { db: fresh, loadedAt: mtime };
    persist(fresh);
    return fresh;
  }
}

export function persist(db: Db): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = path.join(DATA_DIR, `.mindstep-db-${Date.now()}.tmp`);
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_FILE);
  // Update cache timestamp to avoid a stale mtime reload on next read.
  cache = { db, loadedAt: statMtime() };
}

export function mutateDb(fn: (db: Db) => void): void {
  const db = readDb();
  fn(db);
  persist(db);
}

/* ── Profile helpers ──────────────────────────────────────── */

export function getProfile(db: Db, profileId: string) {
  return db.profiles[profileId];
}

export function ensureProfile(db: Db, profileId: string) {
  if (!db.profiles[profileId]) {
    db.profiles[profileId] = {
      id: profileId,
      createdAt: new Date().toISOString(),
      onboarding: null,
      lessonProgress: {},
      savedLessonIds: [],
      quizAttempts: [],
      scenarioRuns: [],
      preferences: {},
    };
  }
  return db.profiles[profileId];
}

export function deleteProfileData(db: Db, profileId: string) {
  db.profiles[profileId] = {
    id: profileId,
    createdAt: new Date().toISOString(),
    onboarding: null,
    lessonProgress: {},
    savedLessonIds: [],
    quizAttempts: [],
    scenarioRuns: [],
    preferences: {},
  };
}
