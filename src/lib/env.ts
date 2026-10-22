import "server-only";

/**
 * Configuration layer, the ONLY module that reads environment variables.
 * MINDSTEP deliberately ships in "local mode": no cloud credentials exist
 * in this environment, so user data persists to a local JSON file with
 * cookie-scoped profiles. Setting SUPABASE_* variables switches the
 * documented production adapter (implementation notes in docs/architecture.md);
 * until those credentials are supplied AND verified by a deployment check,
 * the app must not claim cloud persistence.
 */

export type PersistenceMode = "local" | "supabase";

export function persistenceMode(): PersistenceMode {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (typeof url === "string" && url.startsWith("https://") && typeof key === "string" && key.length > 20) {
    return "supabase";
  }
  return "local";
}

export function isLocalMode(): boolean {
  return persistenceMode() === "local";
}

export function configSummary() {
  return { mode: persistenceMode() };
}

export function requiredEnvVar(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable ${name}`);
  return v;
}
