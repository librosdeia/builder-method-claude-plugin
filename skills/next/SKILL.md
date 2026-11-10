---
name: next
description: Continue a Builder Method project — shows where the project is, what is done and missing, and continues with the next step. Use when the user asks "what's next", "continue", "let's keep going" or comes back to a project that has a builder/ folder.
---

# What's next

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/gates.md`

## 1. Read the state

- If `builder/state.json` is missing or damaged, follow "Damaged or missing state" in `state-rules.md`.
- If there is nothing at all, offer to start a project with `/builder:start`, and stop.

## 2. Show the summary

Print the progress summary exactly as the `status` skill defines it (`${CLAUDE_PLUGIN_ROOT}/skills/status/SKILL.md`, section "Summary format").

## 3. Decide the next step

Work it out in this order:
1. The current phase's first step that isn't `done` or `skipped`.
2. If the phase is in Build › build: the first task of the current cycle that isn't `done`, in plan order. Name it with its id and title (e.g. "T6 — Cancel button").
3. If the current phase is complete: the next phase, skipping `not_applicable` phases. Mention any "warns also if" conditions from `gates.md` for it.
4. If there is debt, mention it in one line, and offer to review it first.

Say the next step in one sentence, with the command that runs it (`/builder:<phase>`).

## 4. Continue

Ask "Shall we continue?" (or the equivalent in the user's language). When they confirm, follow that phase's skill from the step you named. If the user said to only tell them the next step, stop after naming it.
