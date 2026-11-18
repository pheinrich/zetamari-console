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

## Order intake

**Sales Channel**:
A marketplace or storefront orders arrive through — IndieMe, Faire, Houzz, and so on. Each notifies the business by email when an order is placed; those emails are the console's intake path (see Inbound Email).

**Inbound Email**:
A sales-channel notification email received at `/api/inbound/order-email`, stored byte-for-byte whether or not it was an order. Classified as a new order, some other notice from a known channel (payouts, ship reminders, retailer messages — kept but not parsed), or unrecognized. Kept raw so a parser fix can be replayed over past mail; one that couldn't be parsed is marked failed, not dropped. Most arrive by a Gmail filter's auto-forward, which keeps the channel as sender; a **forward** is one Angie or Peter forwarded by hand from their zetamari.com address (e.g. a historical order), trusted only when SES verified it came from zetamari.com. Emails forwarded as attachments each become an Inbound Email of their own, exactly as if they'd arrived directly; an inline forward is parsed, best-effort, as the email it quotes.

**Channel Order**:
An order as a Sales Channel reported it, staged for review before it becomes an Order. Keeps the channel's own order number, buyer, ship-to, totals, and each line's channel SKU, description and price as received — matched to a console Product where the SKU matches exactly, left unmatched otherwise, never silently corrected. Separate from Order because an Order's lines must each resolve to a Product (they spawn Pieces), while channel SKUs drift from the console's and QuickBooks' through data-entry errors and unsynced changes, and some channels send only part of the order by email (Faire's are completed from its API; Artful Home's lack quantities). A person reviews it, then accepts it into an Order or dismisses it. One exception to "as received": Artful Home names products only by its own item numbers, which a hard-coded table (`artfulhomeSkus.js`) translates to our SKUs, keeping the item number in the line's description.
_Avoid_: Import — an Order created by hand and one accepted from a Channel Order are the same thing once accepted; "Channel Order" names only the staged, as-reported form.

## Manufacturing scheduling

**Piece**:
A single physical unit of a product being produced, corresponding to one unit of quantity on an order line. Tracked individually through the pre-Grouting Production Phases. Pieces of the same product are fungible until shipped — a piece may be reassigned to a different order than the one that originally generated it (rare, e.g. to salvage a deadline when an order can't otherwise be completed).
_Avoid_: Item — overloaded with "item SKU," which names the sellable Product, not the physical piece fulfilling an order.

**Production Phase**:
One of eight stages a Piece moves through, matching `CostFactor`'s labor categories: Design, CNC, Sanding, Picking, Gluing, Grouting, Glass, Finishing. Which stages a given Piece actually passes through depends on its Product's `type`: a **kit** Product (customer assembles it themselves) takes Design → CNC → Sanding → Picking → Glass → Finishing; every other ("finished") Product takes Design → CNC → Sanding → Gluing → Grouting → Glass → Finishing. Glass is skipped automatically (no manual step) whenever a Piece's estimated Glass time is zero — the common case, since most glass arrives pre-cut; only products with a manually-configured hand-cutting need have any Glass work at all.

Design, CNC, Sanding, and Glass are Owner-only. Gluing and Picking are mostly Owner with light Assistant help. Grouting and Finishing are shared Owner+Assistant capacity, scheduled together on a Grouting Day rather than ordinary day-to-day Capacity — see that entry. Pieces progress individually and at their own pace through every phase up through Grouting-readiness; grouping Pieces onto a shared Grouting Day is a scheduling convenience, not a rule — ad hoc or partial grouting (fewer than an order's full set of Pieces on a given day) is expected and normal, not an exception.
_Avoid_: "batch gate" — an earlier version of this entry described Grouting as blocked until every Piece on an order cleared pre-Grouting work. That turned out not to reflect reality; grouting decisions are made per-Piece, not per-Order.

**Grouting Day** (dormant):
The periodic shop event when Grouting and Finishing work happens, since both need a temporary crew beyond the two Owners: a call goes out to a pool of occasional volunteer Assistants, whose turnout is unknown until they respond. Volunteers aren't tracked as named Users/Capacity — a Grouting Day instead carries a manually-entered, adjustable estimate of available hours (typically 1-3 volunteers at roughly 5 worked hours + 1 lunch hour each), alongside the Owners' own Capacity for that day (which can flex well beyond a normal day, up to around 12 hours). Preferred cadence is about two weeks between Grouting Days, though this is a soft preference, not a hard rule — a tighter gap, even back-to-back weeks, is used when needed to honor an Explicit Promised Date.

Target dates prefer Saturday (Sunday as fallback), derived by working backward two days from the shop's preferred Monday ship date. Assigned per order, not globally recomputed from scratch each time it's viewed: once a Grouting Day is computed for an order it's treated as reserved (sticky), so other orders schedule around it, first-come-first-served — an order that arrives later yields to an already-tentative Grouting Day claimed by an order that arrived earlier, even if the later order would otherwise be higher-priority. Has the same Explicit/Computed origin split as Promised Date: **Computed** (suggested by the cadence-avoiding scheduling logic) or **Explicit** (staff have manually committed to a date, which then stops moving automatically).

Per docs/adr/0008, nothing currently assigns a Grouting Day — the table and `Order.groutingDayId` are kept (rather than dropped) so the Orders/Production UI's Grouting column and this entry's model are ready for whatever scheduling engine eventually replaces the retired one.

**Capacity** (retired):
The number of hours a specific Owner or Assistant could work production on a given calendar day — the scheduling input Projected Completion Date was calculated from. Removed along with the rest of manufacturing-scheduling's backlog simulation — see docs/adr/0008, which supersedes docs/adr/0007 below. There is currently no Capacity concept at all; a future rebuild is expected to build on Basic Event/Participant (see the Calendar section) rather than reintroduce a separate Capacity-specific entity.

**Capacity Event** (retired):
A named, colored, date-spanning calendar entry (title, start/end date, color, notes) that was the sole way explicit Capacity got entered, each with per-day hours per assigned Owner/Assistant. Dropped entirely by docs/adr/0008 in favor of the much simpler Basic Event (see the Calendar section) — no capacity/hours concept survives.
_Avoid_: Weekly Budget — an earlier version of Capacity fell back to a per-week budget (itself falling back to a standing per-person default) when no day-specific value was set; retired even before Capacity Event itself was.

**Promised Date** (dormant):
The calendar date committed to the customer for an order's completion, fixed once given. Has one of two origins, which is tracked because it drove scheduling priority when Capacity was scarce: **Explicit** (the customer's own requested date, honored if feasible) or **Computed** (derived from the current backlog — for an order needing Grouting, rounded up to the shop's preferred Monday ship date, worked back from its Grouting Day). Does not move once promised. Still settable (staff can still hand-enter an Explicit one), but nothing computes it automatically any more — see docs/adr/0008.
_Avoid_: Due Date — the Google Sheet's catch-all term for what are actually two distinct concepts here; see also Projected Completion Date.

**Projected Completion Date** (dormant):
A continuously recalculated estimate of when an order will actually finish, based on a piece-level simulation of the current production queue against Capacity. Used to detect and flag when an order's Promised Date is at risk, before the ship date arrives. Per docs/adr/0008 this is no longer computed — the column and the Orders/Production UI that display it are kept, blanked out, ready for a rebuilt engine.
_Avoid_: Due Date — same as above.

**Key Material SKU** (retired):
The Google Sheet's manual workaround column identifying a line item's primary raw material (e.g. wooden base size) for CNC cut planning — needed because the underlying BOM data was never fully populated. The console does not carry this field forward; material requirements for planning are derived from a properly populated `BillOfMaterial` instead. An incomplete BOM is a data-quality gap to close, not a workaround to reinvent.

## People & access

**Person**:
The single record for anyone the business deals with — staff, retail/wholesale customers, class students, art-show contacts — replacing the separate User (staff login) and Customer (contact/student) tables. See docs/adr/0008: a login-capable "User" and a "Customer" turned out to be the same underlying concept (a person playing a role), so `User`/`Customer` were merged into one `People` table once Role gave the app somewhere to put "which capacities does this person act in" other than a single enum column. A Person can hold any number of Roles at once (e.g. an Owner who's also an Admin and a Student), including zero. Whether a Person "is a User" is derived from whether `password` is set, not a stored flag — the same "derived, not stored" spirit as a Customer "being a student" via LiveClassAttendee.

**Role**:
A named bundle of Permissions a Person can be assigned (Admin, User, Owner, Assistant, Retail Customer, Wholesale Customer, Student, ...), replacing the old `User.role` and `Customer.type` enum columns. Many-to-many with Person via PersonRole, and many-to-many with Permission via RolePermission.

**Permission**:
A single grantable capability a Role can bundle in. Modeled now (with real CRUD, at `/roles` and `/permissions`) but not enforced anywhere yet — `AuthGuard` still just checks for a logged-in session, regardless of Role/Permission. This is deliberate groundwork for a real access-control pass, not a finished feature.

## Calendar

**Basic Event**:
The simple, generic calendar entry — Title, Start Datetime, End Datetime, Color, Description, nothing else — that replaced the Capacity Calendar's much more complicated Capacity Event (see docs/adr/0008). Optionally belongs to exactly one Event (art show/conference) or one LiveClass as one of its occurrences; otherwise stands alone on the `/calendar` page. An Event/LiveClass's schedule is now entirely its one-or-more owned Basic Events rather than a single startDate/endDate pair, so a multi-day show can carry different hours on different days (e.g. 10-8 Fri/Sat, 10-6 Sun).

**Participant**:
The plain many-to-many between a Basic Event and a Person — a Basic Event can have zero or more Participants, and a Person can be a Participant on zero or more Basic Events. Deliberately simpler than LiveClassAttendee (no status/discount/snapshot fields) — that richer, class-enrollment-specific roster is a separate concept, kept as-is for now rather than merged into this.
