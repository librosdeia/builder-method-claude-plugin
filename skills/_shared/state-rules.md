# State rules (all Builder skills)

`builder/state.json` is the source of truth for progress. Its schema is `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state.schema.json`.

## When to write

- At the **end of every step**, not only at the end of a phase, so an interrupted session resumes at the right step.
- Keep `currentPhase` on the phase being worked on.
- Use only these values:
  - phase status: `not_started`, `in_progress`, `done`, `skipped_generated`, `not_applicable`;
  - step status: `pending`, `in_progress`, `done`, `skipped`;
  - flow validation: `pending`, `pass`, `fail`;
  - task status: `pending`, `in_progress`, `done`.
- Flow ids are `F1`, `F2`…; task ids are `T1`, `T2`…; decision ids in `decisions.md` are `D1`, `D2`….

## Step keys per phase

| Phase | Steps (in order) |
|---|---|
| idea | `explore`, `scope`, `summarize` |
| prd | `clarify`, `write`, `review`, `polish` |
| design | `prototype`, `validate`, `link` |
| build | `plan`, `setup`, `build` |
| iterate | `validate`, `decisions`, `triage`, `loop` |
| ship | `audit`, `remote`, `prepare`, `deploy`, `domain`, `record` |

## Files and frontmatter

Every file in `builder/` that a phase produces starts with:

```yaml
---
phase: <idea|prd|design|build|iterate|ship>
review: <reviewed|unreviewed>
generated_by: builder:<skill>   # or gate:<phase> when a gate generated it
updated: <YYYY-MM-DD>
---
```

Keep `debt` in sync with the frontmatter: an `unreviewed` file has exactly one `debt` entry for its phase.

## Updating the progress page

The visual page has two files in `builder/`:
- `progress.html`: the page itself. It is copied once from the plugin and never edited.
- `progress-data.js`: the data the page shows. It is rewritten after every state change.

After every write to `state.json`, do both of these. This is required, not optional: the user relies on this page to see where they are.

1. If `builder/progress.html` doesn't exist, copy `${CLAUDE_PLUGIN_ROOT}/assets/progress.html` there unchanged. With a shell: `cp "${CLAUDE_PLUGIN_ROOT}/assets/progress.html" builder/progress.html`. If the shell is unavailable or the command is refused, use the file tools instead: Read the template (about 18 KB) and Write an identical copy to `builder/progress.html`. Don't skip this step. Never edit this file afterwards.
2. Write `builder/progress-data.js` (overwrite it with the Write tool) with exactly one statement, the full current JSON of `state.json`:

   ```js
   window.BUILDER_STATE = { ...the state.json content... };
   ```

Before finishing, check that both files exist.

## Damaged or missing state

All skills follow this one rule when `builder/state.json` is missing, isn't valid JSON, or holds values outside the lists above:

1. **Minimal repair first**, if the file exists. Fix only what's broken: a syntax error such as a missing comma or bracket, or a value outside the allowed lists mapped to the nearest valid one (e.g. `"finished"` → `"done"`). Keep everything else exactly as it is: `cycle`, tasks, checkpoints, flow results, decisions.
2. **Rebuild only if repair is impossible.** Copy the damaged file to `builder/state.json.bak` first, then rebuild the state from the `builder/*.md` files (their frontmatter and content) and from `git log` (`builder:` commits tell which tasks are done).
3. Tell the user in one or two lines what you repaired or rebuilt, and where the backup is.
4. Update the progress page.

## Existing outputs

The files in `builder/` belong to the user, who may have edited them. When a phase's output file already exists:
- **Revise it, don't regenerate it.** Read it, show what you would change, and edit it in place. Never overwrite it from the template without asking.
- Keep each existing flow's `tasks` and `validation` in `state.flows` when you update the flows.
- If the user explicitly asks to start a phase over, copy the old file to `<name>.bak.md` first.
