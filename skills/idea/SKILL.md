---
name: idea
description: Phase 1 of the Builder Method — turn a vague product idea into a concrete one, written to builder/01-idea.md. Use when someone has an idea for an app, website or tool and wants to shape it before building, or runs /builder:idea.
---

# Phase 1 · Idea

**Goal:** turn a vague idea, with all the user's requirements, into a concrete idea to work with.
**Input:** whatever the user has (the problem, notes, documents, links).
**Output:** `builder/01-idea.md`.

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/idea/references/prompts.md` (the method's original intent)

If `builder/state.json` doesn't exist, set the project up first, as the `start` skill does (`${CLAUDE_PLUGIN_ROOT}/skills/start/SKILL.md`, steps 2–3), then come back here.

**Never write code or start building in this phase.**

## Step 1 · explore

Set `phases.idea.status` to `in_progress`.

Help the user think, don't interrogate them. Find out, a little at a time:
- what problem they want to solve, and for whom;
- what information they already have (documents, examples, competitors);
- who will use it, and in what situation;
- how they imagine it working.

Bring in what you know: similar products, typical approaches, pitfalls. Offer 2–3 possible approaches when there is a real choice, with your recommendation. If you can search the web and it helps, do so and keep the useful links for "Sources".

Mark the step `done` when you can describe the product in two sentences and the user agrees.

## Step 2 · scope

Agree on what the **first version does not do**. Propose a short list (payments, accounts, multiple languages, admin panels…), and let the user move items in or out. A smaller v1 ships sooner. Say so.

## Step 3 · summarize

Write `builder/01-idea.md` from the template `${CLAUDE_PLUGIN_ROOT}/skills/idea/templates/01-idea.md`. Translate the headings to the user's language.

Rules:
- Use simple terms.
- Describe the idea as the user sees it. Don't add conclusions of your own.
- The "Not in v1" section is the list from step 2.

Then:
- set `project.hasFrontend`: `true` if people will use it through screens (a website, an app), `false` for a script, API, bot or automation without screens, `null` if still unclear;
- show the user the summary and ask them to approve it, or to change anything;
- when approved (or if the user asked you to proceed with defaults): set `review: reviewed`, mark the step and the phase `done`, set `currentPhase` to `prd`, and update the progress page.

Close with one line, then suggest `/builder:next` (it continues with the PRD).
