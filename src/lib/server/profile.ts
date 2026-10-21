import "server-only";
import { readDb, ensureProfile } from "@/lib/store/file-store";
import type { Profile } from "@/lib/store/types";
import { readSessionProfileId } from "@/lib/session";

/**
 * Server-side profile access for Server Components.
 *
 * Ownership rule: a profile is resolved ONLY from the session cookie.
 * No server function accepts a profile id from any client input, so
 * cross-profile access is impossible by construction (tested).
 */

export type CurrentProfile =
  | { kind: "anonymous"; profile: null; profileId: null }
  | { kind: "known"; profile: Profile; profileId: string };

export async function currentProfile(): Promise<CurrentProfile> {
  const id = await readSessionProfileId();
  if (!id) return { kind: "anonymous", profile: null, profileId: null };
  const db = readDb();
  const profile = getOrCreate(db, id);
  return { kind: "known", profile, profileId: id };
}

function getOrCreate(db: ReturnType<typeof readDb>, id: string): Profile {
  const found = db.profiles[id];
  if (found) return found;
  // The cookie may have been set by a server action whose profile record
  // has not been materialised yet (see ensureProfile in actions.ts).
  return ensureProfile(db, id);
}

export async function profileExists(): Promise<boolean> {
  const id = await readSessionProfileId();
  if (!id) return false;
  return Boolean(readDb().profiles[id]);
}
