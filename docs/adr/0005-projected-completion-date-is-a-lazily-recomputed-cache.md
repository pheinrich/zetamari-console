---
status: accepted
---

# Projected Completion Date is a lazily-recomputed cache

Projected Completion Date depends on the entire backlog (any order can shift another's projection when they compete for the same day's Capacity), so it can't be computed per-order in isolation. Rather than recompute it fresh on every read (expensive as order volume grows) or eagerly inside every mutating action (makes a single Capacity edit block on a full-backlog simulation), we're storing it as a cache: any relevant write (new/moved Piece, phase change, Capacity/Weekly Budget edit, new Order) marks affected orders' cached value stale, and the real recompute happens lazily, only for whichever orders are next read.

This is the same pattern already used for Product COGS costs (`productCost.js`'s `cogsCostCacheStale`/`markAllProductsCostStale()`), reused here rather than inventing a second caching convention for the same shape of problem.

Grouting Day assignments (see `CONTEXT.md`) are a deliberate exception to this — they're sticky/reserved once computed, not recomputed fresh on every read. See ADR-0006.
