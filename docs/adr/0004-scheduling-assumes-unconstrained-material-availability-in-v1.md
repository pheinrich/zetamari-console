---
status: accepted
---

# Scheduling assumes unconstrained material availability in v1

Projected Completion Date is calculated purely from labor Capacity; it does not check whether a Piece's materials are actually in stock, even though `BillOfMaterial` data quality is a known gap (see the retired Key Material SKU note in `CONTEXT.md`). We're treating material availability as in-scope for the scheduling feature eventually, but not a blocker for v1 — the default assumption is that necessary materials are always available.

This keeps the BOM data-quality workstream from gating scheduling, at the cost of Projected Completion Date being optimistic until BOM coverage and stock-awareness are added.
