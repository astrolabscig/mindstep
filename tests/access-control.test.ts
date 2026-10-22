import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { DEFAULT_DB } from "@/lib/store/types";

/**
 * Access-control tests. The security property under test: a profile is
 * selected ONLY by the httpOnly session cookie server-side. No server
 * function accepts a profile id from the client, so a malicious client
 * cannot read or mutate another visitor's data by crafting request bodies.
 *
 * We verify this with static audits over the actions/profile/session
 * modules, plus behavioural checks of the pure store types.
 */

function readRepo(rel: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", rel), "utf8");
}

const ACTION_FILES = ["src/app/actions.ts", "src/lib/server/profile.ts"];

describe("profile access rules (static audits)", () => {
  it("no server mutation function takes a profileId/uid parameter", () => {
    for (const f of ACTION_FILES) {
      const src = readRepo(f);
      const exportedFns = src.match(/export (async )?function \w+\(([^)]*)\)/g) ?? [];
      for (const fn of exportedFns) {
        expect(fn, `${f}: "${fn}" must not accept a profile id parameter`).not.toMatch(
          /profileId|profile_id|userId|uid|ownerId/i,
        );
      }
    }
  });

  it("zod schemas used by actions never include a profile id field", () => {
    const src = readRepo("src/app/actions.ts");
    expect(src).not.toMatch(/profileId:\s*z\./);
    expect(src).not.toMatch(/userId:\s*z\./);
  });

  it("server component profile resolution is cookie-only and takes no arguments", () => {
    const src = readRepo("src/lib/server/profile.ts");
    expect(src).toContain("readSessionProfileId()");
    expect(src).not.toMatch(/currentProfile\(\s*\w/);
  });

  it("session cookie is httpOnly and same-site", () => {
    const src = readRepo("src/lib/session.ts");
    expect(src).toContain("httpOnly: true");
    expect(src).toContain('sameSite: "lax"');
  });

  it("ships with no account, planner, or admin routes", () => {
    const root = path.resolve(__dirname, "..");
    expect(fs.existsSync(path.join(root, "src", "app", "account"))).toBe(false);
    expect(fs.existsSync(path.join(root, "src", "app", "planner"))).toBe(false);
    expect(fs.existsSync(path.join(root, "src", "app", "admin"))).toBe(false);
  });
});

describe("default database shape", () => {
  it("ships empty and isolated — no baked-in profiles that could leak", () => {
    expect(DEFAULT_DB.version).toBe(1);
    expect(Object.keys(DEFAULT_DB.profiles)).toHaveLength(0);
  });
});
