---
name: iterate
description: Phase 5 of the Builder Method — check that the built product does its job, flow by flow, review Claude's decisions, sort feedback into fix now / next version / discard, and loop back to Build for fixes. Use when the first version is built and the user wants to test or improve it, or runs /builder:iterate.
---

# Phase 5 · Iterate

**Goal:** confirm that the product does its job, and collect feedback to improve it.
**Input:** the built product, `builder/02-prd.md`, `builder/decisions.md`.
**Output:** `builder/05-validation.md`, flow results in `state.flows`, and either a validated product or a new build cycle.

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/gates.md`: apply the Iterate gate.

If you have no shell tool, you can still record results the user tells you, but you can't launch the app. Say so, and suggest Claude Code.

Set `phases.iterate.status` to `in_progress` and `currentPhase` to `iterate`.

## Step 1 · validate

1. Delegate to the **`qa`** subagent (Agent tool, `subagent_type: "builder:qa"`). It writes `builder/05-validation.md` from `${CLAUDE_PLUGIN_ROOT}/skills/iterate/templates/05-validation.md`: one `## F<n> — <name>` section per flow, with a checkbox per acceptance criterion. If the subagent tool isn't available, write it yourself following `${CLAUDE_PLUGIN_ROOT}/agents/qa.md`.
2. Unless the user already tested it, launch the app (the `dev` script), tell them how to open it, and walk them through one flow at a time: "Try this… Did you see that?"
3. For each flow, record the outcome:
   - in the file: tick the boxes, set `Result: pass` or `Result: fail`, and add notes in the user's words;
   - in the state: set the flow's `validation` to `pass` or `fail`.
4. Tell them which decisions you took on your own that deserve a look, and what to focus on before approving.

## Step 2 · decisions

Go through every `Status: pending` entry in `builder/decisions.md`, in plain words. For each one, the user keeps it (`Status: kept`) or changes it (`Status: changed`, plus a line saying what to change; that change becomes a "fix now" item). Update `state.decisions.pending` to the number still pending (normally 0).

## Step 3 · triage

Collect every failed flow, requested change and new idea in the "Triage" table of `05-validation.md`, each marked:
- **fix now**: needed for this version to work as the PRD says (failed flows usually go here);
- **next version**: worth doing later. Add it to the PRD's "Non-goals" under "Next version";
- **discard**.

Suggest a classification. The user decides.

## Step 4 · loop

If "fix now" has items:
1. Increase `state.cycle` by 1.
2. Add one task per fix to `builder/04-plan.md`, under a heading `## Cycle <new cycle> — fixes`, in exactly the plan format, one line per field: `### T<next n> — <title>`, then `Covers: <flows>`, `Check: …`, `Model: …`, and `Cycle: <new cycle>`. Add them to `state.tasks` with `cycle: <new cycle>`.
3. Set Build back to `in_progress`, with its `build` step `pending`, and set `currentPhase` to `build`. Leave Iterate `in_progress`.
4. Prepare Iterate for re-checking the fixes: set every step in `phases.iterate.steps` back to `pending`, and set every flow whose validation is `fail` (and any flow a fix touches) back to `pending`. The next validation pass rewrites `05-validation.md` for the new cycle, so the "fix now" items are not planned twice.
5. Tell the user what will be fixed, and continue with `/builder:build`, unless they asked you to stop after planning.

If "fix now" is empty, every flow is `pass`, and no decisions are pending:
- set `review: reviewed` in `05-validation.md`, and mark Iterate and its steps `done` (`loop` is `skipped`);
- set `currentPhase` to `ship`.

Update the progress page, and close by suggesting `/builder:next`.
