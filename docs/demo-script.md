# Demo / Evaluation Script

Estimated time: 10–12 minutes. Requires no environment variables.

```bash
npm run seed:demo     # clean data + demo progress; note the printed ms_sid
npm run dev           # http://localhost:3000
```

To view the demo profile's saved data without clicking through history: set a
cookie `ms_sid=<value from seed output>` (DevTools → Application → Cookies →
http://localhost:3000) before starting, or simply click through as a guest —
the loop below creates your own data live.

## Click path

1. **Landing (`/`) — the honesty statement.** Read the first panel: what
   MINDSTEP is and what it will not do. Crisis numbers (112 / 0800 678 678) are
   visible immediately; the research page lists R1–R21 with access dates.
2. **Get started (`/get-started`).** Complete the 4 optional questions — note
   the accessibility option and that nothing here asks about feelings.
3. **Learn → open the first module** (`/learn` → module page). Notice the
   dashboard's recommend cards each carry a visible *reason* string.
4. **Open a lesson** (`/lesson/…`). Read one section; open a citation chip (it
   shows the source and its checked date). Save the lesson (heart), then watch
   the Feedback in the mini-check: wrong answers still explain the principle.
   Mark the lesson complete at the end.
5. **Knowledge check (`/quiz/…`).** Answer all questions, submit: server
   scores it (you can watch the network response — the client never computes a
   score). Retake once to see the review panel update.
6. **Scenario Lab (`/scenarios`).** Pick "Ama has gone quiet" (or the "labelling
   game"). Walk a full path: choose → feedback (strengths/limitations/
   consequence) → continue → repeat to the end. The run is recorded; start it
   again and pick a worse choice to see the non-judgemental feedback pattern.
7. **Progress (`/progress`).** Every metric prints its explanation string; note
   the review queue pulling from your quiz answers, and the honesty callout.
   There is no account prompt: the page explains that progress stays in this
   browser.
8. **Support Navigator (`/support`).** Search "toll-free"; open the MHA
   helpline detail — phone 0800 678 678 with its verification status, source
   link. Find one "awaiting-verification" listing to show we publish gaps
   instead of inventing data.
9. **Safety (`/safety`).** The crisis page: who to call, what MINDSTEP will
   not do (it does not monitor anyone — no-one will be alerted if you're in
   crisis — that's stated, not hidden).
10. **Privacy (`/privacy`).** Read what's stored; press **Delete my data** and
    confirm: progress visibly resets (visit `/progress` to confirm empty).
11. **Quality gates from the terminal** (optional but quick):
    `npm run typecheck` · `npm run lint` · `npm test` · `npm run build`.

## If something breaks mid-demo

- Content/data weirdness → `npm run seed:demo` reloads a known-good register
  without restarting the dev server.
