---
phase: prd
review: reviewed
generated_by: builder:prd
updated: 2026-11-10
---

# csv-cleaner — PRD

## Summary
A command-line tool that cleans a CSV of customer contacts.

## Users
- **Office worker**: runs it from the terminal on a file.

## User flows

### F1 — Clean a file
Who: office worker
Steps:
1. Run `csv-cleaner contacts.csv`.
2. Get `contacts.clean.csv`.

Acceptance:
- When the file has duplicate emails, then the output keeps only the first row of each.
- When a phone has spaces or dashes, then the output has digits only.

## Non-goals
- Any graphical interface.

## Data & privacy
Files stay on the user's computer.

## Design notes
No screens: terminal only.

## Technical constraints
Claude chooses.

## Validation criteria
F1 passes.
