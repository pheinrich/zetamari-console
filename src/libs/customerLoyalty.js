// Class-count-based loyalty perks for "students" - Customers linked to
// one or more LiveClasses via LiveClassAttendee (see that model; a
// Customer who's only ever bought a self-guided online learning Product
// is explicitly NOT a student). Free apron at the 3rd class; a discount
// starts at the 4th, defaulting to 20% the first time that threshold is
// crossed, but independently, permanently adjustable per customer from
// then on (Customer.discountPercent) - so this module only computes
// ELIGIBILITY off a raw class count, never the discount rate itself.
// Plain, dependency-free functions (not a 'use server' action file) so
// both server code (db/actions/customer.js/liveClass.js) and client
// components can compute the same thresholds without a round-trip.
export const APRON_CLASS_COUNT = 3
export const DISCOUNT_CLASS_COUNT = 4
export const DEFAULT_DISCOUNT_PERCENT = 20

export function isApronEligible( classCount )
{
  return (classCount ?? 0) >= APRON_CLASS_COUNT
}

export function isDiscountEligible( classCount )
{
  return (classCount ?? 0) >= DISCOUNT_CLASS_COUNT
}
