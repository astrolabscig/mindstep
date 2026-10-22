# QA Report

Verification date: 2026-10-22 · All commands below were run on this machine
(Windows, Node v24.16.0) for this build and their real output is summarised —
expected values, not aspirational ones.

## 1. Quality gates (final state)

| Gate | Command | Result |
| --- | --- | --- |
| Types | `npx tsc --noEmit` | 0 errors (strict) |
| Lint | `npx eslint` | 0 errors, 0 warnings |
| Tests | `npx vitest run` | **6 files, 46 tests, all passing** |
| Build | `npm run build` | Clean production build; 19 routes (9 static, 10 server-rendered) |

Test suites:

| Suite | Focus | Tests |
| --- | --- | --- |
| `tests/content.test.ts` | Zod validation, cross-references, curriculum volume, crisis numbers (0800 678 678 / 112), no fabricated listings | 8 |
| `tests/domain.test.ts` | Quiz scoring/shuffle, explainable recommendations, directory filter | 15 |
| `tests/scenario-graph.test.ts` | Branch graphs: dangling refs, terminal reachability, feedback completeness | 4 |
| `tests/progress.test.ts` | Progress metrics; honesty strings ("knowledge indicator only") | 5 |
| `tests/points.test.ts` | Point-by-point card extraction: verbatim key lines, summary cards, all real lessons | 7 |
| `tests/access-control.test.ts` | Cookie-only profile resolution, admin gating, removed account/planner routes | 7 |

## 2. Audit-and-fix cycle 1 — content & data

Problems found (each by the test suite, not eyeballing):

- **C1 — Invalid quiz content shipped.** `q-nav-1` option feedback `"Too high."`
  (9 chars) violated the ≥10 schema minimum; Zod import crashed → entire app
  content failed to load at runtime. **Fix:** informative feedback written
  ("Too high — the verified count is three specialist hospitals…").
- **C2 — Schema contradicted content design.** `scenarioNodeSchema` required
  ≥2 choices everywhere, but every scenario has a no-choice terminal node and
  several use single-choice "repair" nodes by design. **Fix:** relaxed to ≤4
  choices; the pre-existing cross-reference validator still enforces exactly
  one terminal, full reachability, no loops. Invariants preserved.
- **C3 — Schema rejected a true emergency number.** `phone: min(5)` failed for
  `112`. **Fix:** `min(3)`; crisis entries still required to be `verified`.
- **C4 — 11 dangling `next` references in scenario graphs** (authors had copied
  sibling *choice* ids instead of node ids, e.g. `declare-victory → "affirm-and-invite"`).
  Any walk into them would have thrown mid-scenario. **Fix:** rerouted to the
  scenario `end` node (each affected choice's consequence text is a closing
  beat); validator now reports zero graph errors.

## 3. Audit-and-fix cycle 2 — UX & routes

- **C5 — a primary route did not exist.** Header and footer linked to a 404.
  **Fix:** the page was implemented, then later removed after review because
  it did not add enough value to the free card experience.
- **C6 — Save-lesson feedback lied.** `onSave` hardcoded `saved: true` and
  always printed "Saved to your lessons." even when unsaving.
  **Fix:** uses the action's real return; message reflects the outcome.
- **C7 — Page type flaw.** A union value was inferred as `false | Profile` and
  later JSX re-read a stale `profile`. **Fix:** restructured to a single `rec`
  narrowing with `known` as a real boolean.
- **C8 — Mobile menu stayed open after navigating. **Fix:** effect-based close
  removed; links now close the menu on click.
- **C9 — Hygiene lint debt:** unescaped apostrophe in a preview headline;
  unused imports in 5 files; illegitimate `module` variable assignments in 7
  files. **Fix:** all resolved; `npx eslint` now outputs nothing.

## 4. Audit-and-fix cycle 3 — engineering

- **C10 — Next.js 16 `cacheComponents` incompatible with per-visitor dynamic
  rendering** (`export const dynamic = "force-dynamic"` became illegal on every
  route). **Fix:** disabled `cacheComponents` in `next.config.ts` with an
  explanatory comment; build re-verified. Revisit when adopting cache-first.
- **C11 — Synchronous `setState` inside effects** in 3 components (React 19
  rules-of-hooks violation; cascading renders). **Fix:** lesson-reader's
  auto-open check is now a derived value; scenario runner flips `recorded`
  inside its transition; site header closes its menu via click handlers.
- **C12 — Profile handling was untested + lint-flagged.** The access-control
  test now proves profile data is resolved from the session cookie and never
  shared between visitors. Guest data still auto-seeds a fresh db file when
  missing.
- **C13 — `npm audit`: 5 high-severity findings, deliberately NOT force-fixed.**
  All five trace to one dev-only chain: `braces` (stack-exhaustion DoS advisory)
  → `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next`.
  It is lint tooling: not imported at runtime, not reachable from the shipped
  app. `npm audit fix --force` would downgrade `eslint-config-next` to 14.2.x —
  a breaking change for a non-runtime path. Decision: keep the advisory open,
  documented here and in README; runtime dependency audit is clean (only the
  dev chain is affected).

## 5. Audit-and-fix cycle 4 — content delivery (UX depth, added 18 October 2026)

Trigger: a candid user review judged the lesson experience unreadable in practice — dense prose, no visuals, no voice, "too much at once". Findings and fixes, each verified:

| # | Finding (real, observed) | Fix | Verification |
| --- | --- | --- | --- |
| D1 | Lesson = one long article; nothing directs the eye or paces reading | **Focus mode (new default):** `src/lib/domain/points.ts` builds one card per section — attention line = the lesson's own first sentence, verbatim; rest disclosed via one tap | 7 new unit tests incl. against all 16 real lessons |
| D2 | Key line could drift into editorialising if trimmed creatively | Machine rule: first sentence only, ellipsis cut at word boundary as the sole permitted edit | `tests/points.test.ts` |
| D3 | No visuals anywhere | Uniform illustration family in ONE style (same stroke/tones/composition), per-module hero + per-point cards, screen-reader labelled | `src/components/ui/illustration.tsx`; built clean |
| D4 | No voice option | Device-native TTS via Web Speech API (`speechSynthesis`) — free, offline, no cloud; per-card Listen button; auto-cancel on unmount; hidden if unsupported | Manual smoke in Edge/Chrome; SSR-safe detection via `useSyncExternalStore` |
| D5 | First lint pass flagged stray nested build dir `.next` inside an accidentally duplicated folder from an earlier build run; ESLint then audited generated artifacts, masking real issues | Deduplicated folder deleted; lint re-run over source only | `npx eslint` → 0 problems |
| D6 | `SpeakButton` initially detected TTS support with `setState` inside an effect (new React lint rule, legit cascade-render concern) | Replaced with `useSyncExternalStore` (hydration-safe, zero subscription) | `npx eslint` → 0 problems |
| D7 | Stray hardcoded module-slug map in the deck (copy-paste drift risk) | Replaced with `quizHref` prop computed server-side from the real module map | `npx tsc` → 0 errors |
| D8 | The device TTS fallback **sounds robotic on this machine** (only legacy SAPI voices installed), and the Edge neural endpoint rejects synthesis — the `msedge-tts` library is dead | Pre-rendered **natural neural voice** with **Piper** (offline, MIT) into 64 bundled MP3s (~17 MB) via `scripts/generate-voice.ts`; runtime plays static files; device TTS kept as fallback | MP3s served, all routes 200 |
| D9 | "Everywhere should have people in it" — abstract spots only | **Character scene family** (`src/components/visual/characters.tsx`): 12 faceless, uniform people-scenarios (talk, listen, call, walk, study, think, support, meeting, breathe, cheer, notes, search) placed on landing hero + loop cards + module cards, learn hub, module pages, lesson deck, Scenario Lab, Support Navigator, progress, safety | Built clean; spots remain only as line-art complements |
| D10 | Walls of text remained behind "More on this →" | Concise rule: max **2 sentences** expand inline; anything deeper links to the full-article view | `npx tsc`/eslint → clean |
| D11 | Stiff deck: one shared enter transition | Idle float/sway CSS on scene people (transform-box: fill-box), staggered summary bullets, celebration burst on completion — all suppressed under `prefers-reduced-motion` | Build clean; CSS media query |
| D12 | Hand-drawn shape illustrations read as unprofessional; app copy verbose ("busy with data") | Replaced ALL visible illustrations with the **unDraw professional set** (open-license, recolored to brand, `public/art/*.svg`); hand-drawn families deleted; **minimalism pass**: every page header/intro cut to one essential line (landing, dashboard, progress, scenarios, support, safety) | tsc/eslint 0 · 48/48 tests · clean build · all routes 200 |
| D13 | `node:fs` existence check in `art.tsx` broke the client bundle (Turbopack: external `node:fs` in `/lesson` endpoint) | Removed the fs check — art files ship with the repo, so the path is deterministic; module is now client-safe | Clean build after fix |
| D14 | Content brief: the app read like a course (forced sequence, quizzes, progress bars) with redundant lesson text | **Full content replacement** (see audit cycle 5 below): not a course — free exploration | see §5 |

Full-article view is retained and one tap away — nothing was deleted, and no lesson facts, statistics or citations changed during this cycle (see `docs/research.md` §11 for the evidence framing of these delivery patterns).

## 5b. Audit-and-fix cycle 5 — content-lead replacement (added 19 October 2026)

Brief: audit every page, replace course-model content with short self-contained cards,
voice narration per card, illustration for every block, free exploration, never-buried
crisis info. Real fixes, all verified on this machine.

| ID | Real problem found | Fix shipped | Verification |
|---|---|---|---|
| D14a | Content was course-shaped: forced module sequence, 32 quiz questions, progress bars, "recommended next lesson" — redundant and clinical | Content model replaced with **12 topic cards across 7 themes** (`src/content/cards.ts`; expanded to 24 across 9 themes in D25), free entry everywhere via new `/topics`; audit table with keep/merge/delete for every topic: `docs/content-audit.md` | tsc/eslint 0 · 48/48 tests |
| D14b | Lesson prose dense and copied from research | Each card: point (1–2 sentences), why (1), **2–4 concrete today-steps**, optional "if this is you", grade-6–8 tone, warm non-clinical voice, person-first, "may/many people" phrasing, small "Source" line mapping to `docs/health-references.md` — no invented statistics | Manual tone pass + source map |
| D14c | No voice narration for the new cards | `scripts/generate-voice-cards.ts` → **12 bundled MP3s** (`public/voice/cards/*.mp3`, 4.5 MB, Piper `en_US-amy-medium`, offline MIT) + **TTS-ready script per card** in `docs/voice/*.txt`; play/pause button per card with device-TTS fallback | 12 MP3s generated, listed per-card |
| D14d | Illustration coverage for cards | 3 new green-palette pieces added (`worry-ideas`, `sleep-night`, `community` - unDraw open licence, recoloured to the brand palette); **initial 12/12 cards + headers covered**; full license/attribution log: `docs/illustration-map.md` | Files present, mapping table complete |
| D14e | Crisis info reachable but not *always* visible | **"Need help now?" chip added to the site header** (desktop pill + mobile menu top item) → `/safety`, permanent in nav | Visual check all pages |
| D14f | Landing funneled straight into the course | Hero CTA → "What's on your mind? — open topics"; closing CTA "Browse the topics"; `Need help now?` untouched | `/` renders new CTAs |
| D14g | Environment fault during final verification: Vitest **forks pool workers failed to start** (machine flake, not code — suite passed earlier with same deps) | Suite runs via **`--pool=threads`**; behavior documented | 6 files / **48 passed (48)** via threads |
| D14h | Topic integrity: new cards had to meet the same honesty bar as everything else | Clinical wording flagged rather than asserted: 3 items for expert review (`docs/content-gaps.md`): body-anxiety symptom framing, two-week low-mood rule, myths wording for Ghana context | Flag list written before demo |
| D15a | User verdict: the landing 3D green blob was "horrible" | **three.js scene deleted entirely** (`mind-scene.tsx` + `mind-scene-lazy.tsx` removed); hero now uses real green-palette illustration inside the new motion explainer (below) | tsc/eslint 0 · tests 48/48 · rebuilt |
| D15b | Concepts were static text moving only on scroll — user asked for **animated motion explainers with voice** | New explainer system: 7 green CSS-animated concept scenes (`explainer-stage.tsx`), stage captions + **bundled Piper voice-over MP3 per scene** (`scripts/generate-voice-motion.ts` → `public/voice/motion/`), wired to the hero ("understand → practise → next step" loop) and to **8 of the original 12 topic cards** (`motion` field in `cards.ts`) | 7 MP3s generated; scenes render with live captions (`data-testid` hooks) |
| D15c | Accessibility/robustness bar for the new animation layer | Pure CSS keyframes + transitions (no playback engine, no rAF); **all loops collapse to static frames under `prefers-reduced-motion`**; scenes are aria-hidden — captions (`aria-live="polite"`) + voice carry the meaning; audio fallback chain: bundled MP3 → device TTS → captions only | Same bar as existing animation vocabulary in `globals.css` |
| D16 | User feedback: "redundant WHO statistics … not good for the information we want to give people" | Removed research-stat dumping from every user-facing surface: landing hero/loop stat sentences + inline citations deleted; landing bibliography (12 WHO/title entries) collapsed to a single "Read the sources" link; legacy "Eight modules" grid replaced by the 7-theme topics teaser; **all 12 card footnotes rewritten** — no WHO attribution boilerplate, no internal `docs/…` paths; they now read as plain honest notes ("General wellbeing practice — not medical advice"), with evidence-dependent cards stating their basis in one line; 3 scenario-feedback lines de-cited. /research keeps the full bibliography (that is its job); support verification metadata and MHA/112 facts untouched | tsc/eslint 0 · tests 48/48 · rebuilt |
| D17 | New UI reference shared (Cadabra.Studio medical tablet): pale mint canvas, floating white cards, teal accents, botanical haze | Style tokens retuned to that *feel*, not its structure: canvas `#eef6f3`, card radius 24px + diffuse shadow, teal accent family (legacy `quietblue` token re-pointed), botanical decoration component on hero + topics banner, mint segmented nav. Hero moved from dark band to light mint gradient; explainer sits in a floating white card. Clinical metaphors (vitals, doctor cards, calorie tracking) explicitly rejected — documented in `docs/ui-spec.md` §Reference 2 | tsc/eslint 0 · rebuilt · visual check |
| D18 | App had only a letter "M" placeholder and Next.js's default favicon | **Brand mark shipped**: three ascending sage steps + mint "mind" spark on a forest tile (loop + mind in one glyph). Added inline `LogoMark` in the header (replacing the letter tile), `public/logo-mark.svg`, horizontal `public/logo.svg` lockup for documentation, and `src/app/icon.svg` as the favicon (default `favicon.ico` removed). No clinical symbols; reads at 16px; documented in `docs/ui-spec.md` §Logo | tsc/eslint 0 · build clean · `/icon.svg` 200 · header renders SVG mark |
| D19 | Requested Bricolage font; `next/font/google` **failed the build — fonts.googleapis.com is unreachable from this machine** | Self-hosted **Bricolage Grotesque** (SIL OFL 1.1, variable 200–800, latin, 40 KB) via `next/font/local`; license text ships in `public/fonts/OFL.txt`; removed the external Geist Mono fetch, so builds no longer need font-network access at all. Also fixed a real cascade bug: applying `--font-bricolage` on `<body>` left `--font-sans` (resolved at `:root`) invalid → silent fallback; moved the variable class to `<html>` and verified `document.fonts` status = loaded | tsc/eslint 0 · build clean offline · computed family = bricolage · `/fonts/*.woff2` 200 |
| D20 | Motion was ad-hoc: section fade-ups repeated on every card, no shared timing, no global reduced-motion policy | **Motion pass (Framer Motion)**: added `src/lib/motion.ts` tokens and a global `MotionProvider` (`MotionConfig reducedMotion="user"`, 0.32 s ease-out default); replaced per-card reveals with group-level `SectionReveal`; added the nav shared-element pill (`layoutId`, spring) as the single signature; explainer captions cross-fade by step; CSS press feedback on buttons; removed a duplicated early-return in the explainer | tsc/eslint 0 · 48/48 tests · build clean · nav pill renders aligned with `aria-current` · explainer caption/`aria-live` wiring verified (stepping is time-based; the review pane reports `document.hidden`, so frame sampling was inconclusive) · no console errors |
| D21 | Footer carried an internal-process line ("Cited sources last checked … unvalidated by user research") that read as project metadata, not something a visitor needs | Removed the paragraph from `site-footer.tsx` and dropped its now-unused `ACCESSED_ON` import; source dates remain on `/research` and per-card citations | build clean · SSR HTML contains neither phrase |
| D22 | Reference `DESIGN-minimax.md` supplied; user chose "apply structure, keep identity" | **Structural pass only**: flat cards (hairline + 1px `--shadow-flat`; diffuse shadow reserved for the hero feature card), 32px `rounded-feature` vs 24px cards, all buttons/chips pills, 60px display hero at 1.05/−0.03em, larger section headings (30–36px), forest active nav pill, removed the redundant header "Open topics" CTA, added `--color-hairline`/`-soft` tokens. Rejected DM Sans, 80px hero, monochrome + gradient product cards, product-colour encoding — documented in `docs/ui-spec.md` §Reference 3 | tsc/eslint 0 · build clean · computed hero 60px/−1.8px/63px leading · CTA radius pill, forest fill · card shadow = 1px hairline + 1px whisper · desktop nav has no duplicate CTA · no overflow at 1000px |
| D23 | Lighthouse on `/topics` scored 96: muted nav text 4.43:1, warning chip 4.41:1, and 8 explainer buttons whose `aria-label` omitted the visible "How it works" text | Darkened `--color-mist` to `#586f6b` and amber to `#7d621a` (both now ≥4.6:1 on tinted mint), updated the hardcoded header chips and badge/callout amber, and prefixed the play button's accessible name with "How it works:". No visual redesign | Lighthouse **100 accessibility / 100 best practices / 100 SEO** on `/` and `/topics`, zero failures · 48/48 tests · tsc/eslint 0 · build clean |
| D24 | Follow-up feedback: some illustrations still read as custom shapes, and coverage was uneven across the app | Replaced the full `public/art` set with **21 fresh unDraw SVGs** recoloured to the teal/forest/mint palette; removed `book-leaves`, `leaves-birds`, and `hand-plant`; added illustrations to the landing hero, loop strip, theme cards, support strip and research strip, plus get-started, scenario cards, dashboard empty states, module/lesson, support, progress and safety. Source/alt/palette register rewritten in `docs/illustration-map.md` | tsc/eslint 0 · 48/48 tests · clean production build · desktop + 390px mobile checks, no horizontal overflow |
| D25 | User review: "if it is a mental health literacy app, why don't I see why people behave in certain ways and also some of the mental health issues" | Added two themes and **12 cards**: `why-we-react` (fight/flight/freeze/fawn, avoidance, withdrawal/irritability, costly coping) and `mental-health-issues` (depression, anxiety, trauma/PTSD, bipolar, OCD, psychosis, substance use, eating disorders). Topics now **24 cards across 9 themes**; landing/topic counts are data-driven; condition cards carry a visible "Educational overview, not a diagnosis" note; sources R13–R21 added to the register and `/research`; card voice scripts and bundled MP3s added | tsc/eslint 0 · 48/48 tests · clean production build · source/claims map updated |
| D26 | User review: every illustration must be professional and internet-sourced; replace illustrations with floating circles/balls and all artwork that predates the online set; discard non-internet art | Replaced the seven custom CSS scenes in `explainer-stage.tsx` with step-by-step unDraw illustrations; deleted `botanical.tsx` (hand-authored leaf haze) and `topic-mark.tsx` (custom line icons; the theme rail now uses unDraw thumbnails); removed the completion confetti burst; deleted unused Next.js template SVGs. All visible editorial illustrations are now unDraw files in `public/art` (21 SVGs, source/licence in `docs/illustration-map.md`). The MINDSTEP brand mark/favicon and functional UI icons remain because they are identity/control assets, not illustrations | tsc/eslint 0 · 48/48 tests · build clean · illustration source audit completed |

Crisis/support wording unchanged: MHA 0800 678 678 (toll-free) and national 112 remain on
every relevant surface; the app's educational-only claim is unaffected — cards diagnose
nothing and promise nothing.

## 6. Known failures we are honest about


- No automated end-to-end (browser) tests; QA evidence is unit/strategy level.
- Accessibility: intent implemented in code, but NOT validated with screen
  readers or assistive-technology users (see `docs/limitations.md`).
- `npm audit score` against the full dependency graph cannot be improved
  without breaking the lint config (C13).
- Previous sessions of this project noted PowerToys/cmd quirks with `&&` in
  shells — anything platform-sensitive is documented, not "worked around" in
  the product.
