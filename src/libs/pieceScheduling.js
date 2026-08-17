// The manufacturing-scheduling recalculation engine's core logic - see
// CONTEXT.md's Manufacturing scheduling section and docs/adr/0004-0006
// for the settled domain model this implements. Framework-free (no
// Sequelize/Next imports) so it stays independently testable and
// reusable from both db/actions/scheduling.js and, eventually, UI code
// that wants to preview a what-if without writing anything - see
// db/actions/scheduling.js for how it's wired to real data.
//
// Dates are handled as plain 'YYYY-MM-DD' strings everywhere in this
// module's public interface (matching how Sequelize DATEONLY columns
// round-trip - see db/actions/settings.js's neighbors, none of which
// convert DATEONLY to/from a Date object either), parsed to a local
// midnight Date only for date-fns arithmetic and immediately formatted
// back - see parseDateOnly()/formatDateOnly() below. This sidesteps
// Date.toISOString()'s UTC conversion, which can shift a date-only
// value by a day depending on the server's timezone offset.
import { addDays, isWeekend, startOfWeek } from 'date-fns'
import { computeDefaultQuantities, convertToRateUnit } from './costFactors'

export function parseDateOnly( dateStr )
{
  const [year, month, day] = dateStr.split( '-' ).map( Number )
  return new Date( year, month - 1, day )
}

export function formatDateOnly( date )
{
  const year = date.getFullYear()
  const month = String( date.getMonth() + 1 ).padStart( 2, '0' )
  const day = String( date.getDate() ).padStart( 2, '0' )
  return `${year}-${month}-${day}`
}

// CONTEXT.md's Production Phase: which phases a Piece passes through,
// and in what order, depends on its Product's type. A 'kit' product
// (customer assembles it themselves) never enters Grouting at all;
// every other ("finished") product does. Glass comes after either
// branch and before Finishing in both - Picking is kit-specific prep,
// Gluing+Grouting is the finished-product path, Glass is hand-cutting
// needed by either when glass doesn't arrive pre-cut.
export const PHASE_SEQUENCES = {
  kit: ['Design', 'CNC', 'Sanding', 'Picking', 'Glass', 'Finishing'],
  finished: ['Design', 'CNC', 'Sanding', 'Gluing', 'Grouting', 'Glass', 'Finishing'],
}

// Matches Piece.phase's ENUM values to the CostFactor.key each phase's
// duration is computed from.
export const PHASE_TO_COST_FACTOR_KEY = {
  Design: 'laborDesign',
  CNC: 'laborCnc',
  Sanding: 'laborSanding',
  Picking: 'laborPicking',
  Gluing: 'laborGluing',
  Grouting: 'laborGrouting',
  Glass: 'laborGlass',
  Finishing: 'laborFinishing',
}

// Design/CNC/Sanding/Glass are Owner-only capacity - a hard rule, not
// just a description of who happens to have Capacity entered (see
// CONTEXT.md's Production Phase entry). Picking/Gluing are "mostly
// Owner, light Assistant help" - both roles' ordinary Capacity is
// eligible, so they're absent from this set.
export const OWNER_ONLY_PHASES = new Set( ['Design', 'CNC', 'Sanding', 'Glass'] )

export function getPhaseSequence( product )
{
  return 'kit' === product?.type ? PHASE_SEQUENCES.kit : PHASE_SEQUENCES.finished
}

// A Piece's estimated duration for its current phase, in hours - reuses
// computeDefaultQuantities() (the same function productCost.js's
// costing uses) plus any active ProductCostOverride, so scheduling and
// costing can never quietly disagree about how long a phase takes (Q7 -
// two independently-maintained duration figures for the same physical
// activity was explicitly rejected). Returns 0 when the phase is
// disabled (effectiveEnabled false) or has no estimated time - callers
// use that to auto-skip Glass on the common case where nothing needs
// hand-cutting (Q17).
export function getPieceDurationHours( phase, product, settingsJson, costFactorsByKey, overrideByFactorId )
{
  const factor = costFactorsByKey[PHASE_TO_COST_FACTOR_KEY[phase]]
  if( !factor )
    return 0

  const computed = computeDefaultQuantities( product, settingsJson )
  const override = overrideByFactorId?.[factor.id]

  const rawComputedQuantity = computed[factor.key] ?? 0
  const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
  const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
  const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : true

  if( !effectiveEnabled )
    return 0

  return convertToRateUnit( effectiveQuantity, factor )
}

// CONTEXT.md's Capacity/Weekly Budget fallback chain: an explicit
// per-day Capacity row wins when set; otherwise that week's WeeklyBudget
// divided evenly across the week's business days; otherwise the User's
// own standing defaultWeeklyHours divided the same way; otherwise 0. An
// unset week is never treated as zero Capacity on its own - it falls
// through to the next tier instead.
function countBusinessDaysInWeek( weekStart )
{
  let count = 0
  for( let i = 0; i < 7; i++ )
    if( !isWeekend( addDays( weekStart, i ) ) )
      count++

  return count
}

export function resolveDailyCapacity( userId, dateStr, capacityByUserDate, weeklyBudgetByUserWeek, usersById )
{
  const explicitCapacity = capacityByUserDate[`${userId}:${dateStr}`]
  if( null != explicitCapacity )
    return explicitCapacity

  const weekStart = startOfWeek( parseDateOnly( dateStr ), {weekStartsOn: 1} )
  const businessDays = countBusinessDaysInWeek( weekStart )
  if( 0 === businessDays )
    return 0

  const weeklyBudget = weeklyBudgetByUserWeek[`${userId}:${formatDateOnly( weekStart )}`]
  if( null != weeklyBudget )
    return weeklyBudget / businessDays

  const defaultWeeklyHours = usersById[userId]?.defaultWeeklyHours
  if( null != defaultWeeklyHours )
    return defaultWeeklyHours / businessDays

  return 0
}

// CONTEXT.md's Grouting Day: target dates prefer Saturday (Sunday
// fallback), derived by working backward two days from the shop's
// preferred Monday ship date. See docs/adr/0006 for the full rationale
// behind the rest of this function - the ~2-week cadence is a soft
// preference the engine tries for, not a hard rule, and an
// explicitPromisedDate (a customer commitment already made) takes
// priority over honoring it (Q23).
const PREFERRED_CADENCE_DAYS = 14

export function assignGroutingDay( readyDateStr, explicitPromisedDateStr, existingGroutingDayDateStrs )
{
  const readyDate = parseDateOnly( readyDateStr )

  // The Saturday two days before shipMonday has to fall on or after
  // readyDate - rounding readyDate itself up to the next Monday doesn't
  // guarantee that (if readyDate already IS a Monday, "two days before"
  // lands the previous Saturday, before the piece was even ready). Push
  // readyDate forward by the 2-day Saturday-to-Monday gap *first*, then
  // round up to Monday, so the resulting Saturday is always >= readyDate.
  const shipMonday = nextOrSameMonday( addDays( readyDate, 2 ) )
  let candidate = addDays( shipMonday, -2 ) // Saturday, two days before Monday

  const explicitPromisedDate = explicitPromisedDateStr ? parseDateOnly( explicitPromisedDateStr ) : null
  const existingDates = existingGroutingDayDateStrs.map( parseDateOnly )

  // Re-check from scratch after every push-out, since pushing past one
  // conflicting date can land within range of another.
  let changed = true
  while( changed )
  {
    changed = false
    for( const existingDate of existingDates )
    {
      const gapDays = Math.abs( daysBetween( candidate, existingDate ) )
      if( 0 === gapDays || gapDays >= PREFERRED_CADENCE_DAYS )
        continue

      const pushedCandidate = addDays( existingDate, PREFERRED_CADENCE_DAYS )
      const pushedShipMonday = addDays( pushedCandidate, 2 )

      if( explicitPromisedDate && pushedShipMonday > explicitPromisedDate )
        continue // honoring the customer's date wins over cadence spacing

      candidate = pushedCandidate
      changed = true
    }
  }

  return {date: formatDateOnly( candidate ), shipMonday: formatDateOnly( addDays( candidate, 2 ) )}
}

function nextOrSameMonday( date )
{
  const day = date.getDay() // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  if( 1 === day )
    return date

  return addDays( date, (8 - day) % 7 )
}

function daysBetween( a, b )
{
  return Math.round( (a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000) )
}

// CONTEXT.md's Projected Completion Date: priority when Capacity is
// scarce goes first to the most at-risk/overdue order with an Explicit
// Promised Date, then Computed, then not-yet-promised orders in
// order-received sequence.
export function sortByPriority( orders )
{
  const rank = order => {
    if( 'explicit' === order.promisedDateOrigin )
      return 0
    if( 'computed' === order.promisedDateOrigin )
      return 1

    return 2
  }

  return [...orders].sort( (a, b) => {
    const rankDiff = rank( a ) - rank( b )
    if( 0 !== rankDiff )
      return rankDiff

    if( 2 === rank( a ) )
      return new Date( a.createdOn ) - new Date( b.createdOn )

    return new Date( a.promisedDate ) - new Date( b.promisedDate )
  } )
}

// Walks forward day-by-day from `startDateStr`, consuming `hoursNeeded`
// from whichever eligible User(s) have remaining Capacity that day
// (Owner-only phases only draw from role: 'owner' Users - see
// OWNER_ONLY_PHASES), mutating the shared `remainingCapacityCache` as it
// goes so later pieces/orders in the same simulateBacklog() run see an
// already-depleted pool, not a fresh one. Returns the date the phase's
// hours were fully consumed.
function consumeOrdinaryCapacity( hoursNeeded, startDateStr, ownerOnly, ctx )
{
  if( 0 === hoursNeeded )
    return startDateStr

  const eligibleUserIds = ctx.userIds.filter( id => !ownerOnly || 'owner' === ctx.usersById[id]?.role )
  if( 0 === eligibleUserIds.length )
    return startDateStr // nobody eligible to do this work - leave the date where it stood, at-risk detection will surface the stall via a non-advancing projection

  let remaining = hoursNeeded
  let cursor = startDateStr

  // Bounded to 2 years out so a pathological all-zero-Capacity backlog
  // can't spin forever - a real shop with nobody able to work a phase
  // for two years straight has bigger problems than this loop.
  for( let i = 0; i < 730 && remaining > 0; i++ )
  {
    for( const userId of eligibleUserIds )
    {
      if( remaining <= 0 )
        break

      const key = `${userId}:${cursor}`
      if( !(key in ctx.remainingCapacityCache) )
        ctx.remainingCapacityCache[key] = resolveDailyCapacity( userId, cursor, ctx.capacityByUserDate, ctx.weeklyBudgetByUserWeek, ctx.usersById )

      const available = ctx.remainingCapacityCache[key]
      if( available <= 0 )
        continue

      const consumed = Math.min( available, remaining )
      ctx.remainingCapacityCache[key] -= consumed
      remaining -= consumed
    }

    if( remaining > 0 )
      cursor = formatDateOnly( addDays( parseDateOnly( cursor ), 1 ) )
  }

  return cursor
}

// The core simulation. Re-derives every open order's schedule from
// scratch each call (today's date forward) rather than resuming a
// previous run's state - consistent with projectedCompletionDate being
// a lazily-recomputed cache (docs/adr/0005), not a persisted timeline.
// Grouting Day *assignments* are the deliberate exception (docs/adr/
// 0006): an order that already has a groutingDayId keeps it, so
// first-come-first-served is realized simply by processing orders in
// priority order and treating already-assigned Grouting Days (both
// this run's and prior runs') as reserved.
//
// Inputs are plain objects/arrays, already loaded by the caller (see
// db/actions/scheduling.js) - this function does no I/O.
export function simulateBacklog( {orders, pieces, productsById, users, capacities, weeklyBudgets, groutingDays, settingsJson, costFactors, overrides, todayStr} )
{
  const usersById = Object.fromEntries( users.map( u => [u.id, u] ) )
  const userIds = users.map( u => u.id )
  const costFactorsByKey = Object.fromEntries( costFactors.map( f => [f.key, f] ) )
  const overrideByFactorId = {}
  for( const o of overrides )
    (overrideByFactorId[o.productId] ??= {})[o.costFactorId] = o

  const capacityByUserDate = Object.fromEntries( capacities.map( c => [`${c.userId}:${c.date}`, c.hours] ) )
  const weeklyBudgetByUserWeek = Object.fromEntries( weeklyBudgets.map( w => [`${w.userId}:${w.weekStartDate}`, w.hours] ) )

  const groutingDaysByDate = Object.fromEntries( groutingDays.map( g => [g.date, g] ) )
  const groutingDaysById = Object.fromEntries( groutingDays.map( g => [g.id, g] ) )
  const reservedGroutingDayDates = groutingDays.map( g => g.date )

  const piecesByOrderId = {}
  for( const piece of pieces )
    (piecesByOrderId[piece.orderId] ??= []).push( piece )

  const ctx = {usersById, userIds, capacityByUserDate, weeklyBudgetByUserWeek, remainingCapacityCache: {}}

  const openOrders = orders.filter( o => !o.completedOn )
  const results = []

  for( const order of sortByPriority( openOrders ) )
  {
    const orderPieces = piecesByOrderId[order.id] ?? []
    let latestFinish = todayStr
    let groutingReadyDate = null // earliest date every finished-path piece has cleared its pre-Grouting phases

    for( const piece of orderPieces )
    {
      const product = productsById[piece.productId]
      const sequence = getPhaseSequence( product )
      const startIndex = sequence.indexOf( piece.phase )
      const remainingPhases = startIndex >= 0 ? sequence.slice( startIndex ) : sequence
      const isFinishedPath = sequence.includes( 'Grouting' )

      let cursor = todayStr

      for( const phase of remainingPhases )
      {
        // Grouting/Finishing (finished path only) don't consume ordinary
        // daily Capacity at all - they're scheduled against the order's
        // Grouting Day, resolved once below after every piece's own
        // pre-Grouting walk is done.
        if( isFinishedPath && ('Grouting' === phase || 'Finishing' === phase) )
        {
          if( 'Grouting' === phase )
            groutingReadyDate = groutingReadyDate && groutingReadyDate < cursor ? groutingReadyDate : cursor
          continue
        }

        const hoursNeeded = getPieceDurationHours( phase, product, settingsJson, costFactorsByKey, overrideByFactorId[piece.productId] )
        if( 0 === hoursNeeded )
          continue // auto-skip - e.g. Glass on a piece that doesn't need hand-cutting (Q17)

        cursor = consumeOrdinaryCapacity( hoursNeeded, cursor, OWNER_ONLY_PHASES.has( phase ), ctx )
      }

      // Kit-path pieces finish for real here; finished-path pieces still
      // have Grouting/Finishing pending, folded in below.
      if( !isFinishedPath )
        latestFinish = latestFinish < cursor ? cursor : latestFinish
    }

    let groutingDate = null

    if( null !== groutingReadyDate )
    {
      if( order.groutingDayId )
      {
        // Sticky - an already-reserved Grouting Day is never reassigned
        // (first-come-first-served, docs/adr/0006).
        groutingDate = groutingDaysById[order.groutingDayId]?.date ?? groutingReadyDate
      }
      else
      {
        const explicitPromisedDateStr = 'explicit' === order.promisedDateOrigin ? order.promisedDate : null
        const assignment = assignGroutingDay( groutingReadyDate, explicitPromisedDateStr, reservedGroutingDayDates )
        groutingDate = assignment.date

        if( !groutingDaysByDate[groutingDate] )
        {
          const newGroutingDay = {id: null, date: groutingDate, origin: 'computed', estimatedAssistantHours: null}
          groutingDaysByDate[groutingDate] = newGroutingDay
          reservedGroutingDayDates.push( groutingDate )
        }
      }

      latestFinish = latestFinish < groutingDate ? groutingDate : latestFinish
    }

    const computedPromisedDate = order.promisedDateOrigin
      ? order.promisedDate
      : formatDateOnly( groutingDate ? addDays( parseDateOnly( groutingDate ), 2 ) : nextOrSameMonday( parseDateOnly( latestFinish ) ) )

    results.push( {
      orderId: order.id,
      projectedCompletionDate: latestFinish,
      promisedDate: computedPromisedDate,
      promisedDateOrigin: order.promisedDateOrigin ?? 'computed',
      groutingDay: groutingDate ? groutingDaysByDate[groutingDate] : null,
    } )
  }

  return results
}
