---
status: accepted
---

# Grouting Day is a sticky, first-come-first-served reservation

Every other scheduling input in this system (Capacity, Weekly Budget, the daily Piece simulation) is a pure function of current state, recomputed lazily per ADR-0005. Grouting Day can't work that way: real shop practice is that once a candidate Grouting Day is proposed for an order, other orders scheduled afterward have to work around it, not reshuffle it — an already-tentative date may already have been communicated to a customer or to volunteer assistants who said they'd come.

So a Grouting Day, once computed for an order, is stored and treated as reserved rather than re-derived from scratch on every read. When a new order needs a Grouting Day, the suggestion logic checks already-reserved dates and yields to them first-come-first-served (the earlier-arriving order keeps its slot, even against a newer, higher-priority order) — a calendar-booking model, not the at-risk priority queue used elsewhere. The ~2-week preferred cadence between Grouting Days is a soft preference this logic tries for, not a hard constraint: it will schedule a tighter gap, even back-to-back weeks, rather than push a Grouting Day past what's needed to honor an order's Explicit Promised Date.

Grouting Day has the same Explicit/Computed origin split as Promised Date, so staff can manually lock a date (Explicit), which then stops moving even if the suggestion logic would otherwise reassign it — the same override pattern used elsewhere rather than a new one.

**Consequence:** manually shifting one order's committed date needs an explicit recompute/preview step (its own follow-up feature, not v1) to show the cascading effect on other orders' reserved Grouting Days, since nothing recomputes this automatically on its own.
