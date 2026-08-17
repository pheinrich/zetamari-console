---
status: accepted
---

# Customer-facing access is an unauthenticated Design Link, not a portal

Customers (wholesale and retail) need to view product visualizations and pricing for consultative/estimation purposes. We decided v1 exposes this via a staff-generated Design Link — an unauthenticated, optionally password-protected URL scoped to one product's visualization and the viewer's price tier — rather than building customer accounts/login.

We chose this over a full customer portal because a portal is a substantially larger investment (customer auth, account management, a permanently-exposed authenticated surface) that isn't yet justified — the near-term need is "staff shares a specific design with a specific customer during a sales conversation," not standing self-service access. This may evolve into a portal-like experience later; if so, that's a new decision, not an extension of this one, since it changes the trust/security model (standing accounts vs. ephemeral scoped links).
