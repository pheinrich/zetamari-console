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
One of six stages a piece or order moves through: Design, CNC, Sanding, Gluing, Grouting, Finishing (the same categories already used by `CostFactor` for cost estimation). Design/CNC/Sanding are Owner-only capacity; Gluing is mostly Owner with light Assistant help; Grouting and Finishing are shared Owner+Assistant capacity, worked in parallel on the same phase.
Pieces progress individually through the pre-Grouting phases at their own pace. An order cannot enter Grouting until *every* one of its Pieces has cleared its pre-Grouting phases — Grouting and Finishing happen per-order, as a batch, not per-piece. This is a hard gate; legitimate exceptions are handled by manually splitting the order itself (rare), not by partially grouping it. Splitting produces two independent Orders, each carrying its own Promised Date — not an internal sub-grouping of Pieces within one order.

**Capacity**:
The number of hours a specific Owner or Assistant can work production on a given calendar day — the scheduling input Projected Completion Date is calculated from. Set per day when known, falling back to an even split of that person's Weekly Budget across the week's business days when no day-specific value is set. A single shared pool per person per day, not tracked separately per Production Phase — scheduling allocates it across whichever phases have queued work.

**Weekly Budget**:
The total production hours a specific Owner or Assistant is expected to work in a given calendar week (e.g. 40 hrs for Week 23), evenly divided across that week's business days to produce a default daily Capacity. Falls back to that person's standing recurring default when no week-specific value has been set — an unset week is never treated as zero Capacity.

**Promised Date**:
The calendar date committed to the customer for an order's completion, fixed once given. Has one of two origins, which is tracked because it drives scheduling priority when Capacity is scarce: **Explicit** (the customer's own requested date, honored if feasible) or **Computed** (derived from the current backlog, when there was no feasible customer request). Does not move once promised.
_Avoid_: Due Date — the Google Sheet's catch-all term for what are actually two distinct concepts here; see also Projected Completion Date.

**Projected Completion Date**:
A continuously recalculated estimate of when an order will actually finish, based on a piece-level simulation of the current production queue against Capacity. Used to detect and flag when an order's Promised Date is at risk, before the ship date arrives. When multiple orders compete for the same day's Capacity, priority goes first to the most at-risk/overdue order with an Explicit Promised Date, then the most at-risk/overdue order with a Computed Promised Date, then not-yet-promised orders in order-received sequence.
_Avoid_: Due Date — same as above.

**Key Material SKU** (retired):
The Google Sheet's manual workaround column identifying a line item's primary raw material (e.g. wooden base size) for CNC cut planning — needed because the underlying BOM data was never fully populated. The console does not carry this field forward; material requirements for planning are derived from a properly populated `BillOfMaterial` instead. An incomplete BOM is a data-quality gap to close, not a workaround to reinvent.
