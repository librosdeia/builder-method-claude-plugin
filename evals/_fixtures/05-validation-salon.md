---
phase: iterate
review: reviewed
generated_by: builder:iterate
updated: 2026-11-10
---

# booking-app — Validation (cycle 1)

## F1 — Book a slot
- [x] Book a free slot → confirmation shows date, time and service.
Result: pass

## F2 — Cancel a booking
- [x] Cancel more than 24 h before → the slot is free again.
Result: pass

## F3 — See the day's agenda
- [x] Open /agenda with the password → today's bookings by time.
Result: pass
