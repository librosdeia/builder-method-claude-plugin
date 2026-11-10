# Builder Method plugin v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship v0.1 of the `builder` Claude plugin (repo `builder-method-claude-plugin`). It guides a non-programmer through the six Builder Method phases, keeping its state in a `builder/` folder and showing progress in a self-rendering `progress.html`.

**Architecture:** Almost the whole plugin is Markdown: skills, agents, templates and recipes, loaded by Claude Code and Cowork. Only two pieces execute code:
- a POSIX `sh` SessionStart hook;
- a browser-side renderer that lives inside `assets/progress.html`.

Correctness is checked in two layers:
- **Deterministic pieces** (state schema, renderer, hook, templates, recipes): `node:test`.
- **Skill behavior**: `claude plugin eval` cases with file and regex graders.

**Tech Stack:** Claude Code plugin format (Claude Code ≥ 2.1.269 for evals), POSIX sh, vanilla JS (ES2020, no framework), rough.js 4.6.6 (MIT, vendored), Node ≥ 22 for dev-only tests, ajv 8 (dev-only).

**Spec:** `docs/spec-v0.1.md`. Read it first. Section numbers below (§n) refer to it.

## Global Constraints

- Plugin `name` is `builder`, `displayName` is `Builder Method`, and `license` is `MIT`. The plugin name never contains "claude" (§14.3).
- Skills, commands, agents and file names are in English. Claude replies to the user, and writes the user's project files, in `profile.language`.
- Docs use the namespaced command form (`/builder:next`). The bare `/builder` is documented only as a Claude Code shortcut.
- No top-level `bin/`. No `userConfig`. No Node or Python needed on the user's machine. The only executable shipped is `hooks/session-start.sh` (POSIX sh) (§2.8).
- Project files live in a visible `builder/` folder: `state.json`, `01-idea.md` … `06-ship.md`, `decisions.md`, `progress.html`, and `prototype/` (§4).
- Every `builder/*.md` output starts with frontmatter keys `phase`, `review` (`reviewed|unreviewed`), `generated_by`, `updated` (§4).
- Phase status ∈ `not_started|in_progress|done|skipped_generated|not_applicable`. Step status ∈ `pending|in_progress|done|skipped`. Flow validation ∈ `pending|pass|fail`. Flow IDs match `^F\d+$`; task IDs match `^T\d+$` (§5).
- Gates warn and never block. "Continue anyway" generates the missing outputs with `review: unreviewed` and `generated_by: gate:<phase>`, plus a `debt` entry (§6).
- Phases 4–6 need the shell. When Bash is unavailable (for example in Cowork), the skill prints the handoff: "open this same folder in Claude Code and run `/builder:next`" (§9).
- Never `git reset --hard`, never a force push, never print secret values (§10, §7.6).
- Skills never tell the user to type `/plan` or `/goal` (§2.6).
- Claude Design option A never links to `claude.ai/design` (§7.3).
- Hosting recipes: `railway.md` and `vercel.md`, each with the six contract headings in §8.
- The repo itself is the marketplace: `.claude-plugin/marketplace.json` names marketplace `builder-method` with one plugin, `builder`, whose `source` is `./`.

## Review Focus

1. **Paths and names with spaces or non-ASCII** (e.g. project folder `~/Mis proyectos/Peluquería Ñ`): the hook must still find `builder/state.json`, and the renderer must show the name intact. Tests in Task 3 and Task 4.
2. **HTML in user-supplied strings** (a flow named `<img src=x onerror=alert(1)>`): `progress.html` must show it as text, never run it. Test in Task 3.
3. **A broken or hand-edited `state.json`** (invalid JSON, or an unknown status value): the hook must exit 0 and must not break the session; `progress.html` must show a readable "state could not be read" card, not a blank page. Tests in Task 3 and Task 4.
4. **Starting in a folder that already has work** (an existing `builder/` folder, or an existing git repo with code): `/builder:start` must not overwrite anything and should offer to resume; Build setup must reuse the repo. Evals in Task 6 and Task 9.
5. **User writing in Spanish**: the project files must be in Spanish while command names stay English. Eval in Task 7.

---

### Task 1: Repository scaffold and manifests

**Files:**
- Create: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `NOTICE`, `README.md` (stub, ≥ 40 words), `.gitignore`, `package.json`
- Keep: `LICENSE` (already on `origin/main`)
- Test: `test/manifest.test.mjs`

**Interfaces:**
- Produces: `npm test`, which runs `node --test test/`. Every later task adds a test file under `test/`.

- [x] **Step 1: Initialise git in the project folder, not in `$HOME`.** Done 2026-11-10. The repo is initialised in `BuilderMethod/`, with `origin` = `git@github-personal:librosdeia/builder-method-claude-plugin.git`. Always use the `github-personal` SSH alias, never `github.com`. Local `main` tracks `origin/main` (commit `9b4b798`, which contains `LICENSE` only). Keep that LICENSE as is; don't regenerate it.
- [ ] **Step 2: Write the failing test** `test/manifest.test.mjs`:
  - `plugin.json` has `name === "builder"`, `displayName === "Builder Method"`, `license === "MIT"`, a `version` matching `^0\.1\.\d+$`, `author.name === "Javier Rayón"`, and no `userConfig` key;
  - `marketplace.json` has `name === "builder-method"`, and `plugins[0]` has `name: "builder"` and `source: "./"`;
  - no `bin/` directory exists at the repo root;
  - `LICENSE` contains `MIT License` and `Copyright (c) 2026 Libros de ia.com` (the file already on `origin/main`);
  - `NOTICE` mentions `rough.js`.
- [ ] **Step 3: Run `npm test`.** Expected: FAIL (files missing).
- [ ] **Step 4: Write the manifests and files.**
  - `plugin.json` `description`: `Guides you from idea to published product with the Builder Method: idea, PRD, design, build, iterate and ship. Works in Claude Code and Cowork. Companion to the Builder Method book series.`
  - `package.json`: `"private": true`, `"type": "module"`, scripts `test` and `build:progress` (Task 3), devDependency `ajv@^8`.
  - `.gitignore`: `node_modules/`, `evals/results/` and `.beastcode/`.
  - `plugin.json`: `"repository": "https://github.com/librosdeia/builder-method-claude-plugin"`. That is the public URL for users; pushes still go through the `github-personal` alias.
- [ ] **Step 5: Run `npm test` and `claude plugin validate .`.** Expected: tests PASS; validate prints `Validation passed` (warnings allowed).
- [ ] **Step 6: Commit** `chore: scaffold builder plugin manifests and license`.

### Task 2: State schema and fixtures

**Files:**
- Create: `skills/_shared/state.schema.json`, `test/fixtures/state/{fresh,mid-build,no-frontend,skipped-prd,validated}.json`, `test/fixtures/state/invalid/{bad-status,bad-flow-id,missing-schema-version}.json`
- Test: `test/state-schema.test.mjs`

**Interfaces:**
- Produces: the JSON Schema (draft 2020-12) for `state.json` v1, exactly as in §5. Fixtures used by Tasks 3, 4 and 6:
  - `mid-build.json`: the §5 example, Build › build, T1–T5 done and T6–T9 pending, flows F1–F3, `decisions.pending: 2`;
  - `skipped-prd.json`: PRD `skipped_generated`, with a debt entry;
  - `no-frontend.json`: `hasFrontend: false`, Design `not_applicable`;
  - `validated.json`: Iterate done, all flows `pass`.

- [ ] **Step 1: Write the failing test.** Every file in `fixtures/state/*.json` validates; every file in `fixtures/state/invalid/*.json` fails. `bad-status.json` uses phase status `"finished"`; `bad-flow-id.json` uses flow id `"X1"`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL (no schema).
- [ ] **Step 3: Write the schema.**
  - `schemaVersion` is `const: 1`.
  - `phases` requires all six keys.
  - `steps` is an object whose values are step statuses.
  - `debt[].reason` ∈ `generated_unreviewed`.
  - `profile.codingExperience` ∈ `none|some|developer`; `profile.language` is a BCP-47-ish string matching `^[a-z]{2}(-[A-Z]{2})?$`.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: add state.json v1 schema and fixtures`.

### Task 3: Progress view (`assets/progress.html`)

**Files:**
- Create: `src/progress/render.mjs`, `src/progress/i18n.mjs`, `src/progress/page.template.html`, `scripts/build-progress.mjs` (dev only), `assets/progress.html` (build output, committed), `assets/vendor/rough-4.6.6.min.js` (vendored)
- Test: `test/progress.test.mjs`

**Interfaces:**
- Consumes: the Task 2 fixtures.
- Produces:
  - `summarize(state) -> { currentPhase, phases: [{ id, n, status, stepsDone, stepsTotal, debt: boolean }], flows: { total, covered, validated }, pendingDecisions, cycle }`. `covered` counts flows with ≥ 1 task; `validated` counts flows with `pass`.
  - `renderProgress(state, lang) -> string`: the HTML for `<main>`, with no timestamps or randomness. Cards carry `data-phase` and `data-status`; a `not_applicable` card has class `na`; a card with debt contains `.debt-badge`.
  - `renderError(lang) -> string`: the "state could not be read" card.
  - `STRINGS: { en, es }`, falling back to `en` for any other language.
  - `assets/progress.html` contains exactly one `<script id="builder-state" type="application/json">` block, which is the contract skills write into (§11). At load time, the page parses that block: if parsing fails or `summarize` throws, it shows `renderError`; otherwise it sets `main.innerHTML = renderProgress(...)` and draws the rough.js outlines with seed `10 + cardIndex`.
  - `npm run build:progress` inlines `render.mjs`, `i18n.mjs` and rough.js into `page.template.html`, writing `assets/progress.html`.

- [ ] **Step 1: Write the failing tests:**
  - `renderProgress(midBuild,'en') === renderProgress(midBuild,'en')`;
  - for `es`, the output contains `Construcción` and not `Build`;
  - `summarize(midBuild).flows` deep-equals `{ total: 3, covered: 3, validated: 0 }`;
  - the no-frontend design card matches `/data-phase="design"[^>]*class="[^"]*\bna\b/`;
  - the skipped-PRD card contains `debt-badge`;
  - a state whose flow name is `<img src=x onerror=alert(1)>` renders `&lt;img` and no `<img`;
  - project name `Peluquería Ñ` appears verbatim;
  - `renderError('es')` contains `No se pudo leer`;
  - **staleness check:** after `node scripts/build-progress.mjs --check`, `assets/progress.html` equals a fresh build.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `render.mjs` and `i18n.mjs`** with the signatures above. All interpolated strings go through `escapeHtml(s: string) -> string`. Card layout and visual language follow §11 and the original presentation (`~/Downloads/metodo-builder.html`: six cards, the Build↔Iterate loop arrow labelled "repeat the cycle ↺", light and dark tokens).
- [ ] **Step 4: Implement `build-progress.mjs`** (`--check` exits 1 when the output is stale). Commit the built `assets/progress.html`.
- [ ] **Step 5: Run `npm test`.** Expected: PASS. Open `assets/progress.html` with the `mid-build` fixture pasted into the state block, and check it visually in a browser, in light and dark mode, at 375 px wide.
- [ ] **Step 6: Commit** `feat: self-rendering progress.html`.

### Task 4: SessionStart hook

**Files:**
- Create: `hooks/hooks.json`, `hooks/session-start.sh`
- Test: `test/hook.test.mjs`

**Interfaces:**
- `hooks.json`: event `SessionStart`, matcher `startup|resume|clear|compact`, `type: command`, `command: "\"${CLAUDE_PLUGIN_ROOT}\"/hooks/session-start.sh"`, `timeout: 10`.
- `session-start.sh`:
  - project dir = `${CLAUDE_PROJECT_DIR:-$PWD}`;
  - if `$dir/builder/state.json` is not a file, print nothing and exit 0;
  - otherwise print the header line from §10, a blank line, then the file contents, capped at the first 400 lines;
  - always exit 0.

- [ ] **Step 1: Write the failing tests.** Spawn `sh hooks/session-start.sh` with `CLAUDE_PROJECT_DIR` set to a temporary directory and check that:
  - with no state, stdout is `""` and the exit code is 0;
  - with the `mid-build` fixture, stdout starts with `This project follows the Builder Method plugin` and contains `"currentPhase": "build"`;
  - a directory named `Mis proyectos/Peluquería Ñ` works;
  - a `state.json` containing `{not json` still exits 0 and prints the header;
  - the script is executable (mode `& 0o111`).
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement both files.**
- [ ] **Step 4: Run `npm test` and `claude plugin validate .`.** Expected: PASS and no unquoted-variable warning.
- [ ] **Step 5: Commit** `feat: SessionStart hook injects builder state`.

### Task 5: Shared references and templates

**Files:**
- Create:
  - `skills/_shared/{tone.md,gates.md,state-rules.md}`;
  - templates `skills/idea/templates/01-idea.md`, `skills/prd/templates/02-prd.md`, `skills/design/templates/03-design.md`, `skills/build/templates/{04-plan.md,decisions.md}`, `skills/iterate/templates/05-validation.md`, `skills/ship/templates/06-ship.md`.
- Test: `test/templates.test.mjs`

**Interfaces:**
- `tone.md`:
  - plain language;
  - one or two questions at a time;
  - explain each technical term once, by `profile.codingExperience` (§10);
  - reply in `profile.language`;
  - if the user says to proceed with defaults, state your assumptions instead of asking;
  - end every skill by suggesting `/builder:next`.
- `gates.md`: the §6 table, verbatim, plus the go-back / continue-anyway procedure and the two Design rules.
- `state-rules.md`:
  - when to write `state.json` (end of every step);
  - how to keep `debt` in sync with the frontmatter;
  - how to update `progress.html`: replace only the contents of the `builder-state` script block with the new JSON, and create the file from `${CLAUDE_PLUGIN_ROOT}/assets/progress.html` if it is missing.
- Template headings:
  - `01-idea.md` uses the §7.1 sections;
  - `02-prd.md` uses the §7.2 sections, and each flow is written as `### F<n> — <name>` with an `Acceptance:` list of `When … then …` items;
  - `04-plan.md` lists tasks as `### T<n> — <title>` with `Covers: F…`, `Check:` and `Model:`;
  - `decisions.md` entries are `## D<n> — <title>` with `What`, `Why`, `Check`, `Status: pending|kept|changed`;
  - `05-validation.md` has one `## F<n>` section per flow, with checklist items and a `Result:` line;
  - `06-ship.md` has the sections Audit, Deploy, Domain, Environment variables (names only), Redeploy, Rollback.

- [ ] **Step 1: Write the failing tests.** Every template's frontmatter has exactly the keys `phase`, `review`, `generated_by`, `updated`; the `02-prd.md` template contains `### F1 —` and `Acceptance:`; the `04-plan.md` template contains `Covers:`; `gates.md` contains each entering phase name from §6.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Write the files.**
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: shared rules, gates and phase templates`.

### Task 6: Navigation skills — `start`, `next`, `builder`, `status`

**Files:**
- Create: `skills/{start,next,builder,status}/SKILL.md`, `evals/fresh-start/`, `evals/existing-project/`, `evals/status-summary/`, `evals/resume-next/`

**Interfaces:**
- Consumes: `state-rules.md`, `tone.md`, `assets/progress.html`.
- `start`:
  - asks for the project name, `codingExperience` and language;
  - writes `builder/state.json` (all phases `not_started`, `currentPhase: "idea"`, `cycle: 1`, `hasFrontend: null`) and `builder/progress.html`;
  - then hands off to the idea skill;
  - if `builder/state.json` already exists, it changes nothing and offers `/builder:next`.
- `next`: reads the state and the files, prints the §11 summary, names the next step, and continues with the matching phase skill after the user confirms.
- `builder`: frontmatter `disable-model-invocation: true`; the body says to follow the `next` skill.
- `status`: read-only. It prints the §11 summary, using exactly the symbols there, and refreshes the `progress.html` state block.

- [ ] **Step 1: Write the eval cases.** Use `prompt.md` plus `graders/*.md`, and `case.yaml` with a `scaffold_script` where fixtures are needed. Every case includes `allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]`.
  - `fresh-start`: "Start a new Builder project called demo-app, I've never coded, English. Proceed with defaults, don't ask questions." Graders:
    - `file_exists builder/state.json`;
    - `file_exists builder/progress.html`;
    - a regex on `{source: file, path: builder/state.json}` for `"currentPhase":\s*"idea"`;
    - a regex on `builder/progress.html` for `id="builder-state"`;
    - `tool_used Skill` with input_match `start`.
  - `existing-project`: the scaffold copies the `mid-build` fixture into `builder/state.json`; prompt: "start a builder project". Graders: a regex on `state.json` still containing `"currentPhase": "build"`; and an `llm` grader: PASS if the reply offers to resume instead of restarting.
  - `status-summary`: scaffold `mid-build`; prompt "where am I?". Graders: a regex on last_message for `◐ 4 Build` and for `you are here`.
  - `resume-next`: scaffold `mid-build`; prompt `/builder:next`. Graders: an `llm` grader, PASS if the reply names T6 as the next task.
- [ ] **Step 2: Run** `claude plugin eval . --case "fresh-start|existing-project|status-summary|resume-next" --runs 1 --ablation none --allow-tools Write Edit --scaffold --trust-plugin`. Expected: the cases fail or score low, since the skills don't exist yet.
- [ ] **Step 3: Write the four skills.** Each `description` is phrased the way users ask ("start a new product idea", "what's next", "where am I"), because skill triggering depends on it.
- [ ] **Step 4: Re-run the evals with `--runs 3`.** Expected: every case ≥ 0.67. Also check `claude -p --plugin-dir . "/builder"` on the `mid-build` fixture behaves like `/builder:next`.
- [ ] **Step 5: Commit** `feat: start, next, status and /builder shortcut skills`.

### Task 7: Idea and PRD skills, plus the `prd-reviewer` agent

**Files:**
- Create: `skills/idea/SKILL.md`, `skills/idea/references/prompts.md`, `skills/prd/SKILL.md`, `skills/prd/references/prompts.md`, `agents/prd-reviewer.md` (`model: opus`), `evals/idea-to-prd/`, `evals/spanish-idea/`

**Interfaces:**
- `references/prompts.md` holds the original method prompts, translated to English: Idea "To start" / "To close"; PRD "Clarify", "Write", "Review", "Polish flows". The `/plan` and `/goal` tokens are removed and rewritten as behavior (§2.6).
- The idea skill follows the steps explore → scope → summarize (§7.1).
- The prd skill follows clarify → write → review → polish (§7.2). It mirrors the flows into `state.flows`. Review delegates to `prd-reviewer`, which returns a list of proposed changes; it does not edit files.

- [ ] **Step 1: Write the evals.**
  - `idea-to-prd`: the scaffold writes `builder/state.json` (fresh fixture). Prompt: a full idea for a hair-salon booking web app, then "go through idea and PRD with sensible defaults, don't ask me questions". Graders:
    - a regex on `builder/02-prd.md` for `### F1 —` and `Acceptance:` (`flags: i`);
    - a regex on `state.json` for `"id":\s*"F1"` and `"hasFrontend":\s*true`;
    - a regex on `builder/01-idea.md` for `Not in v1` (`flags: i`).
  - `spanish-idea`: the same, but the prompt is in Spanish and the profile language is `es`. Graders: an `llm` grader with focus `builder/01-idea.md`, PASS if the body text is Spanish; and a regex on last_message that does **not** contain `/builder:siguiente` (`match: not_contains`).
- [ ] **Step 2: Run the evals.** Expected: FAIL.
- [ ] **Step 3: Write the skills, the prompts and the agent.**
- [ ] **Step 4: Re-run with `--runs 3`.** Expected: ≥ 0.67.
- [ ] **Step 5: Commit** `feat: idea and PRD phases with prd-reviewer agent`.

### Task 8: Design skill

**Files:**
- Create: `skills/design/SKILL.md`, `skills/design/references/brief.md`, `evals/no-frontend/`, `evals/design-prototype/`

**Interfaces:**
- Behavior per §7.3:
  - option A: if the Artifact tool offers a "Design" type, use it; otherwise give the user `brief.md` filled from the PRD and ask for the link back;
  - option B: `builder/prototype/index.html`, with one screen per flow, linked from `03-design.md`;
  - with `hasFrontend: false`, set Design to `not_applicable`, say so in one line, and move on.

- [ ] **Step 1: Write the evals.**
  - `no-frontend`: scaffold a state with a PRD for a CLI tool and `hasFrontend: false`; prompt `/builder:design`. Graders: a regex on `state.json` for `"design":\s*\{\s*"status":\s*"not_applicable"`; and `file_exists builder/prototype/**` with `exists: false`.
  - `design-prototype`: scaffold the PRD from `idea-to-prd`, with no Artifact tool; prompt: "design it with a local prototype, defaults". Graders: `file_exists builder/prototype/index.html`; a regex on `03-design.md` for `F1`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Write the skill and the brief.**
- [ ] **Step 4: Re-run with `--runs 3`.** Expected: ≥ 0.67.
- [ ] **Step 5: Commit** `feat: design phase with Claude Design or local prototype`.

### Task 9: Build skill, plus the `planner` and `implementer` agents

**Files:**
- Create: `skills/build/SKILL.md`, `skills/build/references/{prompts.md,claude-md-base.md}`, `agents/planner.md` (`model: opus`), `agents/implementer.md` (`model: sonnet`), `evals/skip-to-build/`, `evals/plan-coverage/`, `evals/build-handoff/`, `evals/build-existing-repo/`

**Interfaces:**
- Steps plan → setup → build, per §7.4.
- **Coverage check:** before asking for approval, every `F<n>` in `state.flows` must appear in some `Covers:` line of the plan.
- Checkpoint commit message format: `builder: T<n> <title>`.
- Each decision is appended to `decisions.md` and increments `state.decisions.pending`.
- If no Bash tool is available, print the §9 handoff and stop.
- Setup reuses an existing `.git` (no second `git init`) and never overwrites existing source files.

- [ ] **Step 1: Write the evals.**
  - `skip-to-build`: the scaffold writes only `builder/state.json` (Idea done) and `01-idea.md`. Prompt: `/builder:build — continue anyway, don't ask, only do the plan step`. Graders:
    - a regex on `02-prd.md` for `review:\s*unreviewed` and for `generated_by:\s*gate:build`;
    - a regex on `state.json` for `"reason":\s*"generated_unreviewed"`;
    - `file_exists builder/04-plan.md`.
  - `plan-coverage`: scaffold a PRD with F1–F3; prompt: "make the build plan only". Graders: regexes on `04-plan.md`, `Covers:[^\n]*F1`, `Covers:[^\n]*F2` and `Covers:[^\n]*F3`.
  - `build-handoff`: `allowed_tools: [Read, Glob, Grep, Skill]` (no Bash); state at Build. Grader: a regex on last_message for `Claude Code` and `/builder:next`.
  - `build-existing-repo`: the scaffold runs `git init`, commits `app.js`, and writes the plan state. Prompt: "do the setup step". Graders: `tool_used Bash` with input_match `git init` and `max: 0`; a regex on `{source: file, path: app.js}` for the original content.
- [ ] **Step 2: Run** with `--allow-tools Write Edit Bash`. Expected: FAIL.
- [ ] **Step 3: Write the skill, the references and the agents.**
- [ ] **Step 4: Re-run with `--runs 3`.** Expected: ≥ 0.67.
- [ ] **Step 5: Commit** `feat: build phase with planner and implementer agents`.

### Task 10: Iterate skill and the `qa` agent

**Files:**
- Create: `skills/iterate/SKILL.md`, `agents/qa.md` (`model: sonnet`), `evals/iterate-loop/`

**Interfaces:**
- Steps validate → decisions → triage → loop, per §7.5.
- `fix now` items become `T<n>` tasks in `04-plan.md` with `Cycle: <cycle+1>`; `cycle` is incremented and Build goes back to `in_progress`.

- [ ] **Step 1: Write the eval.** `iterate-loop`: scaffold a finished build with F1–F2. Prompt: "validate: F1 passes, F2 fails because the confirmation email never arrives; fix it now; no questions". Graders:
  - a regex on `05-validation.md` for `## F1` and `## F2`;
  - a regex on `state.json` for `"cycle":\s*2`;
  - a regex on `04-plan.md` for `Cycle:\s*2`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Write the skill and the agent.**
- [ ] **Step 4: Re-run with `--runs 3`.** Expected: ≥ 0.67.
- [ ] **Step 5: Commit** `feat: iterate phase with validation loop`.

### Task 11: Ship skill, the `security-auditor` agent and the recipes

**Files:**
- Create: `skills/ship/SKILL.md`, `skills/ship/recipes/{_template.md,railway.md,vercel.md}`, `agents/security-auditor.md` (`model: opus`), `evals/ship-audit/`
- Test: `test/recipes.test.mjs`

**Interfaces:**
- Steps audit → remote → prepare → deploy → domain → record, per §7.6.
- The skill picks a recipe by reading each recipe's "Fits when" section; it never names a provider in its own text.

- [ ] **Step 1: Write the failing test.** Every `recipes/*.md` except `_template.md` contains the headings `## Fits when`, `## Prerequisites`, `## Prepare`, `## Deploy`, `## Domain` and `## Rollback`.
- [ ] **Step 2: Write the eval.** `ship-audit`: scaffold a validated project (`validated.json` plus a tiny Express app that has a hard-coded `API_KEY="sk-test-123"`). Prompt: "ship it — only run the audit step". Graders:
  - a regex on `06-ship.md` for `## Audit`;
  - an `llm` grader with focus `06-ship.md`, PASS if the hard-coded key is listed as critical;
  - a regex on `06-ship.md` that does **not** contain `sk-test-123`.
- [ ] **Step 3: Run `npm test` and the eval.** Expected: FAIL.
- [ ] **Step 4: Write the skill, the recipes and the agent.** Recipes contain no prices, only links to the providers' pricing pages.
- [ ] **Step 5: Re-run both.** Expected: PASS and ≥ 0.67.
- [ ] **Step 6: Commit** `feat: ship phase with security audit and hosting recipes`.

### Task 12: Explain and undo skills

**Files:**
- Create: `skills/explain/SKILL.md`, `skills/explain/concepts/*.md`, `skills/undo/SKILL.md`, `evals/explain-commit/`, `evals/undo-safe/`
- Test: `test/concepts.test.mjs`

**Interfaces:**
- Concepts, exactly this list: `commit, repository, branch, environment-variable, port, database, api, frontend-backend, deploy, dns, domain, build, test, lint, dependency`. Each file has the sections `What it is`, `Why it matters`, `Example`.
- `undo`: lists `builder:` commits in plain language, asks for confirmation, then restores with `git revert` or with `git switch -c builder/restore-<n> <sha>`.

- [ ] **Step 1: Write the failing test.** All 15 concept files exist and each has the three headings.
- [ ] **Step 2: Write the evals.**
  - `explain-commit`: prompt `/builder:explain commit`, with profile `none`. Grader: an `llm` grader, PASS if the answer is ≤ 120 words, plain language, and ties the concept to the project.
  - `undo-safe`: the scaffold creates a git repo with commits `builder: T1 …` … `builder: T5 …`. Prompt: "undo back to after T3, yes I confirm". Graders:
    - `tool_used Bash` with input_match `reset --hard|push --force|push -f`, `min: 0`, `max: 0`;
    - `tool_used Bash` with input_match `revert|switch -c`.
- [ ] **Step 3: Run.** Expected: FAIL.
- [ ] **Step 4: Write the skills and the concepts.**
- [ ] **Step 5: Re-run.** Expected: PASS and ≥ 0.67.
- [ ] **Step 6: Commit** `feat: explain and undo skills`.

### Task 13: Docs, README, directory readiness and full-suite run

**Files:**
- Create: `docs/en/{getting-started.md,the-method.md,commands.md,writing-a-recipe.md}`, `docs/es/` (the same four, in Spanish), `README.md` (full), `README.es.md`, `CHANGELOG.md`, `.claude-plugin/icon.png` (supplied by the author), `.github/workflows/test.yml`
- Modify: none.

**Interfaces:**
- README contents:
  - what the plugin is;
  - install for Claude Code: `/plugin marketplace add librosdeia/builder-method-claude-plugin`, then `/plugin install builder@builder-method`;
  - install for Cowork / claude.ai: Customize › Plugins › Add marketplace;
  - the six phases;
  - the command table from §3;
  - the line "Builder Method refers to the method by Javier Rayón; forks should use a different name";
  - links to librosdeia.com and the book.
- CI: on push, run `npm ci && npm test`. Evals stay local, because they cost model usage.

- [ ] **Step 1: Write the docs.** Every command named in the docs must exist as `skills/<name>/SKILL.md`; check with `grep -o '/builder:[a-z]*' -r docs README*.md | sort -u` against `ls skills`.
- [ ] **Step 2: Run** `npm test`, `claude plugin validate . --strict` and `claude plugin validate . --profile directory`. Expected: all pass. The icon check passes once the author supplies `icon.png`; until then this is the single known failure.
- [ ] **Step 3: Run the whole eval suite once:** `claude plugin eval . --runs 3 --allow-tools Write Edit Bash --scaffold --trust-plugin --max-cost-usd 15`. Expected: every case ≥ 0.67. Record the results in `CHANGELOG.md` under 0.1.0.
- [ ] **Step 4: Manual checks** (written as a checklist in `docs/en/getting-started.md` → "Verify your install"):
  - install from the GitHub marketplace in Claude Code;
  - install via claude.ai Customize › Plugins and confirm `/builder:next` appears in Cowork's slash menu;
  - open `builder/progress.html` from a real project;
  - one pilot user runs Idea → PRD.
- [ ] **Step 5: Commit** `docs: README, EN/ES docs, CI` and tag `v0.1.0`.
