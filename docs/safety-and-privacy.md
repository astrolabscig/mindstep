# Safety and Privacy

## Safety principles (encoded in product and code)

1. **Not a clinical product.** No page diagnoses, screens for, or monitors any
   condition. Knowledge checks score recall of lesson text only; the progress
   page prints this next to every metric (`metricExplanations`).
2. **No monitoring, by design and by declaration.** There is no crisis
   detection, mood tracking, sentiment analysis, alerting, or human review of
   any user activity — because none exists in the code. The source register
   (R2) drove this decision: education improves *knowledge*; we do not claim
   attitude change, let alone clinical benefit.
3. **Crisis handoff is explicit and repeated.** National emergency **112** and
   the MHA toll-free line **0800 678 678** are surfaced on the landing page, the
   safety page, the support directory, and the scenario feedback.
   Launch of the 0800 678 678 line and its purpose are cited (R5, R6).
4. **Feedback is never shaming.** Every scenario choice renders strengths +
   limitations + consequence, whatever its quality. Schema enforces minimum
   lengths for all three fields.
5. **Data minimisation.** The app stores learning activity only. There are no
   free-text "how do you feel" fields, no planner notes, and no third-party
   analytics or trackers.

## Privacy design (local mode)

| What | Where | Controls |
| --- | --- | --- |
| Session id | httpOnly cookie `ms_sid`, 90 days, same-site lax | Delete-my-data resets the record |
| Learning activity | `data/mindstep-db.json`, server-side only | Not addressable by crafted client requests (cookie-only resolution, statically tested) |

- There is no account system, so the app never stores a name, email address, or
  password hash.
- There is no admin key, moderator account, or browser-based content editor.
  Content changes are code changes shipped with the app.

## Deletion

`deleteMyData()` (exposed on `/privacy`) resets the profile bound to the
current session to a fresh, empty record. In a file-backed
local mode this is immediate and complete for this session. A "hard delete of
past backups" does not apply — there are no backups and no cloud copies; if a
production backend existed, this function would be the deletion entry point in
`docs/architecture.md`.

## Where this build falls short (read this)

- Single-file JSON storage: no encryption at rest, no per-field ACLs, no
  multi-user concurrency control beyond atomic renames.
- Local mode data lives in plaintext on the machine running the server.
- No formal security audit, no penetration testing, no WCAG audit with AT
  users has been performed on this build.

These are acceptable *only* because the product is explicitly educational,
local, and does not collect mood/symptom data. They are tracked in
`docs/limitations.md` and would all be binding blockers for any production
deployment handling real user data.
