# Illustration register

MINDSTEP uses one professional illustration family: **unDraw** by Katerina
Limpitsouni. The set is free for personal and commercial use without attribution.
We do not redistribute the unDraw collection, and we do not use it to train
models. Source: [undraw.co](https://undraw.co/), licence checked 21 October 2026.
See [undraw.co/license](https://undraw.co/license).

All SVGs were downloaded from the unDraw CDN, recoloured to the MINDSTEP
palette, and committed in `public/art/`. The app reads them through
`src/components/visual/art.tsx`; no third-party request happens at runtime.

## Palette

| Role | Hex |
|---|---|
| Brand teal | `#1F9C96` |
| Forest ink | `#13302D` |
| Deep ink | `#0E2928` |
| Mint surface | `#E6F4EF` |
| Canvas tint | `#EEF6F3` |
| Hairline mint | `#D3EBE4` |
| Sea accent | `#79C7BD` |
| Warm skin (light) | `#E8B48F` |
| Warm skin (mid) | `#C98A6B` |
| Warm skin (deep) | `#8A5A44` |

The recolouring pass also maps unDraw's default violet `#6C63FF` to brand teal,
its dark violet `#3F3D56` to forest ink, and neutral greys to the mint/canvas
tints. White remains white for the illustrations' negative space.

## Asset register

| Art name | File | unDraw source | Used in | Alt text |
|---|---|---|---|---|
| `overwhelmed` | `/art/overwhelmed.svg` | [Meditation](https://undraw.co/illustration/meditation_k4oa) | Overwhelm theme, anxious/overwhelmed cards, lesson points | Illustration: a person sitting calmly, breathing through overwhelm |
| `low-mood` | `/art/low-mood.svg` | [Feeling blue](https://undraw.co/illustration/feeling-blue_8si6) | Low mood theme, low-mood cards, depression module | Illustration: a person beside a large low-mood face, feeling flat |
| `worry-ideas` | `/art/worry-ideas.svg` | [Sorting thoughts](https://undraw.co/illustration/sorting-thoughts_b0kt) | Worry theme, worry-loop card | Illustration: a person sorting thoughts into notes, turning worry into a plan |
| `sleep-night` | `/art/sleep-night.svg` | [Late at night](https://undraw.co/illustration/late-at-night_0fob) | Sleep theme, sleep card, sleep lesson points | Illustration: a person at a window at night, winding down to rest |
| `friends-talking` | `/art/friends-talking.svg` | [Conversation](https://undraw.co/illustration/conversation_15p8) | Talking & helping theme, communication cards, practice prompt | Illustration: three people talking around a table |
| `community` | `/art/community.svg` | [Online community](https://undraw.co/illustration/online-community_3o0l) | Myths & facts theme, myths card | Illustration: three people connected by an online conversation |
| `chat-bubbles` | `/art/chat-bubbles.svg` | [Live support](https://undraw.co/illustration/live-support_9y6n) | Getting help theme, where-to-start card, service navigation module | Illustration: a person getting support through a phone chat |
| `breathing-woman` | `/art/breathing-woman.svg` | [Mindfulness](https://undraw.co/illustration/mindfulness_d853) | Stress & coping module, body-anxiety card | Illustration: a person sitting cross-legged, practising mindfulness |
| `take-a-break` | `/art/take-a-break.svg` | [Relaxation](https://undraw.co/illustration/relaxation_jsge) | Too-much-to-do card | Illustration: a person resting in a hammock, taking a break |
| `real-people` | `/art/real-people.svg` | [Together](https://undraw.co/illustration/together_s27q) | Myths & stigma module, helping-a-friend card | Illustration: two people standing together under a tree |
| `you-matter` | `/art/you-matter.svg` | [Proud self](https://undraw.co/illustration/proud-self_j8xv) | When to seek help module, words-don't-come card | Illustration: a person looking at a phone, feeling proud |
| `learning` | `/art/learning.svg` | [Learning](https://undraw.co/illustration/learning_qt7d) | Mental-health fundamentals module, dashboard empty state | Illustration: a person with books and a lightbulb, learning |
| `progress-path` | `/art/progress-path.svg` | [Journey](https://undraw.co/illustration/journey_brk8) | Progress page, review queue, getting-through-today card, lesson summaries | Illustration: a person walking a clear path of steps |
| `welcome` | `/art/welcome.svg` | [Questions](https://undraw.co/illustration/questions_52ic) | Get-started header | Illustration: two people with a large question mark, choosing what to answer |
| `role-play` | `/art/role-play.svg` | [Casual chat](https://undraw.co/illustration/casual-chat_4byz) | Scenarios header and scenario card fallback | Illustration: two people talking on a bench, practising a conversation |
| `support-connection` | `/art/support-connection.svg` | [Showing support](https://undraw.co/illustration/showing-support_ixfc) | Support header, search empty state, landing support section | Illustration: two people holding a phone with a heart, finding support together |
| `research-notes` | `/art/research-notes.svg` | [Researching](https://undraw.co/illustration/researching_49yy) | Research header and landing research section | Illustration: a person checking documents with a magnifying glass |
| `plan-steps` | `/art/plan-steps.svg` | [To-do list](https://undraw.co/illustration/to-do-list_o3jf) | Planner header and empty state | Illustration: a person with a clipboard, planning small steps |
| `safety-net` | `/art/safety-net.svg` | [Safe](https://undraw.co/illustration/safe_0mei) | Safety page header | Illustration: a person with a secure folder, representing safety and privacy |
| `hero-calm` | `/art/hero-calm.svg` | [Step to the sun](https://undraw.co/illustration/step-to-the-sun_wp49) | Landing hero | Illustration: a person holding a sun, representing a hopeful next step |
| `loop` | `/art/loop.svg` | [Completed steps](https://undraw.co/illustration/completed-steps_ngu7) | Landing "How MINDSTEP works" header | Illustration: a person moving through a short checklist of steps |

## Page placement

- **Landing** (`/`): hero illustration, loop-section illustration, one
  illustration in each of the four theme cards, support section, research strip.
- **Get started** (`/get-started`): welcome illustration above the questions.
- **Topics** (`/topics`): theme banner art and card art; the compact explorer
  swaps one theme/card at a time.
- **Dashboard** (`/learn`): continue-card art, practice-card art, module art, and
  recommendation empty-state art.
- **Module and lesson** (`/learn/[slug]`, `/lesson/[lessonId]`): module art and
  rotating point art, with a progress illustration on summary points.
- **Practice conversations** (`/scenarios`): header illustration plus a
  topic-matched thumbnail on each scenario card.
- **Support** (`/support`): header illustration and search empty-state art.
- **Progress** (`/progress`): header illustration plus quiz/review empty-state
  art.
- **Planner** (`/planner`): header illustration plus empty-state art.
- **Safety** (`/safety`): header illustration.
- **Research** (`/research`): header illustration.

## Topics layout

`/topics` is a theme-first explorer: the seven theme buttons swap the active
theme, and the card tabs swap the active card, instead of anchor-scrolling
through every card. The theme illustration sits in the theme banner; cards with
a motion explainer keep that explainer, and cards without one show their
illustration.

## Replacing an illustration

Save a new SVG into `public/art/` using the same filename and the app picks it up
with the same layout and alt text. To add a new art name, extend `ArtName`,
`ART`, and the relevant page in `src/components/visual/art.tsx`.

## Voice scripts

One TTS-ready `.txt` per card lives in `docs/voice/<card-id>.txt` (written by
`scripts/generate-voice-cards.ts`); the same text is bundled in the content model
and rendered as spoken audio at `public/voice/cards/<card-id>.mp3` (Piper, MIT).
