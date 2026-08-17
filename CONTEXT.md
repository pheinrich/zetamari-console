# Zetamari Console

Centralized internal system for a small art-manufacturing business (custom wooden-base mirrors, mosaic/tile/bead kits, and related craft products) that also teaches live classes. Consolidates order intake from many sales channels, product design/costing, manufacturing scheduling, and reporting into one tool, replacing a strained multi-channel Google Sheet workflow.

## Language

**Owner**:
One of the business's two owner-operators (the artist and their spouse), who perform artistic/production labor themselves as well as running the business. Used as the "who did this labor" attribution alongside Assistant in cost-factor labor splits.
_Avoid_: Artist — "Owner" is the broader, more accurate term since it covers both owner-operators, not just the one who does the art.

**Assistant**:
Hired help who performs production labor alongside an Owner. Paired with Owner in labor cost-split calculations (`CostFactor.defaultOwnerSharePercent`).

**Design Link**:
A staff-generated, unauthenticated (optionally password-protected) URL that gives a specific customer view-only access to one product's visualization and price, scoped to that customer's price tier (wholesale or retail). The v1 mechanism for customer-facing access.
_Avoid_: Portal — reserved for a possible future authenticated, multi-order customer experience; not the same thing as a Design Link and not yet built.

## Manufacturing scheduling

**Piece**:
A single physical unit of a product being produced, corresponding to one unit of quantity on an order line. Tracked individually through the pre-Grouting Production Phases. Pieces of the same product are fungible until shipped — a piece may be reassigned to a different order than the one that originally generated it (rare, e.g. to salvage a deadline when an order can't otherwise be completed).
_Avoid_: Item — overloaded with "item SKU," which names the sellable Product, not the physical piece fulfilling an order.

**Production Phase**:
One of eight stages a Piece moves through, matching `CostFactor`'s labor categories: Design, CNC, Sanding, Picking, Gluing, Grouting, Glass, Finishing. Which stages a given Piece actually passes through depends on its Product's `type`: a **kit** Product (customer assembles it themselves) takes Design → CNC → Sanding → Picking → Glass → Finishing; every other ("finished") Product takes Design → CNC → Sanding → Gluing → Grouting → Glass → Finishing. Glass is skipped automatically (no manual step) whenever a Piece's estimated Glass time is zero — the common case, since most glass arrives pre-cut; only products with a manually-configured hand-cutting need have any Glass work at all.

Design, CNC, Sanding, and Glass are Owner-only. Gluing and Picking are mostly Owner with light Assistant help. Grouting and Finishing are shared Owner+Assistant capacity, scheduled together on a Grouting Day rather than ordinary day-to-day Capacity — see that entry. Pieces progress individually and at their own pace through every phase up through Grouting-readiness; grouping Pieces onto a shared Grouting Day is a scheduling convenience, not a rule — ad hoc or partial grouting (fewer than an order's full set of Pieces on a given day) is expected and normal, not an exception.
_Avoid_: "batch gate" — an earlier version of this entry described Grouting as blocked until every Piece on an order cleared pre-Grouting work. That turned out not to reflect reality; grouting decisions are made per-Piece, not per-Order.

**Grouting Day**:
The periodic shop event when Grouting and Finishing work happens, since both need a temporary crew beyond the two Owners: a call goes out to a pool of occasional volunteer Assistants, whose turnout is unknown until they respond. Volunteers aren't tracked as named Users/Capacity — a Grouting Day instead carries a manually-entered, adjustable estimate of available hours (typically 1-3 volunteers at roughly 5 worked hours + 1 lunch hour each), alongside the Owners' own Capacity for that day (which can flex well beyond a normal day, up to around 12 hours). Preferred cadence is about two weeks between Grouting Days, though this is a soft preference, not a hard rule — a tighter gap, even back-to-back weeks, is used when needed to honor an Explicit Promised Date.

Target dates prefer Saturday (Sunday as fallback), derived by working backward two days from the shop's preferred Monday ship date. Assigned per order, not globally recomputed from scratch each time it's viewed: once a Grouting Day is computed for an order it's treated as reserved (sticky), so other orders schedule around it, first-come-first-served — an order that arrives later yields to an already-tentative Grouting Day claimed by an order that arrived earlier, even if the later order would otherwise be higher-priority. Has the same Explicit/Computed origin split as Promised Date: **Computed** (suggested by the cadence-avoiding scheduling logic) or **Explicit** (staff have manually committed to a date, which then stops moving automatically).

**Capacity**:
The number of hours a specific Owner or Assistant can work production on a given calendar day — the scheduling input Projected Completion Date is calculated from. Set per day when known, falling back to an even split of that person's Weekly Budget across the week's business days when no day-specific value is set. A single shared pool per person per day, not tracked separately per Production Phase — scheduling allocates it across whichever phases have queued work. Doesn't cover Grouting Day's occasional volunteer Assistants — see that entry.

**Weekly Budget**:
The total production hours a specific Owner or Assistant is expected to work in a given calendar week (e.g. 40 hrs for Week 23), evenly divided across that week's business days to produce a default daily Capacity. Falls back to that person's standing recurring default when no week-specific value has been set — an unset week is never treated as zero Capacity.

**Promised Date**:
The calendar date committed to the customer for an order's completion, fixed once given. Has one of two origins, which is tracked because it drives scheduling priority when Capacity is scarce: **Explicit** (the customer's own requested date, honored if feasible) or **Computed** (derived from the current backlog — for an order needing Grouting, rounded up to the shop's preferred Monday ship date, worked back from its Grouting Day). Does not move once promised.
_Avoid_: Due Date — the Google Sheet's catch-all term for what are actually two distinct concepts here; see also Projected Completion Date.

**Projected Completion Date**:
A continuously recalculated estimate of when an order will actually finish, based on a piece-level simulation of the current production queue against Capacity. Used to detect and flag when an order's Promised Date is at risk, before the ship date arrives. When multiple orders compete for the same day's Capacity, priority goes first to the most at-risk/overdue order with an Explicit Promised Date, then the most at-risk/overdue order with a Computed Promised Date, then not-yet-promised orders in order-received sequence.
_Avoid_: Due Date — same as above.

**Key Material SKU** (retired):
The Google Sheet's manual workaround column identifying a line item's primary raw material (e.g. wooden base size) for CNC cut planning — needed because the underlying BOM data was never fully populated. The console does not carry this field forward; material requirements for planning are derived from a properly populated `BillOfMaterial` instead. An incomplete BOM is a data-quality gap to close, not a workaround to reinvent.
