# The Builder Method

Six phases take a product from a vague idea to the internet. Each has **one input and one output**. Phases 4 and 5 form a loop: build → validate → fix → validate…

| Phase | Input | Output | What happens |
|---|---|---|---|
| 1 · Idea | your problem, notes, links | `01-idea.md` | Explore the problem and approaches, agree what v1 will **not** do, summarise in simple terms. No code. |
| 2 · PRD | `01-idea.md` | `02-prd.md` | Pin down users, data and rules. Write numbered **user flows** (F1, F2…) with acceptance criteria ("When …, then …"). A reviewer subagent hunts for gaps and UX friction. |
| 3 · Design | `02-prd.md` | `03-design.md` | Preview the screens (a Claude Design artifact, or a local clickable prototype) and click through every flow before building. *Not applicable* if there are no screens. |
| 4 · Build | PRD + design | working product | A plan of small tasks that **covers every flow**; repository setup (git, `CLAUDE.md`, scripts, lint); then task by task with tests and a checkpoint commit. Decisions the PRD didn't cover go to `decisions.md`. |
| 5 · Iterate | product | validated product | A checklist per flow; you try it; decisions are reviewed; feedback is sorted into *fix now / next version / discard*. Fixes become a new build cycle. |
| 6 · Ship | validated product | product online | Security and privacy audit; code backed up; host chosen from recipes (Railway, Vercel…); deploy; your domain; how to redeploy and roll back. |

## Gates: warnings, not walls

Each phase checks that the earlier outputs exist. If something is missing, Claude explains why it matters and offers to go back. You can also continue anyway: Claude then **generates** the missing output from what it knows, and marks it *not reviewed*. It shows as debt on your progress map until you review it.

## Traceability

Every flow has an id. The plan says which tasks cover each flow, validation checks each flow, and the progress map counts covered and validated flows. "What's missing" is always concrete.

## Saved points

From the start of Build, every finished task is saved as a commit (`builder: T3 Booking form`). `/builder:undo` takes you back without deleting history.
