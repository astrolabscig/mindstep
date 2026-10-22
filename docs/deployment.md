# Deployment

## Environment used for this build

Local development/production build on Windows:

```bash
npm install
npm run seed            # optional; the app self-seeds a fresh db on first run
npm run dev             # dev: http://localhost:3000
# or
npm run build && npm start   # production build served from .next
```

No environment variables are required in local mode, and there is no admin
login or moderation back office to configure.

## What we actually deployed vs. what we did not

- **Done and verified:** production build (`npm run build`) compiles clean and
  `npm start` serves it; data persists to `data/mindstep-db.json`.
- **Not done, and not claimed:** any cloud hosting deployment. The source can
  be pushed to GitHub, but no hosted app, Vercel deploy, or production backend
  was performed. The Supabase adapter is documented (see
  `docs/architecture.md`) but intentionally inactive: `SUPABASE_URL` /
  `SUPABASE_ANON_KEY` are absent, so `persistenceMode()` returns `"local"` and
  no copy claims otherwise.

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
