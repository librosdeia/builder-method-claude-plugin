---
name: explain
description: Explain a technical concept (commit, repository, branch, environment variable, port, database, API, front end/back end, deploy, DNS, domain, build, test, lint, dependency, or any other) in plain language, applied to the user's own Builder project. Use when the user asks what a term means, or runs /builder:explain <concept>.
argument-hint: <concept>
---

# Explain a concept

The user wants to understand a term: `$ARGUMENTS` (or the one they asked about).

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`, and `builder/state.json` if it exists (for the language, the experience level and the project).

1. If there's a note for it in `${CLAUDE_PLUGIN_ROOT}/skills/explain/concepts/` (file names: `commit`, `repository`, `branch`, `environment-variable`, `port`, `database`, `api`, `frontend-backend`, `deploy`, `dns`, `domain`, `build`, `test`, `lint`, `dependency`), use it as the base. Otherwise, explain from your own knowledge with the same shape.
2. Answer in at most ~120 words, in `profile.language`:
   - **What it is**: one or two plain sentences, with an everyday comparison if it helps.
   - **Why it matters here**: tied to *this* project and its current phase.
   - **Example**: one line from the user's own project (their files, their tasks, their app). If there is no project yet, use a simple example.
3. Adjust the depth to `profile.codingExperience`: simplest for `none`, a bit more precise for `some`, short and technical for `developer`.

Don't change any file. End by offering to go back to what they were doing (`/builder:next`).
