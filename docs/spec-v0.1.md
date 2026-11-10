# Builder Method plugin — v0.1 specification

Status: draft · 2026-11-10
Source method: "Método Builder: de la idea al producto" (6 phases: Idea → PRD → Design → Build → Iterate → Ship)

## 1. Goal

A Claude plugin that walks a person who may not know how to code from a vague idea to a published product. It does this by following the Builder Method one phase at a time. At every moment the user can see where they are, what is done and what is missing.

The plugin is:

- **Independent.** It works without the course. Books and courses link to it; it does not depend on them.
- **English-first.** Commands, skills and repo docs are in English, with a Spanish translation of the docs in `docs/es/`. Claude talks to the user in the user's language and writes the project files in that language too.
- **Host-agnostic for thinking, Claude Code for doing.** Phases 1–3 work the same in Cowork and in Claude Code. Phases 4–6 run code, git and deploys, so they need Claude Code (see §9).
- **Provider-agnostic for shipping.** Hosting comes as swappable *recipes*. Railway is one of them, not a dependency.

### Non-goals for v0.1

- An "Operate" phase (backups, monitoring, analytics). Planned for v0.3.
- A status line, a side panel, or guard hooks that block dangerous commands.
- A log of the concepts the user has learned, and test scripts for real users.
- More than two hosting recipes.

## 2. Principles

1. **Every phase has one input and one output.** Each output is a file the user can open, read and edit.
2. **Gates warn, they never block.** If the user skips ahead, the plugin creates the missing outputs from the context it has and marks them as *unreviewed*. Unreviewed outputs count as debt and stay visible until the user reviews them.
3. **Design is the only phase that can be truly optional.** It becomes *not applicable* when the product has no frontend.
4. **Every user flow has an ID and can be traced from start to end** (PRD → plan → tests → validation). "What's missing" is always concrete.
5. **The user can always undo.** Git starts at the beginning of Build, and every finished task leaves a checkpoint.
6. **Skills describe behavior; they don't depend on built-in commands.** Skills never ask the user to type `/plan` or `/goal`. They say "plan first and ask for approval" or "keep going until every task is done and tested".
7. **The progress view is deterministic.** `progress.html` contains its own renderer; skills only write the data into it. The model never draws it freehand.
8. **No runtime required on the user's machine.** The plugin ships no `bin/` (Cowork and chat refuse plugins that have one), declares no `userConfig` (Cowork doesn't prompt for it), and needs neither Node nor Python. The only executable piece is a POSIX `sh` hook. Node is a dev dependency of this repo only, for tests.

## 3. Commands

The plugin is named `builder` (display name "Builder Method"), so every skill is invoked as `/builder:<name>`. Docs always use the namespaced form, because it is the only one that works on every host.

| Command | Purpose | Hosts |
|---|---|---|
| `/builder` | Shortcut for `/builder:next` (a skill named `builder`, model invocation disabled). Verified: Claude Code 2.1.322 resolves the bare name when no other skill claims it. | Code |
| `/builder:start` | Onboarding: project name, user profile, creates `builder/` and `state.json`. Then starts Idea. | Cowork, Code |
| `/builder:next` | Main entry point. Reads the state, says where the user is and what comes next, and continues after the user confirms. | Cowork, Code |
| `/builder:status` | Read-only. Prints the progress summary and regenerates `builder/progress.html`. | Cowork, Code |
| `/builder:idea` | Phase 1 | Cowork, Code |
| `/builder:prd` | Phase 2 | Cowork, Code |
| `/builder:design` | Phase 3 (optional when there is no frontend) | Cowork, Code |
| `/builder:build` | Phase 4 | Code |
| `/builder:iterate` | Phase 5 | Code |
| `/builder:ship` | Phase 6 | Code |
| `/builder:explain [concept]` | Explains a concept in plain language, applied to this project. | Cowork, Code |
| `/builder:undo` | Lists checkpoints in plain language and restores one without losing anything. | Code |

The user can call any phase command directly; the gates (§6) handle calls out of order. `/builder:next` is the only command a user has to remember. Every skill ends by suggesting it.

## 4. Project files

The plugin writes to a **visible** `builder/` folder in the project root, not a hidden one. Users who don't code need to find and open these files in Finder or Cowork.

```
builder/
  state.json          machine state (source of truth for progress)
  01-idea.md
  02-prd.md
  03-design.md        links to designs or prototype, or "not applicable"
  prototype/          only if Design option B is used
  04-plan.md
  05-validation.md
  06-ship.md
  decisions.md        decisions Claude made during Build that the user should review
  progress.html       generated; do not edit
```

Every `.md` output starts with frontmatter:

```yaml
---
phase: prd
review: reviewed            # reviewed | unreviewed
generated_by: builder:prd   # or "gate:build" when a gate generated it
updated: 2026-11-10
---
```

## 5. `state.json` schema (v1)

```jsonc
{
  "schemaVersion": 1,
  "pluginVersion": "0.1.0",
  "project": {
    "name": "booking-app",
    "createdAt": "2026-11-10",
    "hasFrontend": true            // true | false | null (unknown until Idea/PRD decide)
  },
  "profile": {
    "codingExperience": "none",    // none | some | developer → sets how much is explained
    "language": "es"               // language for conversation and project files
  },
  "cycle": 1,                      // goes up each time Iterate sends work back to Build
  "currentPhase": "build",
  "phases": {
    "idea":    { "status": "done", "review": "reviewed", "steps": { "explore": "done", "scope": "done", "summarize": "done" } },
    "prd":     { "status": "skipped_generated", "review": "unreviewed", "steps": { "clarify": "skipped", "write": "done", "review": "skipped", "polish": "skipped" } },
    "design":  { "status": "not_applicable" },
    "build":   { "status": "in_progress", "steps": { "plan": "done", "setup": "done", "build": "in_progress" } },
    "iterate": { "status": "not_started" },
    "ship":    { "status": "not_started" }
  },
  "flows": [
    { "id": "F1", "name": "Book a slot", "acceptance": ["..."], "tasks": ["T3", "T4"], "validation": "pending" }
  ],
  "tasks": [
    { "id": "T3", "title": "Booking form", "flows": ["F1"], "status": "done", "cycle": 1, "checkpoint": "a1b2c3d" }
  ],
  "decisions": { "pending": 2, "total": 5 },
  "debt": [
    { "phase": "prd", "reason": "generated_unreviewed", "since": "2026-11-10" }
  ]
}
```

**Phase status values:** `not_started` · `in_progress` · `done` · `skipped_generated` · `not_applicable`.
**Step status values:** `pending` · `in_progress` · `done` · `skipped`.
**Flow validation values:** `pending` · `pass` · `fail`.

Rules:
- Skills update `state.json` at the end of every step, not only at the end of a phase, so an interrupted session resumes at the right step.
- `debt` is derived from the files' `review: unreviewed` frontmatter and kept in sync by the skills. When the user reviews and approves a file, its entry is removed.
- The schema ships as `skills/_shared/state.schema.json`. Skills follow `skills/_shared/state-rules.md` when writing. The repo's test suite validates every fixture against the schema; users need no validator.
- After every write to `state.json`, the skill also copies the same JSON into the `<script id="builder-state" type="application/json">` block of `builder/progress.html` (§11).

## 6. Gates

Each phase has entry requirements, which are outputs of earlier phases. When the user starts phase N:

1. **Check** the requirements in the table below.
2. **If all are met**, start the phase.
3. **If any are missing**, explain in plain language what is missing and why it matters, then offer two choices:
   - **Go back** and do the missing phase properly. This is the recommended choice.
   - **Continue anyway.** The plugin creates each missing output from what it has (the conversation, the existing files, the code), writes it with `review: unreviewed` and `generated_by: gate:<phase>`, sets that phase to `skipped_generated`, adds it to `debt`, and continues.
4. A gate never refuses to proceed.

| Entering | Requires | Warns also if |
|---|---|---|
| PRD | `01-idea.md` | — |
| Design | `02-prd.md` with at least 1 flow | — |
| Build | `02-prd.md` with every flow having ≥1 acceptance criterion; `03-design.md` **or** `hasFrontend: false` | any debt exists |
| Iterate | Build: all tasks of the current cycle `done` | — |
| Ship | `05-validation.md` | any flow not `pass`; any decision pending; any debt exists |

**Design when there is no frontend:** if `hasFrontend` is `false`, Design is set to `not_applicable` and never warns. If it is `null` when entering Build, the Build gate asks the question once and stores the answer.

**Design when there is a frontend but the user skips it:** the gate writes `03-design.md` with plain-text wireframes, one per flow, derived from the PRD, and marks it unreviewed.

## 7. Phases

Each phase section lists the steps, the output, and the condition for marking the phase `done`. The method's original prompts are the core of each step. They live in `skills/<phase>/references/prompts.md` so they can be updated without touching the skill logic.

### 7.1 Idea — `/builder:idea`

Turns a vague idea, with all the user's requirements, into a concrete idea to work with.

Steps:
1. **explore.** Ask about the problem, the information the user has, who will use it and how they imagine it. Research the topic and suggest possible approaches. Ask questions one or two at a time. Never implement anything.
2. **scope.** Agree on what v1 does **not** do, and record it as an explicit list.
3. **summarize.** Write `01-idea.md` in simple terms and without adding conclusions of its own. Sections: what it is, what it is for, who it is for, how it is used, not in v1, interesting sources. Make a first guess of `hasFrontend`.

Done when `01-idea.md` exists and the user approves it.

### 7.2 PRD — `/builder:prd`

Turns the concrete idea into a document precise enough for Claude to build from as autonomously as possible.

Steps:
1. **clarify.** Interview the user about whatever is still undefined: users, data, rules, edge cases, privacy.
2. **write.** Produce `02-prd.md` from the template, with these sections:
   - Summary
   - Users
   - User flows: each flow with an ID (`F1…Fn`), its steps and acceptance criteria written in plain "when… then…" language
   - Non-goals
   - Data & privacy
   - Design notes
   - Technical constraints (default: "Claude chooses, explains why")
   - Validation criteria

   Flows are mirrored into `state.flows`.
3. **review.** The `prd-reviewer` subagent looks for gaps, contradictions and undefined areas, with special focus on UX. It adds or fixes the user-flows/design section. The user accepts or rejects each change.
4. **polish** (optional). A second review of the flows looking for friction and confusing steps.

Done when the user approves the PRD, every flow has at least one acceptance criterion, and `hasFrontend` is set.

### 7.3 Design — `/builder:design`

Creates a preview of the product so the flows can be validated before building. Two options, chosen with the user:

- **A · Claude Design (inside Claude).** Since late 2026, Claude Design works inside Claude itself (chat, Cowork, Claude Code) as a "Design" artifact. The standalone site claude.ai/design closes on 2026-12-14, and the plugin never links to it. If the host can create a Design artifact, Claude designs the screens there from the PRD and records the artifact link. If the user designs in another Claude surface, the skill gives them a design brief to paste there and asks for the link back.
- **B · Local prototype.** Generate a clickable HTML prototype in `builder/prototype/` and open it in the browser. This is the default when no Design artifact is available on the host.

Steps: **brief/prototype** → **validate** (walk each flow on the design with the user and iterate) → **link** (write `03-design.md` mapping each flow to its screens; update the PRD's design section with the links so they are built exactly as designed).

Done when every flow has screens and the user approves them.

### 7.4 Build — `/builder:build` (Claude Code)

Turns the PRD into the first usable version of the product. Three steps:

1. **plan.** The `planner` subagent writes `04-plan.md`: phases → tasks (`T1…Tn`), each task with the flows it covers, its acceptance check and a recommended model. **Coverage check:** every flow must map to at least one task, otherwise the plan is not finished. The user approves the plan before anything else happens.
2. **setup.** Before writing product code, set up:
   - the directory structure;
   - a `CLAUDE.md` with the project conventions;
   - `dev`, `test` and `build` scripts;
   - linting and formatting;
   - `.gitignore`, covering secrets and `.env`;
   - `git init` (or reuse the existing repo) and a first commit, with a two-line explanation of what a commit is.

   All of it aligned with the plan and with the PRD's validation criteria.
3. **build.** Run the plan autonomously:
   - The orchestrator hands each task to an `implementer` subagent.
   - After each task: run its tests (front and back), update `state.tasks`, and create a checkpoint commit `builder: T3 Booking form`.
   - Add realistic sample data.
   - Every decision the PRD didn't specify is appended to `decisions.md` (what, why, what to check), and `state.decisions.pending` goes up by one.
   - Keep going until every task of the current cycle is done and tested. If blocked, stop and explain the blocker in plain language.

Done when every task in the current cycle is `done` and the app starts with the `dev` script.

### 7.5 Iterate — `/builder:iterate` (Claude Code)

Checks that the product does its job and collects feedback to improve it.

Steps:
1. **validate.** The `qa` subagent creates `05-validation.md` with a checklist per flow, taken from its acceptance criteria. Claude launches the app and walks the user through each item, recording `pass` or `fail` plus notes. It also shows the decisions Claude took and what deserves attention before approving.
2. **decisions.** Go through the pending entries in `decisions.md`. The user keeps or changes each one.
3. **triage.** Sort every failure, change and new idea into **fix now**, **next version** or **discard**. "Next version" goes to the PRD's non-goals for this cycle.
4. **loop.** If "fix now" has items, add them to `04-plan.md` as tasks tagged with `cycle + 1`, increase `cycle`, set Build back to `in_progress`, and continue with `/builder:build`.

Done when every flow is `pass`, no decisions are pending, and "fix now" is empty.

### 7.6 Ship — `/builder:ship` (Claude Code)

Checks security, saves the work, and puts the product on the internet on the user's own domain.

Steps:
1. **audit.** The `security-auditor` subagent runs a security and privacy review, taking into account the data described in the PRD. The findings are written to `06-ship.md`, ordered by priority. Critical findings are fixed, with checkpoints, before deploying. Others need explicit approval to defer.
2. **remote.** Optionally create a GitHub repository and push to it.
3. **prepare.** Choose a hosting recipe (§8). Claude recommends one based on the stack and explains the trade-off. Then review the build and start commands, the port, environment variables and the database, and split the work into "what you do in the provider's dashboard" and "what Claude does".
4. **deploy.** Deploy following the recipe. Check that the app responds at its public URL and smoke-test each flow there.
5. **domain** (optional). Connect the user's domain and give step-by-step DNS records for their registrar.
6. **record.** Fill `06-ship.md` with the public URL, the domain, the environment variables (names only, never values), how to redeploy and how to roll back.

Done when the public URL works, the smoke tests pass, and `06-ship.md` is complete.

## 8. Hosting recipes

A recipe is a markdown file in `skills/ship/recipes/<provider>.md`. The ship skill reads it; it never hard-codes a provider. The contract, which every recipe must contain:

- **Fits when:** the stacks and app types it suits, plus pricing notes with a "check current pricing" link.
- **Prerequisites:** the account and CLI or MCP the user needs.
- **Prepare:** required config files, port and start-command conventions, how to set environment variables, database options.
- **Deploy:** steps split into user and Claude, plus how to verify.
- **Domain:** what DNS records to add and where.
- **Rollback:** how to return to the previous deploy.

v0.1 ships **Railway** (the method's default: servers, databases, background jobs) and **Vercel** (frontends and full-stack JS apps such as Next.js or Vite). Community recipes come in through PRs that follow `recipes/_template.md`.

## 9. Host support

Verified against the plugin platform-support docs (2026-11-10). Chat ignores agents and hooks; Cowork and Claude Code load skills, commands, agents and hooks. A top-level `bin/` makes chat and Cowork refuse the whole plugin. Cowork doesn't prompt for `userConfig`.

| Capability | Cowork | Claude Code |
|---|---|---|
| Skills / commands, phases 1–3 | ✔ (invoked as `/builder:<name>`) | ✔ |
| Agents (`prd-reviewer`) | ✔ | ✔ |
| Phases 4–6 | Handoff: "open this same folder in Claude Code and run `/builder:next`" | ✔ |
| SessionStart hook | Loads; `/builder:next` also covers resume | ✔ |
| `progress.html` | Open the file | Open in browser |

A plugin installed from claude.ai (Customize › Plugins) also syncs to Claude Code on the same account, so one install covers both. Because the state lives in the project folder, moving from Cowork to Claude Code loses nothing.

## 10. Supporting pieces

### Subagents (`agents/`)

| Agent | Model | Used in |
|---|---|---|
| `prd-reviewer` | opus | PRD › review, polish |
| `planner` | opus | Build › plan |
| `implementer` | sonnet | Build › build (one task at a time) |
| `qa` | sonnet | Iterate › validate, and per-task tests |
| `security-auditor` | opus | Ship › audit |

### Hook (`hooks/hooks.json`)

- **SessionStart** (matcher `startup|resume|clear|compact`). `hooks/session-start.sh` (POSIX sh, no other runtime). If `builder/state.json` exists in the project directory, it prints a factual one-line header ("This project follows the Builder Method plugin; its progress state is below; the guide skills are /builder:next and /builder:status") followed by the state JSON. Claude Code adds plain-text stdout to the context. If no state exists, it prints nothing and exits 0. The goal is for Claude to keep acting as the guide even when the user doesn't type a command. Nothing else in v0.1.

### `/builder:explain`

- **Explicit use:** `/builder:explain commit` → what it is, why it matters *in this project*, and a one-line example from the user's own files.
- **Implicit rule shared by all skills:** the first time a technical term shows up in a session, add a one-line explanation. The amount of explanation follows `profile.codingExperience` (none = always, some = new terms only, developer = never unless asked).
- Concept notes live in `skills/explain/concepts/*.md`, starting with: commit, repository, branch, environment variable, port, database, API, frontend/backend, deploy, DNS, domain, build, test, lint, dependency.

### `/builder:undo`

- Lists `builder:` checkpoints as "after T3 Booking form (yesterday 18:04)".
- Restores by creating a new commit (revert) or a new branch. Never `reset --hard`, never a force push. Always asks for confirmation and explains what will change.

## 11. Progress view

### Terminal and Cowork summary (`/builder:status`, also printed by `/builder:next`)

```
 BUILDER · booking-app                                  cycle 1
 ✔ 1 Idea  ! 2 PRD  – 3 Design  ◐ 4 Build  ○ 5 Iterate  ○ 6 Ship
                                  ▲ you are here
 Build › build · 9 of 14 tasks · flows covered 5/5
 Missing: T10–T14 · 2 decisions to review
 Debt: PRD generated without review → /builder:prd to review
 Next: /builder:next
```
Symbols: `✔` done · `◐` in progress · `○` not started · `!` skipped (generated, unreviewed) · `–` not applicable.

### `builder/progress.html`

- A copy of `assets/progress.html` from the plugin. The renderer is JavaScript inside the page, so it runs in the browser. The page reads its data from a `<script id="builder-state" type="application/json">` block. `/builder:start` copies the template; afterwards, skills only replace the contents of that block with the current `state.json`. No runtime is needed, and identical state always draws an identical page.
- Visual language of the method's presentation: six hand-drawn cards (rough.js, MIT, vendored inline so it works offline) and the "repeat the cycle ↺" arrow between Build and Iterate.
- Each card shows: its status, a progress bar for its steps, the deliverable as a link to its file, what's missing in plain language, and a debt badge if the file is unreviewed. Not-applicable cards are greyed out.
- Below the cards: a flow table (flow → tasks → validation status), the number of pending decisions, and the cycle number.
- It works in both light and dark mode, it is a single self-contained file, and its strings come in English and Spanish, following `profile.language`.

## 12. Repository layout

```
builder-method-claude-plugin/
  .claude-plugin/
    plugin.json                 name: "builder", displayName: "Builder Method", version, description, author, license: "MIT"
    marketplace.json            marketplace "builder-method"; users run /plugin marketplace add <owner>/builder-method-claude-plugin
  skills/
    start/SKILL.md
    builder/SKILL.md            alias of next (disable-model-invocation: true)
    next/SKILL.md
    status/SKILL.md
    idea/SKILL.md      references/prompts.md, templates/01-idea.md
    prd/SKILL.md       references/prompts.md, templates/02-prd.md
    design/SKILL.md    references/brief.md, templates/03-design.md
    build/SKILL.md     references/prompts.md, references/claude-md-base.md, templates/04-plan.md
    iterate/SKILL.md   templates/05-validation.md
    ship/SKILL.md      recipes/_template.md, recipes/railway.md, recipes/<static-host>.md, templates/06-ship.md
    explain/SKILL.md   concepts/*.md
    undo/SKILL.md
    _shared/           gates.md, state-rules.md, tone.md, state.schema.json (referenced by every skill)
  agents/              prd-reviewer.md, planner.md, implementer.md, qa.md, security-auditor.md
  hooks/               hooks.json, session-start.sh
  assets/              progress.html (template with inline renderer and vendored rough.js)
  evals/               claude plugin eval cases (see §13)
  test/                node:test suites for the renderer, schema fixtures and hook (dev only)
  package.json         dev-only: test script, ajv; never needed by users
  docs/
    en/                getting-started.md, the-method.md, commands.md, writing-a-recipe.md
    es/                translations of the same files
  README.md · README.es.md · LICENSE (MIT) · NOTICE (third-party: rough.js MIT) · CHANGELOG.md
```

## 13. Acceptance for v0.1

Eval scenarios, run against the skills:

1. **Fresh start.** `/builder:start` on an empty folder creates `builder/` and a valid `state.json`, then begins Idea.
2. **Happy path, phases 1–2.** The PRD ends with flow IDs, acceptance criteria, `hasFrontend` set, and `state.flows` populated.
3. **Skip to build.** Running `/builder:build` with only `01-idea.md` warns about it; on "continue" it generates `02-prd.md` (unreviewed) and the design output (or N/A). Debt appears in the status.
4. **No frontend.** A CLI or API idea ends with Design set to `not_applicable` and gives no warnings about design.
5. **Resume.** A new session with a state in Build › build at T5 makes the SessionStart context (or `/builder:next`) resume at T6.
6. **Traceability.** A plan with an uncovered flow is rejected by the coverage check.
7. **Undo.** `/builder:undo` restores the state after T3 without rewriting history.
8. **Progress view.** The renderer in `assets/progress.html` produces identical markup for identical state, in both languages (unit-tested).
9. **Host split.** Running `/builder:build` in Cowork produces the handoff message, not an error.

Manual pilot: 2–3 people who don't program take a small idea all the way to Iterate.

## 14. Resolved questions (verified 2026-11-10)

1. **Bare `/builder`.** Works in Claude Code 2.1.322: a skill named `builder` inside plugin `builder` answers both `/builder` and `/builder:builder`. Bare names only resolve when no other skill claims them, so docs keep `/builder:next` as the canonical form, and Cowork and chat document only the `/plugin:skill` form.
2. **Cowork.** It loads skills, commands, agents and hooks. It refuses plugins with a top-level `bin/` and doesn't prompt for `userConfig`. Whether a Node or Python runtime is available isn't documented, so the plugin doesn't depend on one (principle 8).
3. **Name collisions.** No published plugin named `builder` was found, and `builder` isn't a reserved name (reserved: names starting with `claude-`/`anthropic-`, etc.). The plugin name must not contain "claude", which is why the plugin is `builder` while the repo is `builder-method-claude-plugin`. Risk accepted. If a collision appears, the fallback name is `builder-method` (commands would become `/builder-method:*`).
4. **Claude Design.** It now lives inside Claude as a Design artifact, and standalone claude.ai/design closes on 2026-12-14. Design option A records an artifact link. `/design-sync` exists, but it is for syncing a component library with a design system, so it is out of scope for v0.1.
5. **Second recipe.** Vercel.

6. **Alias frontmatter.** `claude plugin validate` accepts `disable-model-invocation: true`, and `/builder` still answers when invoked explicitly (probe plugin, 2026-11-10).
7. **Directory submission.** `claude plugin validate --profile directory` additionally requires a README (≥40 words), a license, and an icon (square PNG, 512–2048 px, under 2 MB, at `.claude-plugin/icon.png`).

Still to confirm on a real install: that Cowork shows `/builder:next` in its slash menu.
