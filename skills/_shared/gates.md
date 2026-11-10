# Gates (all phase skills)

Before starting a phase, check its entry requirements. Gates **warn, they never block**.

| Entering | Requires | Warns also if |
|---|---|---|
| PRD | `builder/01-idea.md` | — |
| Design | `builder/02-prd.md` with at least 1 flow | — |
| Build | `builder/02-prd.md` with every flow having ≥1 acceptance criterion; `builder/03-design.md` **or** `hasFrontend: false` | any debt exists |
| Iterate | Build: all tasks of the current cycle `done` | — |
| Ship | `builder/05-validation.md` | any flow not `pass`; any decision pending; any debt exists |

## When something is missing

Explain in plain language what is missing and why it matters (one or two sentences), then offer two choices:

1. **Go back** (recommended): run the missing phase properly. Hand off to that phase's skill.
2. **Continue anyway**: create each missing output now, from whatever you have (the conversation, existing `builder/` files, the code). For each generated file:
   - use the phase's template;
   - set the frontmatter to `review: unreviewed` and `generated_by: gate:<phase being entered>` (e.g. `gate:build`);
   - set that phase's status to `skipped_generated` and its `review` to `unreviewed`;
   - add `{ "phase": "<id>", "reason": "generated_unreviewed", "since": "<today>" }` to `debt`.

   Then continue with the phase the user asked for.

If the user already said to continue, or not to ask questions, pick **Continue anyway** without asking.

"Warns also if" conditions are only mentioned (one line each). They never trigger generation.

## Design rules

- If `project.hasFrontend` is `false`, Design is `not_applicable`. Set its status, never warn about it, and never generate `03-design.md` content beyond one line saying it is not needed.
- If `hasFrontend` is `null` when entering Build, ask once ("Will people use this through screens — a website or an app?"), store the answer, then apply the rule above.
- If there is a frontend and Design was skipped, "Continue anyway" writes `03-design.md` with plain-text wireframes, one per flow, derived from the PRD (marked unreviewed as above).

## Reviewing debt

When the user opens a phase that has debt, offer to review the generated file first. Once they approve it:
- set `review: reviewed` in the file;
- set the phase's `review` to `reviewed` and its status to `done`;
- remove the `debt` entry.
