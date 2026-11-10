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

## Updating progress.html

After every write to `state.json`, update `builder/progress.html`:

1. If `builder/progress.html` doesn't exist, copy `${CLAUDE_PLUGIN_ROOT}/assets/progress.html` to it unchanged.
2. Replace **only** the contents of `<script id="builder-state" type="application/json">…</script>` with the full current JSON of `state.json`. Inside that block, write every `<` as `\u003c`, so a name containing `</script>` can't break the page. The JSON stays valid.
3. Never edit anything else in that file. The page draws itself in the browser.

If `state.json` is missing or unreadable, rebuild it from the files in `builder/` (their frontmatter and content), tell the user you did so, and continue.
