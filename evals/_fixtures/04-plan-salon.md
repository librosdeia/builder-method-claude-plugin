---
phase: build
review: reviewed
generated_by: builder:build
updated: 2026-11-10
---

# booking-app — Build plan

Stack: Node.js + Express + SQLite, plain HTML pages.

## Phase 1 — Base

### T1 — Project skeleton
Covers: none (setup)
Check: `npm run dev` serves a page
Model: sonnet
Cycle: 1

### T2 — Booking flow
Covers: F1
Check: booking test passes
Model: sonnet
Cycle: 1

### T3 — Cancel flow
Covers: F2
Check: cancel test passes
Model: sonnet
Cycle: 1

### T4 — Agenda
Covers: F3
Check: agenda test passes
Model: sonnet
Cycle: 1

## Flow coverage
| Flow | Tasks |
|---|---|
| F1 | T2 |
| F2 | T3 |
| F3 | T4 |
