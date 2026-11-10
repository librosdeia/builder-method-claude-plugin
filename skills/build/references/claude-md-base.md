# CLAUDE.md starting point (fill in during setup)

```markdown
# <Product name>

<One-line description.> Built with the Builder Method: the product documents live in `builder/`.
Source of truth for scope: `builder/02-prd.md`. Plan: `builder/04-plan.md`.

## Stack
- <language/framework/database, one line each, and why>

## Commands
- `<dev command>`: run locally at <url>
- `<test command>`: run all tests
- `<build command>`: production build
- `<lint/format command>`

## Conventions
- <folder layout: where pages, logic, data and tests live>
- Every task in builder/04-plan.md ends with passing tests and a commit `builder: T<n> <title>`.
- Secrets only in `.env` (never committed); `.env.example` lists the variable names.
- Decisions not covered by the PRD go to `builder/decisions.md`.
- Keep it simple: no feature that the PRD doesn't ask for.
```
