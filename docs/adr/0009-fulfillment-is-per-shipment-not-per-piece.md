---
status: accepted
---

# Fulfillment is tracked per Shipment, not per Piece

Every product on an order has to be gathered, packed, documented and handed off, including ones that aren't built here (supplies, bases sold as-is). Pieces only cover built products, so the obvious extension would have been to give every product Pieces and add fulfillment phases after Finishing. We decided against that:

- **Not every product comes in whole units.** A Piece is one physical unit. Supplies can be fractional (pounds of grout), and a line of 200 tile packs shouldn't become 200 rows.
- **Fulfillment steps happen per box, not per unit.** Packing, paperwork and transport apply to whatever leaves together. Tracking them on every unit repeats them, and the copies can disagree.
- **The steps differ.** Production phases describe building one object; fulfillment describes getting a group of things to someone.

So a Piece keeps tracking production only, and a **Shipment** (see CONTEXT.md) carries fulfillment: an Order has one or more (partial shipments are normal), each moving through Picking, Packing, Paperwork and Hand-off by one transport mode (carrier pickup, drop-off, will call, or delivery). A built product ships as specific finished Pieces, claimed by the Shipment; anything else ships as a quantity picked from **Stock**, the per-Product quantity on hand tracked on Inventory > Stock. Whether a Shipment is ready to pack is derived from its Pieces and Stock, not stored.

"Picking" is the industry term for gathering an order's products, so the kit-only Production Phase and Labor stage that had that name (sorting a kit's tesserae) was renamed **Assembly**, along with its CostFactor key (`laborAssembly`) and Settings rate (`assemblyRateSqInPerHr`).

Stock is deliberately simple: a table of tracked Products and quantities, correctable by hand, that also moves by itself for tracked Products — up one when a Piece reaches **Ready** (a phase added after Finishing, since Finishing had no "done" state for a Shipment to wait on), down by a Shipment's quantities when it finishes Picking. It may go negative rather than block shipping on a stale count.

Shipment builds on the existing `Shipment` model (Order has many; carrier and tracking), which already allowed several per Order. Each step is a timestamp (`pickedAt`, `packedAt`, `documentedAt`, `handedOffAt`), so the current step is derived and the history kept. `Orders.packedOn`/`completedOn` were dropped: an Order is packed or shipped once Shipments that far along cover all its lines, so the dates are derived, and the migration turned each Order that had them into a Shipment carrying those dates.
