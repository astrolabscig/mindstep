# Deployment

## Environment used for this submission

Local development/production build on Windows:

```bash
npm install
npm run seed            # optional; the app self-seeds a fresh db on first run
npm run dev             # dev: http://localhost:3000
# or
npm run build && npm start   # production build served from .next
```

No environment variables are required in local mode. `ADMIN_KEY` (≥ 8 chars)
is needed only if the moderation area is part of the demo; without it `/admin`
shows why it is disabled and all admin actions are rejected server-side.

## What we actually deployed vs. what we did not

- **Done and verified:** production build (`npm run build`) compiles clean and
  `npm start` serves it; data persists to `data/mindstep-db.json`.
- **Not done, and not claimed:** any cloud hosting deployment. The project is
  not a git repo in this workspace (by assignment design it is a local
  deliverable), no Vercel/GitHub deploy was performed, and the Supabase
  adapter is documented (see `docs/architecture.md`) but intentionally
  inactive: `SUPABASE_URL`/`SUPABASE_ANON_KEY` are absent, so
  `persistenceMode()` returns `"local"` and no copy claims otherwise.

## Deploying on typical environments (if desired later)

- **Any Node host:** run `npm ci && npm run build && npm start`; mount a
  writable directory for DB file, or set `MINDSTEP_DATA_DIR`.
- **Vercel/other serverless:** avoid local file store (no writable FS) — only
  appropriate after the Supabase adapter swap. Until then, do not claim it.
- **Files NOT to ship anywhere:** `data/mindstep-db.json` (contains demo
  profiles and any real local user data), `.env.local`.

## Seed / reset

```bash
npm run seed         # clean register (empty profiles, audit revision entry)
npm run seed:demo    # clean register + one demo profile; prints its ms_sid
```

Resetting between demo runs is a seed away; the running server picks the new
file up via mtime check (no restart needed).
