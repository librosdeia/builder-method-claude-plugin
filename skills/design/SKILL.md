---
name: design
description: Phase 3 of the Builder Method — create a preview of the product's screens (a Claude Design artifact or a local clickable prototype) to validate the user flows before building, recorded in builder/03-design.md. Use after the PRD, when the user wants to see the app before it's built, or runs /builder:design.
---

# Phase 3 · Design

**Goal:** a preview of the product, to validate and click through the flows before building.
**Input:** `builder/02-prd.md`.
**Output:** `builder/03-design.md`, which links the designs and maps each flow to its screens.

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/gates.md`: apply the Design gate first.

## 0 · Is a design needed?

Read `project.hasFrontend` from `builder/state.json`:
- **`false`**: set `phases.design` to `{ "status": "not_applicable" }`, set `currentPhase` to `build`, and update the progress page. Tell the user in one line that this product has no screens, so there is nothing to design. Then suggest `/builder:next` and **stop**. Create no files.
- **`null`**: ask once whether people will use it through screens (a website or an app), store the answer, and apply the rule above.
- **`true`**: continue.

## 1 · prototype

Set `phases.design.status` to `in_progress`. Choose the option with the user (recommend one):

**A · Claude Design.** Claude Design works inside Claude itself, as a "Design" artifact.
- If your tools can create a Design artifact here, design one screen sequence per flow there, from the PRD.
- If they can't, fill `${CLAUDE_PLUGIN_ROOT}/skills/design/references/brief.md` from the PRD and give it to the user to paste into Claude (chat or Cowork). Ask them to share the link back.
- Never send the user to the old standalone Claude Design website, which closes on 2026-12-14. Designs now live in Claude.

**B · Local prototype.** This is the default when A isn't possible, or the user prefers it.
- Create `builder/prototype/index.html`: a single self-contained HTML file (inline CSS and JS, no external downloads) that works by opening it in a browser.
- It has one screen per step of every flow, navigable with buttons and links, with realistic sample content.
- It includes the empty and error states named in the acceptance criteria, and follows the PRD's design notes (phone-first if stated).
- Open it in the browser for the user if you can (`open builder/prototype/index.html` on macOS), or tell them how to open it.

## 2 · validate

Walk through each flow with the user on the design: "F1 — Book a slot: tap Cut, pick Tuesday 10:00, enter name and phone, confirm. Does that match what you imagined?" Change what they ask for. If the user asked for defaults, or already approved, mark this step `done` after checking every flow yourself.

## 3 · link

Write `builder/03-design.md` from `${CLAUDE_PLUGIN_ROOT}/skills/design/templates/03-design.md`, with:
- the option used and the link or path;
- for every flow (`F1`, `F2`…), the screens that show it.

Update the PRD's "Design notes" section with the link, adding: "Build these screens exactly as designed."

## Finish

Ask for approval. Then set `review: reviewed`, mark the phase `done`, set `currentPhase` to `build`, and update the progress page. Close by suggesting `/builder:next`.
