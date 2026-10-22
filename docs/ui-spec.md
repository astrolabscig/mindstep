# UI specification — extracted from the medical-dashboard reference (19 Oct 2026)

A client-supplied reference image (a medical monitoring dashboard: heart rate,
blood count, glucose, appointments) was used to tune MINDSTEP's visual system.
**Only the design language was adopted — never the clinical content.** The
reference represents exactly the monitoring model MINDSTEP refuses to imply
(no vitals, no diagnosis panels, no anatomical 3D models). Every mapped choice
below keeps the product firmly educational.

## Extracted tokens and their new values

| Token (reference) | Observed value | MINDSTEP decision |
| --- | --- | --- |
| Canvas | ~#F4F4F1 warm light gray | `--color-canvas: #eef6f3` mint (shifted again in the Cadabra pass, see §Reference 2) |
| Card surface | pure white, radius ≈20px, near-shadowless | `--radius-card: 1.5rem`; default cards are flat — hairline ring + `--shadow-flat` (1px). The diffuse `--shadow-card` is reserved for one floating feature card |
| Card borders | hairline ~#EAECF0 | `--color-hairline: #e1eee9` / `--color-hairline-soft: #eaf3ef` tokens; brand-tinted but quiet |
| Accent | emerald green (charts, status dots, FAB) | brand forest/sage palette retained; deep green reserved for meaning, not decoration |
| Status dots | green/amber/red small dots + label | adopted only on **educational** progress states, always next to a "why" explanation |
| Big-number cards | 28px semibold figure + small unit + status | adopted on progress metrics — figures remain **learning activity only** |
| Segmented pill nav | white active pill in bordered track | header nav keeps one active pill pattern; after the MiniMax pass the active pill is forest with sage text (the only dark object in the header) |
| Date chip | rounded outline chip "Next · 20 Apr" | re-purposed as "Next up · <module>" chip on the learning dashboard |
| Welcome header | "Welcome, Daniele 👋" + gray sub | "Welcome back 👋" variant on the dashboard for signed-in profiles |
| Left floating icon rail, avatar | reference-specific | **not adopted** — MINDSTEP's plain accessible header suits its scale better than a floating rail |

## Explicitly rejected from the reference

- 3D anatomical heart and vitals panels → an abstract "calm mind" **three.js scene** was tried as the educational answer to the reference's 3D heart, and **retired on 2026-10-19 after user feedback ("the green blob is horrible")**: rendered as a low-poly blob rather than calm, it shipped extra API surface (`three` + drei/fiber) for one hero effect. Replaced with the **illustrated explainer system** (`src/components/visual/explainer-stage.tsx`): professional unDraw illustrations for each stage, with captions and a bundled voice-over. The custom CSS shape scenes were removed on 22 October 2026, so every visible illustration now comes from the online unDraw set. Educational intent unchanged: no clinical meaning, static under `prefers-reduced-motion`.
- Appointment/doctor panels → no equivalent; MINDSTEP maps "next appointment" energy to its honest "Next up" chip and action planner.
- Report-history tables → no health reports exist; progress tables stay strictly activity-based with explanations beside every number.

## Illustration sources (license honesty)

- `public/art/*.svg` — the **unDraw** collection (open-licence illustration set by Katerina Limpitsouni; free for personal and commercial use, no attribution required). Fetched from `undraw.co` and recoloured to the MINDSTEP palette: teal `#1F9C96`, forest `#13302D`, deep ink `#0E2928`, mint `#E6F4EF` / `#EEF6F3`, hairline `#D3EBE4`, sea `#79C7BD`, with warm skin tones. The current source, page placement, and alt-text log is `docs/illustration-map.md`.
- **These professional illustrations are now the ONLY visible illustration set.** The earlier hand-built SVG scene/spot families (`characters.tsx`, `illustration.tsx`) were retired and removed on 19 October 2026. On 21 October 2026 the remaining custom shape drawings (`book-leaves.svg`, `leaves-birds.svg`) and every other placeholder were replaced with a fresh 21-file unDraw set; illustrations now appear on the landing page, get-started, topics, dashboard, module/lesson, practice, support, progress, planner, safety, and research. On 22 October 2026 the last custom illustrative surfaces were removed: the explainer stages now render unDraw frames instead of CSS scenes, the hand-authored botanical haze and line-art topic marks were deleted, the completion confetti burst was removed, and the unused Next.js template SVGs were deleted. The brand mark/favicon and functional UI icons are identity/control assets, not editorial illustrations.
- The design-supplied raster illustrations (sent over chat, 18–19 Oct) were NOT retrievable as files from the conversation; if the designer exports them into `public/art/` with the documented filenames (`art.tsx` in the codebase lists them), the app renders them under the same names and alt text — no code change.
- UI library note: the tokens/patterns above were applied to our own Tailwind-based primitives (a shadcn-style token discipline) rather than installing a runtime component library wholesale — fewer dependencies for a demo build, honestly recorded here.

## Illustrated explainer system (updated 22 October 2026)
Concepts are taught with **professional unDraw illustrations + voice**, not
custom shapes:

- `src/components/visual/explainer-stage.tsx` renders one unDraw illustration
  per stage from `public/art`, with a short cross-fade and the brand mint
  background. It no longer draws people, circles, rings, or floating balls in
  CSS. Every scene is aria-hidden; the **stage captions are the accessible
  content** (`aria-live`).
- `src/components/visual/explainer.tsx` (`ExplainerPlay`) drives step captions
  (~3.2 s each) + plays the scene's **bundled Piper voice-over MP3**
  (`public/voice/motion/*.mp3`, generated by `scripts/generate-voice-motion.ts`,
  7 scenes, same `en_US-amy-medium` voice as the cards; fallback: device TTS).
- Scenes: `breathe` (slow exhale) · `overwhelm` (park the worry on paper) ·
  `breath-lows` (five minutes outside) · `worry-locate` (bring attention back) ·
  `conversation` (side-by-side, listen > fix) · `young-person` (the next hour) ·
  `loop` (understand → practise → next step; also the landing hero explainer).
- Placement: landing hero (`loop`) + topic cards with an attached `motion`
  scene in `src/content/cards.ts`.
- Stage changes use Framer Motion opacity/scale only; under
  `prefers-reduced-motion`, stage 0 is shown as a still illustration. The old
  `ms-ring`, `ms-breath`, `ms-jitter`, `ms-drift`, and `ms-pulse` CSS vocabulary
  was deleted with the custom scenes.
- Frame map: `docs/illustration-map.md` §Explainer frames.

## Reference 2 — Cadabra.Studio "Medical App Tablet" (added 20 October 2026)

Second shared reference image (medical tablet dashboard). Same rule as before:
take the *feel*, reject the clinical metaphors.

**Adopted**
- **Pale mint canvas** (`#eef6f3`) replacing the grey-green page wash; soft
  gradient hero (`#e4f3ee → #f1f8f5 → canvas`).
- **Floating white cards**: `--radius-card` raised to 24px, new diffuse
  `--shadow-card` (`0 12px 32px rgba(15,64,58,.07)` + hairline `#e1eee9`) —
  white planes visibly lift off the mint wash.
- **Teal accent family** (`--color-teal #1f9c96`, `--color-teal-600 #157a74`);
  the legacy `quietblue` token now maps to these values, so all links, labels
  and accent chips re-tint without component rewrites.
- **Rounded mint banner** on `/topics` (header sits in a soft card, matching
  the reference's "choose a doctor" band).
- **Compact theme explorer** on `/topics`: nine theme tabs and card tabs swap
  one card at a time, with Motion layout pills and a short fade/slide. The page
  no longer anchor-scrolls through the full card library; deep links such as
  `/topics#low-mood` and `/topics#mental-health-issues` still select a theme.
- Segmented header pill track re-tinted to mint.

**Rejected (deliberately)**
- Vitals, appointments, "choose a doctor", calorie/water tracking — no clinical
  monitoring metaphors; MINDSTEP stays educational.
- Photo avatars / doctor cards — we keep illustration + type, no invented people.
- Bottom-right floating action button — the always-visible "Need help now?"
  chip already serves that role without hiding actions behind an icon.
- Custom botanical haze (`botanical.tsx`) — the hand-authored leaf SVG was
  removed on 22 October 2026 because it was not an internet-sourced
  illustration. The mint gradient and the unDraw family carry the same visual
  warmth without a bespoke drawing.

## Logo and favicon (added 20 October 2026)

**Concept:** three ascending rounded steps + a small light "mind" spark on a
deep-forest tile. Three steps = the product loop (understand → practise → next
step); the spark = the mind that matters. No brain outline, no medical cross,
no heart — nothing implying diagnosis or monitoring.

**Assets**
- `src/components/visual/logo.tsx` — inline `<LogoMark />` used in the site
  header (crisp at any DPI, labelled "MINDSTEP", geometry decorative).
- `public/logo-mark.svg` — standalone icon (40×40, 11px rounded tile).
- `public/logo.svg` — horizontal lockup (mark + "MIND" forest / "STEP" teal)
  for documentation and brand collateral.
- `src/app/icon.svg` — Next.js favicon, auto-served at `/icon.svg`; the legacy
  default `favicon.ico` was removed so the brand icon is what browsers show.

**Palette:** tile `#0e2928` (forest), steps `#b8f28b` (sage at 55/78/100% for
depth), spark `#d3ebe4` (mint). One-colour-safe: the step geometry still reads
if printed in plain dark ink.

## Typography — Bricolage Grotesque (added 20 October 2026)

- **Typeface:** [Bricolage Grotesque](https://github.com/ateliertriay/bricolage),
  SIL Open Font License 1.1 — a characterful grotesque that stays readable at
  body size and gives headlines a warm, human voice.
- **Self-hosted**: `public/fonts/bricolage-grotesque-latin.woff2` (variable
  weight 200–800, latin subset, 40 KB) loaded through `next/font/local` in
  `src/app/layout.tsx`. License text ships beside it: `public/fonts/OFL.txt`.
- **Why self-hosted:** the build environment cannot reach `fonts.googleapis.com`;
  `next/font/local` removes the network dependency entirely, so production
  builds are deterministic and the app makes **zero font requests** at runtime.
- **Wiring:** `--font-bricolage` is applied on `<html>` (not `<body>`) because
  the `--font-sans` theme token resolves at `:root`; putting the variable on
  body leaves `--font-sans` invalid and silently falls back.
- **Fallback stack:** `ui-sans-serif, system-ui, sans-serif` — the page is fully
  legible if the WOFF2 fails.

## Motion system — Framer Motion (added 20 October 2026)

**Direction:** quiet, editorial UI; motion explains state change, never decorates.
One confident signature (the primary-nav pill), everything else is fast and small.

- **Tokens:** `src/lib/motion.ts` — `EASE_OUT`, `DUR` (0.12/0.2/0.32/0.5),
  `SPRING.snappy` (nav pill), `STAGGER`. No ad-hoc durations in components.
- **Global policy:** `src/components/motion/motion-provider.tsx` wraps the app in
  `MotionConfig reducedMotion="user"` with a default 0.32 s ease-out transition.
  Motion, layout, and gesture animations drop out for reduced-motion users;
  opacity/colour still communicate change.
- **Signature:** the active nav item's white pill is a shared element
  (`layoutId="primary-nav-pill"`) that glides between links with
  `SPRING.snappy`. It doubles as position feedback during client navigation.
- **Explainer captions:** step captions cross-fade (0.12 s) keyed by step, so the
  text change reads as continuity rather than a jump. `aria-live="polite"`
  remains on the wrapper.
- **Deliberately still:** page/route transitions (App Router exit animations are
  unreliable and full-screen fades are noise), card hover (CSS ring + shadow),
  the "Need help now?" chip (must never draw the eye away from reading), and the
  mobile menu (instant, no motion debt).
- **Reveal discipline:** `SectionReveal` applies to sections and to grids as a
  group — not per card. Content renders statically at full opacity before
  hydration and when reduced motion is on.
- **Press feedback:** buttons use a CSS `active:scale-[0.985]` over 150 ms
  (not Framer Motion) — cheap, works for every button variant, no JS.

## Reference 3 — MiniMax structural language (added 20 October 2026)

Source: client-supplied `DESIGN-minimax.md` analysis. The brief was **structure
only, keep MINDSTEP's identity** — no AI-product branding, no second typeface.

**Adopted**
- **Flat by default.** White cards now carry a hairline ring and a 1px shadow
  (`--shadow-flat`); the 12px diffuse shadow (`--shadow-card`) survives only on
  the hero explainer card, so elevation means "this one floats".
- **Pill-first interactive language.** Every button, chip and nav item is
  `rounded-full`; the segmented nav is the same pattern at a smaller scale.
  Form inputs stay 8px rectangular, as in the reference.
- **Two card radii.** 24px (`rounded-card`) for ordinary cards, 32px
  (`rounded-feature`) for the hero explainer. The contrast is the signature.
- **Tighter display type.** Hero 60px / 1.05 leading / −1.8px tracking;
  section headings 30–36px with −0.02em. Body copy keeps its generous leading.
- **One dark object per viewport.** The active nav pill is forest with sage
  text; the redundant "Open topics" header CTA was removed so the nav, not a
  fourth button, carries the hierarchy. Primary CTAs elsewhere stay forest pills.
- **Hairline tokens.** `--color-hairline` and `--color-hairline-soft` replace
  ad-hoc `#e1eee9` literals so the border value changes in one place.
- **Contrast correction.** Muted text moved from `#5c7470` to `#586f6b`
  (`--color-mist`) and the warning amber from `#8a6d1f` to `#7d621a`: both were
  marginally below 4.5:1 on tinted mint surfaces (4.43 and 4.41). The shift is
  nearly invisible but takes every muted label over AA.

**Rejected**
- DM Sans and the 80px hero: Bricolage Grotesque is the chosen voice, and 80px
  is too loud for a mental-health literacy page at this scale.
- Black/white monochrome plus saturated gradient product cards: the app is not
  a model portfolio. Mint canvas and teal accents stay; the only saturated
  surfaces remain semantic (safety amber, success, error).
- Product-color identity encoding (coral = model A, magenta = model B): there
  are no product lines to encode, and colour must keep meaning here.


