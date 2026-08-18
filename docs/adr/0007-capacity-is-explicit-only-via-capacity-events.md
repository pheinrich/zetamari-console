---
status: accepted
---

# Capacity is explicit-only, via Capacity Events

Capacity (CONTEXT.md) was originally a fallback chain: an explicit per-day override, falling back to a per-week Weekly Budget divided across business days, falling back to a standing per-person default. An unset day was never treated as zero Capacity — it fell through to the next tier.

That chain is retired. Capacity is now sourced entirely from Capacity Events (CONTEXT.md) — named, date-spanning entries assigning Owners/Assistants their per-day hours. A day nobody's assigned an Event to is genuinely 0 hours for that person, not a computed guess. Capacity is expected to be "mostly manual": staff create an Event per stretch of normal working days (as well as for exceptions like an away-at-a-show trip), rather than the schedule defaulting to *something* and staff only touching it to record exceptions.

This trades the old chain's "never accidentally zero" safety net for an explicit, single source of truth — no more reasoning about which of three tiers produced a given day's number. The cost is that a newly added Owner/Assistant, or a week nobody got around to entering, silently schedules as fully unavailable rather than assuming a default; staff are expected to keep Capacity Events current the same way they'd keep a real calendar current.

Capacity Events also replace the old freeform per-day AssistantAvailability list — Assistants are assigned to an Event the same way Owners are (by name, not a User account, matching Assistant's existing definition), rather than entered as a separate per-day record.
