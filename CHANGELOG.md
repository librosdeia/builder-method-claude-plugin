# Changelog

## 0.1.0 — 2026-11-11

First release.

- Six phase skills: `idea`, `prd`, `design`, `build`, `iterate`, `ship`, plus `start`, `next` (and the `/builder` shortcut), `status`, `explain` and `undo`.
- Project state in `builder/state.json` (JSON Schema in `skills/_shared/state.schema.json`), restored at every session start by a POSIX `sh` hook.
- Gates that warn and, on "continue anyway", generate the missing outputs, marked as unreviewed debt.
- Numbered user flows traced from the PRD to the plan (coverage check), validation and the progress map.
- `builder/progress.html`: a self-rendering, offline, hand-drawn progress map in English and Spanish, fed by `builder/progress-data.js`.
- Subagents: `prd-reviewer`, `planner`, `implementer`, `qa`, `security-auditor`.
- Hosting recipes: Railway and Vercel.
- Docs in English and Spanish.
