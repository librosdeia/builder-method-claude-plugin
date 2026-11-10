---
name: undo
description: Go back to an earlier saved point of a Builder project safely — lists the checkpoints in plain language and restores one without deleting history (new commit or new branch). Use when something broke and the user wants to go back, or runs /builder:undo.
---

# Undo safely

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md` and `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`.

If you have no shell tool, say that undoing needs a terminal: open this same folder in **Claude Code** and run `/builder:undo`. Then stop.

**Never** use `git reset --hard`, `git push --force`, `git checkout -- .`, `git clean`, or anything else that deletes work or history.

## 1 · List the saved points

Run `git log --format='%h|%ad|%s' --date=relative -n 30`, and show the `builder:` commits as a plain numbered list, newest first:

`3. After T3 — Booking form (yesterday)`

If there are uncommitted changes (`git status --porcelain`), say so. Offer to save them first as a commit (`builder: work in progress before undo`) so nothing is lost.

## 2 · Choose and confirm

Ask which point to go back to, unless the user already said. Explain in plain words what will change ("the work from T4 and T5 will be undone; it stays in the history, so we can bring it back"). Get a clear yes. A "yes" already given in the request counts.

Offer two ways (recommend the first):
1. **Undo the later work** (recommended): `git revert --no-edit <sha-after-target>..HEAD`. This creates new commits that cancel the later ones, so the history stays complete.
2. **Restore on a separate branch**: `git switch -c builder/restore-<n> <target-sha>`. The current version stays untouched on the original branch.

## 3 · Update the state

After restoring:
- set the undone tasks back to `pending` in `state.json`;
- set `currentPhase` and the steps to match;
- add a one-line note to `builder/decisions.md` if a decision was undone;
- update the progress page.

Commit the state change: `builder: undo to after T<n>`.

Tell the user what the project looks like now and what comes next (`/builder:next`).
