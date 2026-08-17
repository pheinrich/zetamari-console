---
status: accepted
---

# Promised Date and Projected Completion Date are separate fields

Today's Google Sheet computes a due date once at order intake (the customer's request, or order date + 7-8 weeks) and rarely revisits it, which lets orders silently fall behind without anyone noticing until it's nearly too late. We decided the console will track two distinct dates per order: a **Promised Date** (the calendar date committed to the customer, fixed once given) and a **Projected Completion Date** (continuously recalculated from the live production queue and capacity), so the system can surface "this order's promised date is now at risk" before the ship date arrives, rather than only after.

We chose two fields over a single mutable "due date" because collapsing them into one loses one of two things: recalculating it in place loses the original commitment made to the customer, while leaving it static loses the early-warning signal. The whole value of this project over the spreadsheet it replaces is catching drift early — which requires keeping both.
