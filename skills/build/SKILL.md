---
name: build
description: Phase 4 of the Builder Method — turn the PRD into the first working version of the product. Plan the tasks (each covering user flows), set up the repository, then build task by task with tests and a checkpoint commit after each one. Use when the PRD (and design) are ready and the user wants to build, or runs /builder:build.
---

# Phase 4 · Build

**Goal:** the first usable version of the product, working but not yet validated.
**Input:** `builder/02-prd.md` (+ `builder/03-design.md` if there are screens).
**Output:** the product's code, `builder/04-plan.md`, `builder/decisions.md`, and tasks tracked in `state.json`.

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/gates.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/build/references/prompts.md` (the method's original intent)

## 0 · Can we build here?

This phase runs commands (installing, testing, git). If you **don't have a shell tool** (no Bash), don't try to work around it. Say this, in the user's language, and stop:

> Building needs a terminal. Open this same folder in **Claude Code** and run `/builder:next`. Everything done so far is saved in `builder/`, so you'll continue exactly where you are.

## 1 · Gate

Apply the Build gate from `gates.md`. This includes the `hasFrontend: null` question, and generating the missing PRD or design with **Continue anyway**. A PRD generated here must have numbered flows (`### F<n> —`) with acceptance criteria, and they must be mirrored into `state.flows`, so the plan can cover them.

Then go to the first step of this phase that isn't `done` (`plan` → `setup` → `build`). Set `phases.build.status` to `in_progress` and `currentPhase` to `build`.

## Step 1 · plan

Delegate to the **`planner`** subagent (Agent tool, `subagent_type: "builder:planner"`). Give it the paths of the PRD, the design (if any) and `state.json`. It returns the plan in the format of `${CLAUDE_PLUGIN_ROOT}/skills/build/templates/04-plan.md`. If the subagent tool isn't available, write the plan yourself, following `${CLAUDE_PLUGIN_ROOT}/agents/planner.md`.

**Coverage check (mandatory):** every flow id in `state.flows` must appear in at least one task's `Covers:` line. If one is missing, add or adjust a task before going on. Never show an uncovered plan as finished.

Then:
1. Write `builder/04-plan.md` (if it already exists, follow "Existing outputs" in `state-rules.md`: revise it, never overwrite the user's edits).
2. Fill `state.tasks` (`{ id, title, flows, status: "pending", cycle }`), and each flow's `tasks` list.
3. Explain the plan in a few plain lines: the stack and why, how many tasks there are, and what the user will be able to try first.
4. **Get approval before setup.** If the user asked for defaults, or already approved, continue.

## Step 2 · setup

Before any product code:
- **Git.** If the folder is already a git repository (`git rev-parse --is-inside-work-tree`), reuse it. **Never run `git init` again.** Otherwise run `git init`, and explain in two lines what a commit is (a saved point you can go back to).
- **Existing files.** Never overwrite or delete existing source files. Build around them, or ask.
- **Project files.** Create:
  - the directory structure;
  - `CLAUDE.md`, from `${CLAUDE_PLUGIN_ROOT}/skills/build/references/claude-md-base.md`, filled in (merge with any existing `CLAUDE.md`, never replace it);
  - the `dev`, `test` and `build` scripts;
  - linting and formatting;
  - `.gitignore`, covering at least `.env`, `.env.*` (but not `.env.example`), dependencies and build output;
  - `.env.example`, if the product needs secrets.
- Everything follows the plan and the PRD's validation criteria. Prefer boring, well-known tools.
- First checkpoint commit: `builder: setup`.

## Step 3 · build

Work through the tasks of the current cycle in plan order. Keep going autonomously until all are done and tested.

For each task:
1. Set it to `in_progress` in `state.json`.
2. Delegate it to the **`implementer`** subagent (Agent tool, `subagent_type: "builder:implementer"`, with the model the plan names). Give it the task text, the flows it covers with their acceptance criteria, and the relevant design screens. If the subagent tool isn't available, do the task yourself, following `${CLAUDE_PLUGIN_ROOT}/agents/implementer.md`.
3. Check the result yourself: run the tests (front end and back end), and make sure the task's `Check:` holds.
4. Commit: `builder: T<n> <title>`. Record the short hash in the task's `checkpoint`, set it to `done`, and update the progress page.
5. Every decision the PRD didn't cover goes to `builder/decisions.md` (template `${CLAUDE_PLUGIN_ROOT}/skills/build/templates/decisions.md`) as a new `D<n>` with `Status: pending`. Increase `state.decisions.pending` and `state.decisions.total` by one each time.

Add realistic sample data, so the user can try the product straight away.

If you're blocked (missing account, failing dependency, unclear requirement), stop. Explain the blocker in plain words, say what you need from the user, and leave the task `in_progress`.

## Finish

When every task of the current cycle is `done` and the app starts with the `dev` script:
- mark `build` and its steps `done`;
- set `currentPhase` to `iterate`;
- update the progress page;
- tell the user how to open the app, and that the next phase checks it together, flow by flow.

Close by suggesting `/builder:next`.
