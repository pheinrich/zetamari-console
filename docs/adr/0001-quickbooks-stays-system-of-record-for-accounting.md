---
status: accepted
---

# QuickBooks Online stays the system of record for accounting

The console is being built to replace a strained Google Sheet that collates orders from many sales channels for manufacturing scheduling — not to replace QuickBooks Online, which currently holds customer/order/financial data. We decided the console will own operational data (orders for scheduling/production purposes, customer records, product/cost data) while QBO remains authoritative for invoicing and financials. The console does not sync order data back into QBO, and does not attempt to become the accounting system of record in v1.

We chose this over having the console absorb order data end-to-end (accounting included) because becoming a financial system of record carries a much higher accuracy/trust bar than being a scheduling and ops tool, and conflating the two risked delaying the actual pain point (scheduling relief) to solve a problem (accounting) that isn't currently broken.
