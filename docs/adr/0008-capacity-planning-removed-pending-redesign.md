---
status: accepted
---

# Capacity planning removed, pending redesign

The Capacity Calendar (Capacity Events, Capacity Event people, the `simulateBacklog()` backlog simulation, and the automatic Grouting Day assignment it drove) had grown too complicated relative to the value it was delivering, and was blocking a more basic need: a simple, generic calendar entity that Live Classes and Events (art fairs/shows) could use to express their own schedules, including multi-day occurrences with different hours per day.

Rather than keep extending the Capacity system to also cover that, capacity planning is set aside for now. `CapacityEvent`/`CapacityEventPerson` are dropped entirely, and the scheduling engine (`src/libs/pieceScheduling.js`'s `simulateBacklog()`/`expandCapacityEvents()`/`assignGroutingDay()`) is removed along with them. This supersedes docs/adr/0007 — Capacity is no longer sourced from anything; there is currently no Capacity concept at all.

`Order.projectedCompletionDate`, `promisedDate`/`promisedDateOrigin`, `groutingDayId`, and `scheduleStale`, along with the Orders/Production UI columns that display them, are deliberately left in place rather than torn out — they're blanked out (existing values nulled by the removal migration) and simply don't get recomputed any more, so the schema and UI are ready to receive a rebuilt scheduling engine later without another migration. `GroutingDay` is kept for the same reason; it just stays empty going forward.

In its place, the calendar concept is rebuilt from a clean, deliberately simple foundation:

- **Basic Event** — Title, Start Datetime, End Datetime, Color, Description. Nothing else. See CONTEXT.md's Basic Event entry.
- **Participant** — a plain many-to-many between a Basic Event and a Person (see below), for "who's attending/working this". Deliberately simpler than the existing `LiveClassAttendee` roster (no status/discount/snapshot fields) — that richer, class-enrollment-specific concept stays separate.
- Events (art shows/conferences) and LiveClasses now express their schedule as one-or-more owned Basic Events instead of a single `startDate`/`endDate` pair, so a multi-day show can carry different hours per day.

This same pass also merges `User` and `Customer` into one `Person` table (see CONTEXT.md's Person entry) with many-to-many `Role`s (`Role`/`Permission`/`PersonRole`/`RolePermission`) replacing the old `User.role` and `Customer.type` enum columns — a prerequisite called out explicitly before Participant could be added, since a participant, a customer, and a user were all really "a person playing a role." `Permission` is modeled but not yet enforced anywhere (`AuthGuard` still only checks for a logged-in session) — that's future work this lays the groundwork for.

When capacity planning is rebuilt, it's expected to build on Basic Event/Participant rather than reintroduce a separate Capacity-specific calendar entity.
