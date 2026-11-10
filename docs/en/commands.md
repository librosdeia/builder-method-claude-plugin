# Commands

All commands start with `/builder:`. In Claude Code, `/builder` alone is a shortcut for `/builder:next`.

| Command | Where | What it does |
|---|---|---|
| `/builder:start` | Cowork, Claude Code | Creates `builder/`, asks your name for the project, experience and language, then starts the Idea phase. If a project already exists, it offers to resume instead. |
| `/builder:next` | Cowork, Claude Code | Shows the progress summary, names the next step, and continues after you confirm. |
| `/builder:status` | Cowork, Claude Code | Shows the summary and refreshes `builder/progress.html`, without changing the project. |
| `/builder:idea` | Cowork, Claude Code | Phase 1. |
| `/builder:prd` | Cowork, Claude Code | Phase 2. Also reviews a PRD that was generated without review. |
| `/builder:design` | Cowork, Claude Code | Phase 3. Marks itself *not applicable* when there are no screens. |
| `/builder:build` | Claude Code | Phase 4. In Cowork, it tells you to open the folder in Claude Code. |
| `/builder:iterate` | Claude Code | Phase 5. |
| `/builder:ship` | Claude Code | Phase 6. Asks before anything that publishes or costs money. |
| `/builder:explain <concept>` | Cowork, Claude Code | Plain-words explanation tied to your project. Built-in notes: commit, repository, branch, environment variable, port, database, API, front end/back end, deploy, DNS, domain, build, test, lint, dependency. |
| `/builder:undo` | Claude Code | Lists saved points and restores one with `git revert` or on a new branch. Never deletes history. |

## Symbols in the summary

`✔` done · `◐` in progress · `○` not started · `!` generated, not reviewed · `–` not applicable
