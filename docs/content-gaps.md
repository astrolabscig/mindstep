# Content gaps & expert-review flags

Open items after the content-lead replacement (2026-10-19).

## Needs expert review before widening claims
1. **`body-anxiety` card** — states racing heart / tight chest "often" is the body
   bracing and includes a deliberate "get it checked" step. Physical symptoms can
   have cardiac, thyroid or other organic causes; wording reviewed but a clinician
   should sanity-check the framing before any wider claim is added.
2. **`feeling-flat` card** — "two weeks or more → book a health centre visit" follows
   standard public-health phrasing but should be confirmed against Ghana's MHA
   patient-guidance wording.
3. **`myths-that-hurt` card** — the "contagion is false" correction is supported by
   the evidence summary in `docs/health-references.md` (R2, R3); a Ghanaian mental
   health professional should confirm the answer examples read right for local context.

## Illustration notes (professional set, nearest-match used)
- **grief/loss theme** — no card exists yet (deliberately deferred: needs culturally
  reviewed content first, see expert list).
- **feeling-flat** uses the professional `low-mood` / feeling-blue illustration; a
  future custom "heavy grey morning" piece could still be more specific.
- **words-dont-come** uses `you-matter`; a future custom "two people in comfortable
  silence" piece could still be more specific.
- Drop-in fix: a new SVG can replace any of these by filename (see illustration-map).

## Voice gap
- All narration uses **one warm US-English voice** (Piper `en_US-amy-medium`, offline,
  MIT). No Ghana-accented English neural voice ships in any free license we can
  bundle; the moment an acceptable one exists, re-run
  `npx tsx scripts/generate-voice-cards.ts` with it — scripts and card text already
  work with any Piper voice.

## Legacy deletion (next pass)
- `/learn`, `/lesson/*`, `/quiz/*`, `/progress`, `/get-started` are unlinked but live
  for the demo. After the panel demo: delete routes + legacy tests, keep `/topics`,
  `/scenarios`, `/support`, `/planner`, `/safety`, `/account`.

## Verification checklist (status)
- [x] No duplicate topic content — one best version per topic in `cards.ts`
- [x] Every card has a green-palette illustration (12/12, same source & style)
- [x] Every card has a voice script + bundled MP3 + text version (12/12)
- [x] Tone check: warm, grade 6–8, non-clinical, person-first, no diagnosing
- [x] Crisis info present and always visible (header chip `/safety`)
- [x] All licenses and attributions logged (docs/illustration-map.md)
- [x] Alt text present on all images (art.tsx registry)
