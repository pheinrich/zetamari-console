// Ship dates, shared by server and browser. An Order ships on its
// Promised Date when it has one; otherwise by default 3 business days
// (Mon-Fri, holidays not counted) after it was ordered - see CONTEXT.md's
// Promised Date entry. The default is derived, never stored, so a blank
// Promised Date stays free for a future scheduling engine to compute.

export const DEFAULT_SHIP_BUSINESS_DAYS = 3

const iso = date => `${date.getFullYear()}-${String( date.getMonth() + 1 ).padStart( 2, '0' )}-${String( date.getDate() ).padStart( 2, '0' )}`

// 'YYYY-MM-DD' (or a Date) plus n business days -> 'YYYY-MM-DD'. A
// weekend start counts from the following Monday, so Saturday + 3 is
// Wednesday, same as Friday + 3.
export function addBusinessDays( start, n )
{
  if( !start )
    return null

  const date = typeof start === 'string' ? new Date( `${start.slice( 0, 10 )}T00:00:00` ) : new Date( start )

  if( Number.isNaN( date.getTime() ) )
    return null

  let left = n

  while( left > 0 )
  {
    date.setDate( date.getDate() + 1 )

    if( date.getDay() !== 0 && date.getDay() !== 6 )
      left--
  }

  return iso( date )
}

export function defaultShipDate( orderedOn )
{
  return addBusinessDays( orderedOn, DEFAULT_SHIP_BUSINESS_DAYS )
}

// An Order's ship date and where it came from: its Promised Date
// ('explicit' or 'computed', as stored), else the default ('default').
export function orderShipDate( order )
{
  if( order?.promisedDate )
    return {date: order.promisedDate, origin: order.promisedDateOrigin ?? 'explicit'}

  const date = defaultShipDate( order?.createdOn )

  return date ? {date, origin: 'default'} : {date: null, origin: null}
}

// The channel's free-text ship-by ("May 20", "2026-12-01", "ASAP") as a
// date, if it is one - a year-less date is taken as the next one on or
// after the order date.
export function parseRequestedDate( text, orderedOn )
{
  if( !text )
    return null

  if( /^\d{4}-\d{2}-\d{2}/.test( text ) )
    return text.slice( 0, 10 )

  if( !/[a-z]{3}/i.test( text ) || !/\d/.test( text ) )
    return null

  const base = orderedOn ? new Date( `${orderedOn}T00:00:00` ) : new Date()
  const hasYear = /\b\d{4}\b/.test( text )
  let date = new Date( hasYear ? text : `${text} ${base.getFullYear()}` )

  if( Number.isNaN( date.getTime() ) )
    return null

  if( !hasYear && date < base )
    date = new Date( date.setFullYear( date.getFullYear() + 1 ) )

  return iso( date )
}

// When a Channel Order should ship: the date the channel asked for, if
// it gave one ("May 20"), else the default ("ASAP" and no date alike).
export function channelOrderShipDate( channelOrder )
{
  const requested = parseRequestedDate( channelOrder?.requestedShipDate, channelOrder?.orderedOn )

  if( requested )
    return {date: requested, origin: 'requested'}

  const date = defaultShipDate( channelOrder?.orderedOn )

  return date ? {date, origin: 'default'} : {date: null, origin: null}
}
