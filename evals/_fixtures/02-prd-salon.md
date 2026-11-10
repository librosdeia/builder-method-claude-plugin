---
phase: prd
review: reviewed
generated_by: builder:prd
updated: 2026-11-10
---

# booking-app — PRD

## Summary
A mobile-friendly booking website for a one-person hair salon.

## Users
- **Client**: books and cancels appointments, no account.
- **Owner**: sees the agenda; protected by a single password.

## User flows

### F1 — Book a slot
Who: client
Steps:
1. Pick a service (cut 30 min, colour 90 min, beard 15 min).
2. See free slots for the next 7 days.
3. Enter name and phone, confirm.

Acceptance:
- When a client confirms a free slot, then the booking is saved and a confirmation screen shows date, time and service.
- When a slot is already taken, then it is not shown as free.

### F2 — Cancel a booking
Who: client
Steps:
1. Open the link on the confirmation screen.
2. Press "Cancel".

Acceptance:
- When a client cancels more than 24 h before, then the slot becomes free again.
- When less than 24 h remain, then cancelling is not allowed and the salon's phone is shown.

### F3 — See the day's agenda
Who: owner
Steps:
1. Open /agenda and enter the password.
2. See today's bookings ordered by time.

Acceptance:
- When the owner opens the agenda with the right password, then today's bookings are listed by time with name, phone and service.

## Non-goals
- Payments, client accounts.

## Data & privacy
Client name and phone, visible only to the owner.

## Design notes
Warm, simple, large buttons; works on phones first.

## Technical constraints
Claude chooses.

## Validation criteria
All flows pass their acceptance criteria.
