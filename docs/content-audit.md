# Content audit — full replacement per content-lead brief

Date: 2026-10-19. Scope: every page, section and component.
Decision rule: *does this help a person understand or act today?* If not, delete or merge.

## Audit table

| Topic | Where it appears | Keep / Merge / Delete | Reason |
|---|---|---|---|
| Course structure: 8 modules, "learning path", ordered sequence | `/learn`, module pages | **Delete from navigation** (new `/topics` becomes primary; legacy routes unlinked, pending removal) | Forced sequence contradicts free exploration; people arrive with a problem, not a syllabus |
| 16 lessons | `/learn/[slug]`, `/lesson/[lessonId]` | **Merge** into the topic-card library (24 cards) | Same psychoeducational ground, ~80% less text; each card is self-contained with steps + audio |
| Quizzes / knowledge checks (32 questions) | `/quiz/[slug]`, lesson deck | **Delete from primary experience** | Brief bans gamified testing; School-of-course feel, no action value (legacy route stays unlinked) |
| Progress bars, streaks, completion % | `/progress`, dashboard stat strip | **Delete from navigation** | Progress mechanics are course mechanics; user owns notes/actions instead |
| Recall review / "recommended next lesson" engine | dashboard | **Delete from navigation** | Recommendation = soft forced sequence |
| Scenario Lab (say-this-not-that practice) | `/scenarios` | **Keep** (renamed "Practice" in nav) | It's practise, not a level; direct action value for the app's core job |
| Support navigator (MHA line, services directory) | `/support` | **Keep** | Pure action: who to call, where to walk in |
| Need-help-now crisis info | `/safety` | **Keep + surface**: always-visible header chip | Must never be buried (brief) |
| Planner (who to tell, what to say, where to go) | `/planner` | **Keep** | It produces an artifact the person can use tomorrow |
| Sign-in / account | `/account`, `/get-started` | Keep, de-emphasised | Data ownership, not data collection; no gate anywhere |
| Myths & stigma content | lessons (duplicated across 3 modules) | **Merge** into one card (`myths-that-hurt`) | Duplicate topic in 3 places; one best version now |
| Sleep, worry, low mood, overwhelm, body anxiety, talking, help-seeking | lesson bodies | **Merge/replace** into `src/content/cards.ts` (12 practical cards) | Per-card model: point, why, 2–4 steps, "if this is you", voice, illustration, source line |
| Why people react, and common mental health issues | gap in the original card set | **Add** 12 cards: 4 mechanism cards and 8 condition overviews | Mental health literacy needs both "what can I do?" and "what is happening, and why?"; condition cards are educational, not diagnostic |
| Citations inline in body text | all legacy pages | **Keep** (compact) on legacy; new cards use small "Source" line only | Research text must not live in the body |
| Research/privacy/accessibility pages | `/research`, `/privacy`, `/accessibility` | **Keep** | Transparency spine of the app |
| Find-a-helpline international lookup | `/support` section | Keep (unlinked from primary flow) | Useful, but national line is primary |

## The one best version of each topic lives in
`src/content/cards.ts` — 24 cards, 9 themes, free entry everywhere:
Feeling overwhelmed · Low mood · Worry & anxiety · Sleep · Why we react · Mental health issues · Talking & helping · Myths & facts · Getting help.

Rules enforced in `cards.ts`: grade 6–8 tone, short sentences, "may/many people",
no diagnosing or labels, person-first language, no invented statistics. Condition cards
describe patterns in plain language, carry a visible "educational overview, not a
diagnosis" note, and never present a symptom list as a checklist. Each card ends
with one small honest note — general practice labelled "not medical advice", evidence-based
cards naming their basis in plain words (e.g. "WHO depression fact sheet, R14"),
and action cards naming the real service (MHA line / 112). No WHO boilerplate or internal
doc paths are shown to users; the full bibliography lives on `/research`.

## Status of legacy routes
`/learn`, `/lesson/*`, `/quiz/*`, `/progress`, `/get-started` remain functional but are
**unlinked from navigation and landing CTAs**. They are kept while the demo panel still
verifies content integrity tests, and are marked for deletion in the next pass
(see docs/content-gaps.md).
