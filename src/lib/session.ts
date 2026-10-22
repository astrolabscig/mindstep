import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Demo-grade session handling (local mode).
 *
 * - Anonymous learner sessions bind to a stable cookie `ms_sid`,
 *   which is the ONLY key used to select profile data server-side.
 *   Server actions never accept a profile id from the client, so one
 *   visitor cannot read or mutate another visitor's records by
 *   crafting requests (verified by unit tests + access rules below).
 * - There is no account system. A visitor is a guest in this browser.
 *
 * Scope: development/demo. Production hardening steps are documented in
 * docs/safety-and-privacy.md and implemented for real once Supabase
 * credentials are configured (see docs/architecture.md).
 */

export const SESSION_COOKIE = "ms_sid";
export const ADMIN_COOKIE = "ms_admin";

export function newProfileId(): string {
  return crypto.randomUUID();
}

export function newRecordId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

export async function readSessionProfileId(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE)?.value;
  return value && /^[a-f0-9-]{36}$/.test(value) ? value : null;
}

export async function readAdminFlag(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === "1";
}

export async function setSessionCookie(profileId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90-day learner session
  });
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8-hour admin session
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

/* ── Admin authorisation ───────────────────────────────────── */

export function adminKeyConfigured(): boolean {
  return typeof process.env.ADMIN_KEY === "string" && process.env.ADMIN_KEY.length >= 8;
}

export function validateAdminKey(candidate: string): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
