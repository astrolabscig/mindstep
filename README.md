# MINDSTEP

**Understand your mind. Practise what you learn. Know your next step.**

MINDSTEP is a free mental health literacy app for Ghana. It is built around 24 short topic cards across nine themes, with voice and text, motion explainers, practice conversations, and a checked support directory. The library covers everyday coping, why people react the way they do, and plain-language overviews of common mental health issues. There is no account, sign-up, or paywall.

It is educational, not clinical. It does not diagnose, treat, or monitor anyone, and it is not a crisis service.

> **Crisis information.** If someone may be in immediate danger, call **112**. For confidential psychosocial support, including suicidal thoughts, the Mental Health Authority line **0800 678 678** is free from all networks.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

The app self-seeds on first run. To load demo activity:

```bash
npm run seed:demo
```

No cloud services, API keys, or paid APIs are required for the core demo.

## What is inside

| Area | Route | Notes |
| --- | --- | --- |
| Landing page | `/` | Product promise, safety line, and entry points |
| **Topic cards (primary experience)** | **`/topics`** | **24 cards across 9 themes, including "Why we react" and "Mental health issues". Theme-first explorer: choose a theme, then a card, and the message swaps in place instead of a long-card scroll. Free exploration, no sequence. Each card has a plain explanation, a why, 2 to 4 small steps, voice and text, and an illustration or explainer. Condition overviews carry an explicit "educational, not a diagnosis" note.** |
| Practice conversations | `/scenarios` | Branching replies with non-judgemental feedback. Seven scenarios. |
| Support directory | `/support` | Ghanaian services with verification status, source, and check date |
| Safety and scope | `/safety` | What the app does and does not do |
| Privacy | `/privacy` | Local data, browser session, deletion |
| Accessibility | `/accessibility` | Reduced motion, keyboard, contrast, audio alternatives |
| Research and sources | `/research` | Claim to source register |
| Admin | `/admin` | Key-gated moderation and directory re-verification |

The earlier course, lesson, quiz, progress, and learning components still exist in the codebase and on their routes, but they are legacy and are not linked from the primary navigation or footer. The card experience is the intended demo.

## Quality gates

```bash
npm run typecheck   # strict TypeScript
npm run lint        # ESLint
npm test            # Vitest
npm run build       # production build
```

## Configuration

Copy `.env.example` to `.env.local` if you want to override defaults.

- `MINDSTEP_DATA_DIR` sets the local data directory. Default: `./data`.
- `ADMIN_KEY` enables the key-gated admin area. Admin actions are rejected server side without it.

## Documentation

| File | Contents |
| --- | --- |
| `docs/research.md` | Research brief and design implications |
| `docs/health-references.md` | Claim to source mapping with access dates |
| `docs/architecture.md` | Data model, access rules, and local mode |
| `docs/safety-and-privacy.md` | Safety principles, privacy design, deletion, limits |
| `docs/qa-report.md` | Test evidence and audit notes |
| `docs/deployment.md` | How to run the local build honestly |
| `docs/demo-script.md` | Click path for reviewing the product |
| `docs/limitations.md` | What this build cannot do |
| `docs/content-audit.md` | Content review notes |
| `docs/illustration-map.md` | Illustration and licence notes |
| `docs/content-gaps.md` | Expert review flags |

## Honest limits

- The app is a local demo, not a public deployment. It has no hosted URL.
- There is no account system, cloud auth, or cloud persistence in this build.
- The support directory is a demonstration dataset. Entries show their source and check date; it is not a live referral service.
- MINDSTEP cannot detect distress, monitor messages, or provide emergency help.
- The card voice scripts are aligned to the bundled audio. Do not rewrite a card voice script without regenerating its MP3.
