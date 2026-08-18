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
import { addDays } from 'date-fns'

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

// CONTEXT.md's Capacity Event: the *only* source of explicit Capacity
// (see docs/adr/0007) - a day nobody assigned a CapacityEvent to is
// simply 0 hours, never a computed default. `capacity` is a JSON array
// of per-day hours with a "last value repeats" shorthand: an array
// shorter than the event's day span holds its last value for every day
// after it runs out (`[8]` across 6 days = 8 hours every day, `[8,1,5]`
// = 8/1/5-then-5-forever). Expands every CapacityEvent's people into
// flat `${userId}:${dateStr}` -> hours (Owners) and `${dateStr}` -> summed
// hours (Assistants, pooled - see consumeOrdinaryCapacity()'s doc
// comment) maps, ready for resolveDailyCapacity()/simulateBacklog().
export function expandCapacityEvents( capacityEvents )
{
  const capacityByUserDate = {}
  const assistantHoursByDate = {}

  for( const event of capacityEvents )
  {
    const days = []

    for( let cursor = parseDateOnly( event.startDate ); cursor <= parseDateOnly( event.endDate ); cursor = addDays( cursor, 1 ) )
      days.push( formatDateOnly( cursor ) )

    for( const person of event.people ?? [] )
    {
      days.forEach( (dateStr, index) => {
        const hours = person.capacity[Math.min( index, person.capacity.length - 1 )] ?? 0

        if( null != person.userId )
          capacityByUserDate[`${person.userId}:${dateStr}`] = hours
        else
          assistantHoursByDate[dateStr] = (assistantHoursByDate[dateStr] ?? 0) + hours
      } )
    }
  }

  return {capacityByUserDate, assistantHoursByDate}
}

export function resolveDailyCapacity( userId, dateStr, capacityByUserDate )
{
  return capacityByUserDate[`${userId}:${dateStr}`] ?? 0
}

// The Capacity calendar's per-person input format: a "+"-separated list
// of terms, each either a bare number (one day at that many hours) or
// "hours*days" (that many hours, repeated for that many days) - e.g.
// "8+1+4" -> [8,1,4], "8*5" -> [8,8,8,8,8], "4+1+2+8*2" -> [4,1,2,8,8].
// This is what actually builds a CapacityEventPerson.capacity array (see
// that model's doc comment for the array's own "last value repeats"
// semantics once it's shorter than the Event's day span). Returns null
// on anything that doesn't parse to at least one valid day, so callers
// can reject the edit instead of silently storing garbage.
export function parseCapacityFormula( text )
{
  const terms = String( text ?? '' ).split( '+' ).map( t => t.trim() )

  if( 0 === terms.length || terms.some( t => '' === t ) )
    return null

  const days = []

  for( const term of terms )
  {
    const parts = term.split( '*' ).map( p => p.trim() )

    if( 1 === parts.length )
    {
      const value = Number( parts[0] )

      if( !Number.isFinite( value ) || value < 0 )
        return null

      days.push( value )
    }
    else if( 2 === parts.length )
    {
      const value = Number( parts[0] )
      const count = Number( parts[1] )

      if( !Number.isFinite( value ) || value < 0 || !Number.isInteger( count ) || count <= 0 )
        return null

      for( let i = 0; i < count; i++ )
        days.push( value )
    }
    else
    {
      return null
    }
  }

  return days
}

export function sumCapacity( days )
{
  return days.reduce( (sum, hours) => sum + hours, 0 )
}

// The inverse of parseCapacityFormula(), for repopulating the edit field
// from a stored array - collapses consecutive equal-value runs into
// "value*count" terms (bare "value" when count is 1), joined by "+".
// Not guaranteed to reproduce the exact text originally typed (e.g.
// "8+8+8" round-trips as "8*3"), only an equivalent formula.
export function formatCapacityFormula( days )
{
  const terms = []
  let i = 0

  while( i < days.length )
  {
    let count = 1

    while( i + count < days.length && days[i + count] === days[i] )
      count++

    terms.push( count > 1 ? `${days[i]}*${count}` : `${days[i]}` )
    i += count
  }

  return terms.join( '+' )
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
// from whichever eligible pool(s) have remaining Capacity that day,
// mutating the shared `remainingCapacityCache` as it goes so later
// pieces/orders in the same simulateBacklog() run see an already-
// depleted pool, not a fresh one. Named Users are Owners only now (see
// OWNER_ONLY_PHASES's comment - assistants are never Users), so the
// eligible-Users filter applies unconditionally, not just for
// Owner-only phases; for non-Owner-only phases (Gluing/Picking), the
// day-walk also draws from a synthetic assistants:${date} pool sourced
// from `ctx.assistantHoursByDate` (assistant CapacityEvent entries'
// per-date sum), cached the same way. Returns the date the phase's
// hours were fully consumed.
function consumeOrdinaryCapacity( hoursNeeded, startDateStr, ownerOnly, ctx )
{
  if( 0 === hoursNeeded )
    return startDateStr

  const eligibleUserIds = ctx.userIds.filter( id => 'owner' === ctx.usersById[id]?.role )

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
        ctx.remainingCapacityCache[key] = resolveDailyCapacity( userId, cursor, ctx.capacityByUserDate )

      const available = ctx.remainingCapacityCache[key]

      if( available <= 0 )
        continue

      const consumed = Math.min( available, remaining )

      ctx.remainingCapacityCache[key] -= consumed
      remaining -= consumed
    }

    if( !ownerOnly && remaining > 0 )
    {
      const assistantKey = `assistants:${cursor}`

      if( !(assistantKey in ctx.remainingCapacityCache) )
        ctx.remainingCapacityCache[assistantKey] = ctx.assistantHoursByDate[cursor] ?? 0

      const availableAssistantHours = ctx.remainingCapacityCache[assistantKey]

      if( availableAssistantHours > 0 )
      {
        const consumed = Math.min( availableAssistantHours, remaining )

        ctx.remainingCapacityCache[assistantKey] -= consumed
        remaining -= consumed
      }
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
export function simulateBacklog( {orders, pieces, productsById, users, capacityEvents, groutingDays, settingsJson, costFactors, overrides, todayStr} )
{
  const usersById = Object.fromEntries( users.map( u => [u.id, u] ) )
  const userIds = users.map( u => u.id )
  const costFactorsByKey = Object.fromEntries( costFactors.map( f => [f.key, f] ) )
  const overrideByFactorId = {}

  for( const o of overrides )
    (overrideByFactorId[o.productId] ??= {})[o.costFactorId] = o

  const {capacityByUserDate, assistantHoursByDate} = expandCapacityEvents( capacityEvents )

  const groutingDaysByDate = Object.fromEntries( groutingDays.map( g => [g.date, g] ) )
  const groutingDaysById = Object.fromEntries( groutingDays.map( g => [g.id, g] ) )
  const reservedGroutingDayDates = groutingDays.map( g => g.date )

  const piecesByOrderId = {}

  for( const piece of pieces )
    (piecesByOrderId[piece.orderId] ??= []).push( piece )

  const ctx = {usersById, userIds, capacityByUserDate, assistantHoursByDate, remainingCapacityCache: {}}

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
          const newGroutingDay = {id: null, date: groutingDate, origin: 'computed'}

          groutingDaysByDate[groutingDate] = newGroutingDay
          reservedGroutingDayDates.push( groutingDate )
        }
      }

      latestFinish = latestFinish < groutingDate ? groutingDate : latestFinish
    }

    const computedPromisedDate = order.promisedDateOrigin
      ? order.promisedDate
      : formatDateOnly( groutingDate ? addDays( parseDateOnly( groutingDate ), 2 ) : nextOrSameMonday( parseDateOnly( latestFinish ) ) )

    // assistantHours is computed here, not stored on GroutingDay itself
    // (see that model's doc comment) - just this date's summed assistant
    // CapacityEvent hours, for display.
    results.push( {
      orderId: order.id,
      projectedCompletionDate: latestFinish,
      promisedDate: computedPromisedDate,
      promisedDateOrigin: order.promisedDateOrigin ?? 'computed',
      groutingDay: groutingDate
        ? {...groutingDaysByDate[groutingDate], assistantHours: assistantHoursByDate[groutingDate] ?? 0}
        : null,
    } )
  }

  return results
}
