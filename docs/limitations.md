# Limitations (read before trusting anything to this build)

This is an internship assignment deliverable: an honest educational demo built
to the brief, not a certified clinical, privacy, or accessibility product.

## Domain boundaries

- **Educational only.** Content is drawn from published sources (see
  `docs/health-references.md`), but the curriculum itself is unvalidated by
  user research — no learner study, no pilot, no outcome measures were run.
- **No clinical claims.** Knowledge checks recall lesson text; nothing here
  screens, diagnoses, or predicts anything in anyone. Demos showing "85% on
  Module 1" mean *quiz recall*, not wellbeing.
- **No monitoring.** There is no crisis detection, mood tracking, sentiment
  analysis, alerting, or human review. If someone uses MINDSTEP during a real
  crisis, the platform will not notice. The product says this on `/safety`
  because it is true, not as a disclaimer formality.
- **Not therapy-adjacent by inference.** The planner stores user-authored
  actions only; nothing suggests self-treatment, medication changes, or
  diagnosis-seeking shortcuts.

## Evidence honesty

- The web-education intervention literature (R2) supports knowledge gains —
  the same meta-analysis found **no significant effect on stigma or
  help-seeking intention**. MINDSTEP's promises are scoped accordingly;
  slogans like "reduce stigma" are deliberately absent.
- Scenario feedback is expert-authored, not clinically reviewed.
- The directory contains only entries we could verify against cited sources
  (mostly national-level and Greater Accra facilities); regional coverage
  across all 16 regions is incomplete and marked honestly where unknown.

## Engineering limitations

- **Local mode by design:** file-backed JSON, single process, plaintext at
  rest; no backups, no multi-instance concurrency beyond atomic renames. Two
  browsers write concurrently only through the last-wins rename.
- **Supabase path is documentation, not a feature.** Setting the env vars is
  not sufficient; the adapter, schema, and verified deployment are future
  work (docs/architecture.md). No part of this submission claims cloud
  persistence.
- **Sessions are cookie-based and admin key is a shared secret** — fine for a
  classroom demo; not fine for production (no per-moderator identity, 2FA,
  session revocation, or rate limiting on auth endpoints in this build).
- `npm audit` has 5 high-severity findings in the dev-only ESLint chain
  (documented in docs/qa-report.md — deliberately not force-fixed).
- No e2e/browser tests; unit coverage is 41 tests over content integrity,
  domain logic, graphs and access control.
- Some shell/PowerShell environment quirks affected earlier dev iterations
  (documented in docs/qa-report.md), not the product itself.

## Accessibility posture

Implemented by pattern (semantic landmarks, keyboard operability, visible
focus, non-colour-only feedback, prefers-reduced-motion support, min 44px-ish
targets, labelled fields with typed hints and non-colour error text), but
**not auditor-verified**: no screen-reader checklist, no contrast audit on the
dark footer band, and the scenario runner's phase indicators are currently
hard for non-visual users. Treat `/accessibility` as "designed for WCAG 2.1
AA, unverified" — not as a claim of conformance.

## Voice and illustration specifics (added 18 October 2026, updated 19 October)

- **Primary "Listen" voice: bundled neural MP3s, generated OFFLINE before the
  demo.** `scripts/generate-voice.ts` and `scripts/generate-voice-cards.ts`
  pipe the lesson deck + all 12 topic cards' text through
  **Piper** (rhasspy/piper) — a fully local, MIT-licensed neural TTS engine
  — producing natural human-quality audio in `public/voice`
  (~17 MB, 64 lesson files, voice `en_US-amy-medium`) and
  `public/voice/cards` (12 files, card scripts mirrored in `docs/voice/*.txt`).
  At runtime the app serves static files:
  no cloud, no API keys, no paid service at build or run time. This is a
  **stock natural voice, not a clone of a specific real person** — voice
  cloning would need that person's consent and a licensed pipeline, which
  this project does not have. No free Ghana-accented English neural voice
  was available to bundle; the moment one is, re-running the generator
  scripts replaces every audio file with zero app-code changes. The 60 MB
  Piper model/binary live in `tools/piper/` and are not part of the web bundle.
- **Fallback voice: the device's own speech synthesis** (Web Speech API),
  used only when a bundled file is missing or playback fails. Device voices
  vary wildly — on this machine only legacy robotic SAPI voices (Zira/
  Hazel) are installed, so the fallback IS robotic here. The bundled Piper
  audio is what you hear by default.
- **Illustrations: the unDraw professional vector set** (`public/art/*.svg`,
  open licence, no attribution required; not MIT), recoloured to the MINDSTEP
  teal/forest/mint palette. The set covers the landing page, get-started,
  topics, dashboard, module/lesson, practice, support, progress, planner, safety,
  and research (see `docs/illustration-map.md`).
  The earlier three.js "calm mind" hero scene was removed on user feedback
  (2026-10-19) and replaced by the motion-explainer system (`docs/ui-spec.md`),
  which animates concepts with pure CSS scenes + bundled voice-overs
  (`public/voice/motion/*.mp3`, same offline Piper engine).
  Idle float/sway animations
  are pure CSS and fully disabled under `prefers-reduced-motion`. They are
  decorative-comprehension aids with text alternatives; they contain no
  clinical imagery and imply no diagnostic meaning. User-supplied art can
  replace any file by name with zero code changes.

## If anything here is used to make claims elsewhere

Do not. Re-read `docs/qa-report.md` §5 (known failures) first, and treat any
future "MINDSTEP reduces stigma/wellbeing/illness" sentence as a defect.
