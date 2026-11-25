'use server'

import Order from '@/db/models/Order'

// The write-side half of docs/adr/0005's lazily-recomputed-cache
// pattern (same shape as productCost.js's markAllProductsCostStale()).
// The read-side half (ensureProjectionsFresh(), which used to recompute
// projectedCompletionDate/promisedDate/groutingDayId off the Capacity
// engine) was removed along with capacity planning itself - see
// docs/adr/0008. These two are kept as harmless no-ops-in-effect so
// scheduleStale keeps meaning what it always meant, ready for whatever
// recompute engine eventually replaces the retired one.
export async function markOrdersScheduleStale( orderIds )
{
  if( !orderIds?.length )
    return

  await Order.update( {scheduleStale: true}, {where: {id: orderIds}} )
}

// CapacityEvent edits used to affect the whole shared pool, not one
// order - kept for the same call sites (a new order, a Promised Date
// edit, a deleted order) that still reasonably want to flag the whole
// open backlog as needing a future recompute.
export async function markAllOrdersScheduleStale()
{
  await Order.update( {scheduleStale: true}, {where: {}} )   // shipped ones too - harmless, nothing recomputes
}
