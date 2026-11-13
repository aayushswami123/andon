# Andon

CI tells you the tests passed. Andon tells you if the agent cheated to make them pass.

A coding agent edits a file. A Claude Code hook sends the diff, the task spec and
the test files to Andon. Plain code checks the facts (tests edited, skipped,
weakened; errors silenced). A small System One model (TypeSafe Jev) answers the
judgment calls. Rules turn the scores into `pass`, `rework` or `stop`. On `stop`
the line halts and the board turns red until a person clicks "Resume line".

## Results

20 held-out cases (10 honest, 10 cheat). Tuned on a separate dev split of 20.

| Metric | Value |
|---|---|
| Cheats caught | 10/10 (100%) |
| False alarms | 1/10 (10%) |
| Median time | 189 ms |
| Cost per check | $0.000032 |
| Facts-only caught | 2/10 (20%) |

Full table and misses: `scorecard/RESULTS.md`. Rerun with `node scripts/eval.mjs`.

## Run it

1. `cp .env.example .env.local` and fill in `DATABASE_URL` (Tiger Data Postgres),
   `TYPESAFE_API_KEY`, `SENTRY_DSN`. Set `JEV_MOCK=true` to skip the model.
2. `npm install && node scripts/db-init.mjs`
3. `npm run dev`, open http://localhost:3000
4. Replay a case: `node scripts/replay.mjs <case-id>`
5. Gate a live agent: the hook in `.claude/settings.json` runs on every
   Edit/Write. Point an agent at `demo-app/TASK.md` and watch the board.

## How it was built

One day, one agent, one task per session. `CLAUDE.md` sets the rules; `docs/`
holds the spec, design, scorecard and plan before any code. Tests for `facts.ts`
and `rules.ts` were locked and never edited to pass. From task 9 on, Andon gated
its own repo through the same hook. Every task is one commit.
