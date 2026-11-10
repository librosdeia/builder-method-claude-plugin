---
name: ship
description: Phase 6 of the Builder Method — audit security and privacy, save the work, choose a host from the plugin's recipes, deploy, connect the user's domain, and record how to redeploy and roll back in builder/06-ship.md. Use when the product is validated and the user wants to put it online, or runs /builder:ship.
---

# Phase 6 · Ship

**Goal:** check security, save the work, and put the product on the internet with the user's own domain.
**Input:** the validated product (`builder/05-validation.md`).
**Output:** a public URL, and `builder/06-ship.md`.

Read and follow:
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/_shared/gates.md`: apply the Ship gate, mentioning any flow not `pass`, pending decision or debt.

If you have no shell tool, say that shipping needs a terminal: open this same folder in **Claude Code** and run `/builder:next`. Then stop.

Set `phases.ship.status` to `in_progress` and `currentPhase` to `ship`. Create `builder/06-ship.md` from `${CLAUDE_PLUGIN_ROOT}/skills/ship/templates/06-ship.md` (translate the headings to the user's language, but keep "Audit" recognisable, e.g. "Audit / Auditoría").

**Safety rules for the whole phase:**
- Never print, log or write secret values (API keys, passwords, tokens), not even in `06-ship.md`. Use names only.
- Never `git push --force`, and never `git reset --hard`.
- Ask before anything that publishes or costs money: creating a remote repository, pushing, deploying, adding a domain. If the user said to proceed without questions, still stop before publishing anything new, unless they explicitly asked you to deploy.

## Step 1 · audit

Delegate to the **`security-auditor`** subagent (Agent tool, `subagent_type: "builder:security-auditor"`). Give it the project root and `builder/02-prd.md` (its "Data & privacy" section says how sensitive the data is). If the subagent tool isn't available, audit yourself following `${CLAUDE_PLUGIN_ROOT}/agents/security-auditor.md`.

Write the findings in the "Audit" table of `06-ship.md`, ordered by priority (critical → low), in plain words, without secret values.
- **Critical** findings are fixed before deploying (one checkpoint commit per fix: `builder: fix <short title>`).
- Others need the user's explicit approval to defer (`Status: deferred (approved)`).

If the user asked for the audit only, stop after recording it.

## Step 2 · remote

Offer to keep a copy of the code online. If they agree and use GitHub: `gh repo create <name> --private --source . --push`. Otherwise give them the steps for their host. Explain in two lines why it matters (a backup, and automatic deploys). The user may skip this step (`skipped`).

## Step 3 · prepare

Read every recipe in `${CLAUDE_PLUGIN_ROOT}/skills/ship/recipes/` (except `_template.md`), and use their "Fits when" sections to recommend one for this stack and data. Explain the trade-off in two or three lines, and link the pricing page. Don't quote prices. Then follow the chosen recipe's "Prepare" section, and give the user a clear split: **what you do in the provider's dashboard** and **what Claude does**.

## Step 4 · deploy

Follow the recipe's "Deploy" section. When it's live, open the public URL and smoke-test every flow once. Record it under "Deploy" in `06-ship.md`.

## Step 5 · domain (optional)

If the user has a domain, follow the recipe's "Domain" section. Give exact DNS records, step by step, for their registrar, and explain that DNS can take a while. Record it.

## Step 6 · record

Complete `06-ship.md`:
- the public URL and the domain;
- environment variable **names** and what each is for;
- how to redeploy;
- how to roll back (from the recipe).

Set `review: reviewed`, mark the steps and the phase `done`, and update the progress page.

Close by congratulating the user, briefly. Then say what to do next: share the URL, collect feedback, and run `/builder:iterate` to start a new improvement cycle.
