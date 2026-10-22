# Architecture

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript (strict)** — server-first;
  every user mutation is a Server Action validated with **Zod** on the server.
- **Tailwind CSS v4** with a design-token `@theme` (forest `#0E2928`, sage
  `#B8F28B`, canvas `#F6F8F5`, quietblue `#E8EEFF`) in `src/app/globals.css`.
- **Vitest** (jsdom) for tests; no paid services anywhere.

## Directory map

```
src/
  content/        # Code-based content: schema (Zod) + modules/lessons/quizzes/
                  # scenarios/support-services/references + index.ts assembly.
                  # Validated (schema + cross-references + graph reachability)
                  # at import — a content error fails build/test, not users.
  lib/
    domain/       # Pure logic: quiz scoring, recommend (explainable),
                  # scenario graph, directory filter, progress metrics.
    store/        # types.ts (shape, mirrors supabase/schema.sql) +
                  # file-store.ts (atomic local JSON persistence).
    session.ts    # cookie + id primitives — the ONLY cookie module.
    env.ts        # the ONLY module reading env vars.
    server/       # profile.ts — resolves profile from cookie for RSCs.
  app/
    actions.ts    # all mutations (one file so access rules are auditable)
    ...routes
docs/, scripts/seed.ts, tests/
```

## Data model (local mode)

`data/mindstep-db.json` (shape in `src/lib/store/types.ts`):

- `profiles: Record<profileId, Profile>` — id, onboarding, lessonProgress,
  savedLessonIds, quizAttempts, scenarioRuns, preferences. There are no account,
  email, password, or planner-record fields.
- `verifications[]` — one entry per admin re-verification of a service.
- `revisions[]` — append-only audit log for admin actions and seeds.
- `overrides.unpublishedLessonIds[]` — publication overrides on content.

Writes are atomic (temp file + rename); a process-wide cache re-checks mtime so
the seed script can change data under a running server.

## Session & access rules (the important part)

1. A learner session binds to an httpOnly, same-site cookie `ms_sid`
   (UUID). The server NEVER accepts a profile id from any client input —
   `withProfile()`/`currentProfile()` resolve the profile from the cookie only.
   This is enforced by construction and statically tested
   (`tests/access-control.test.ts`: no server action signature takes a profile id;
   no Zod schema has a profileId field).
2. There is no registration, sign-in, or account record. Every visitor is a
   browser-scoped guest with the same access to the full app.
3. Admin state is a separate 8-hour httpOnly cookie `ms_admin`, granted only
   after a constant-time comparison against `ADMIN_KEY`. Every admin mutation
   (`adminSetLessonPublished`, `adminVerifyService`) re-checks `readAdminFlag()`
   server-side and appends to `revisions[]`.
4. `deleteMyData()` resets the profile record for the session — the privacy
   page exposes it directly.

## Learning loop (Understand → Practise → Next step)

- **Understand:** lessons with inline citations (`Citation` component opens the
  R-reference with access date) and embedded mini-checks.
- **Practise:** knowledge checks are shuffled server-side deterministically and
  scored server-side (`submitQuizAttempt` ignores client-computed results; only
  answers belonging to the module are accepted, once each).
- **Next step:** `recommend.ts` builds an explainable queue (quiz-rereview →
  continue-lesson → next-lesson → practice). Every item carries a
  human-readable `reason`; there is no opaque ranking.

Scenario runs record `worstChoiceQuality` only — no free-text, no "mood" data
anywhere in the schema.

## Production path (documented, intentionally NOT claimed as working)

`persistenceMode()` (in `lib/env.ts`, the single env reader) switches to
`"supabase"` only when both `SUPABASE_URL` (https) and `SUPABASE_ANON_KEY`
are present. The intended production adapter (schema at `supabase/schema.sql`,
types mirror it) still needs:

1. A data-access layer swap behind `readDb/persist` (same function signatures).
2. Real credentials + a deployment smoke test (open a card → refresh → persist).
3. Re-verification of every claim in `docs/safety-and-privacy.md` in that mode.

Because those credentials do not exist in this environment, no part of this
build claims cloud persistence.
