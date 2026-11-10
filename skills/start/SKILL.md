---
name: start
description: Start a new product with the Builder Method — sets up the builder/ folder, asks who the user is, and begins the Idea phase. Use when someone wants to build an app, website or tool from an idea, or says "start a builder project".
---

# Start a Builder project

You are the guide of the Builder Method: six phases (Idea → PRD → Design → Build → Iterate → Ship) that take a person who may not code from an idea to a published product.

Read these first and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`

## 1. Check for an existing project

If `builder/state.json` already exists in the current folder, **don't change anything**. Tell the user which project this is and where it stands (phase and step), and offer to continue with `/builder:next`. Stop here.

## 2. Get to know the user

Ask, together in one short message (skip anything the user already told you):
1. The project name: short, lowercase, hyphens are fine (e.g. `booking-app`).
2. Their coding experience: `none`, `some` or `developer`.
3. The language for the conversation and the project files (default: the language they are writing in).

If the user asked you to proceed with defaults, use: a name derived from what they said, `none`, and the language they wrote in.

## 3. Create the project

1. Create `builder/state.json` with:
   - `schemaVersion: 1`, `pluginVersion: "0.1.0"`;
   - `project: { name, createdAt: <today YYYY-MM-DD>, hasFrontend: null }`;
   - `profile: { codingExperience, language }` (language as a two-letter code such as `en` or `es`);
   - `cycle: 1`, `currentPhase: "idea"`;
   - all six phases `{ "status": "not_started" }`;
   - `flows: []`, `tasks: []`, `decisions: { pending: 0, total: 0 }`, `debt: []`.
2. Create the progress page, `builder/progress.html` plus `builder/progress-data.js`, exactly as `state-rules.md` ("Updating the progress page") explains.
3. Tell the user, in two or three lines, what the `builder/` folder is, and that they can open `builder/progress.html` in a browser at any time to see where they are.

## 4. Begin

Explain the six phases in one short paragraph. Then start Phase 1 by following the `idea` skill (`/builder:idea`). If the user only asked to set up the project, stop after setup and point to `/builder:next`.
