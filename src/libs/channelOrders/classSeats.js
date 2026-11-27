import { Op, Sequelize } from 'sequelize'

import BasicEvent from '@/db/models/BasicEvent'
import LiveClass from '@/db/models/LiveClass'
import Location from '@/db/models/Location'
import Address from '@/db/models/Address'

// Class seats sold through a sales channel. Squarespace sells Angie's
// classes as products named
//   "February 27-28  2027 | In-person Mosaic Mirror Class | Seattle, WA"
// (date | title | place), each unit one seat. Such a line isn't a
// Product: it's matched to the Live Class it's for, and accepting its
// Channel Order enrolls the buyer (plus a seat per extra unit) as
// LiveClassAttendees - see accept.js.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Classes are dated by their first occurrence's day in the studio's time
// zone (an evening session in Seattle is the next day in UTC).
const TIME_ZONE = 'America/Los_Angeles'

// "February 27-28  2027", "January 30-31, 2027", "Feb 27 - Mar 1, 2027",
// "March 5, 2027" -> '2027-02-27' (the first day), else null.
export function parseClassDate( text )
{
  const m = (text ?? '').replace( /\s+/g, ' ' ).trim()
    .match( /^([A-Za-z]{3,})\.? (\d{1,2})(?:st|nd|rd|th)?(?: ?[-–] ?(?:[A-Za-z]{3,}\.? )?\d{1,2}(?:st|nd|rd|th)?)?,? (\d{4})$/ )

  const month = m && MONTHS.indexOf( m[1].slice( 0, 3 ).toLowerCase() )

  if( !m || month < 0 || Number( m[2] ) < 1 || Number( m[2] ) > 31 )
    return null

  return `${m[3]}-${String( month + 1 ).padStart( 2, '0' )}-${m[2].padStart( 2, '0' )}`
}

// A channel line's description -> {startDate, title, city} when it's a
// class seat, else null. The description may carry variants after the
// place ("Seattle, WA, Full Amount ($285)"); the city is the place's
// first comma-separated part.
export function classSeat( description )
{
  const parts = (description ?? '').split( '|' ).map( p => p.trim() )

  if( parts.length < 3 || !parts.slice( 1 ).some( p => /\b(class|workshop|retreat)\b/i.test( p ) ) )
    return null

  const startDate = parseClassDate( parts[0] )

  if( !startDate )
    return null

  return {startDate, title: parts.slice( 1, -1 ).join( ' | ' ), city: parts.at( -1 ).split( ',' )[0].trim() || null}
}

// Channel SKUs that are Live Classes' own (LiveClass.sku, e.g.
// "CSMirror-20270227", matched ignoring case) -> Map( lowercased SKU ->
// liveClassId ). A line with one is a seat in that class, whatever its
// description says - surer than matching by date and city.
export async function liveClassIdsBySku( skus, transaction )
{
  const wanted = [...new Set( skus.filter( Boolean ).map( s => s.trim().toLowerCase() ) )]

  if( !wanted.length )
    return new Map()

  const classes = await LiveClass.findAll( {
    where: Sequelize.where( Sequelize.fn( 'LOWER', Sequelize.col( 'sku' ) ), {[Op.in]: wanted} ),
    attributes: ['id', 'sku'],
    transaction,
  } )

  return new Map( classes.map( c => [c.sku.trim().toLowerCase(), c.id] ) )
}

// A UTC instant -> its 'YYYY-MM-DD' in TIME_ZONE
export function localDate( value )
{
  return new Date( value ).toLocaleDateString( 'en-CA', {timeZone: TIME_ZONE} )
}

// The Live Class `seat` is for: the one whose first occurrence falls on
// its start date - narrowed by city when several do. null unless exactly
// one fits.
export async function findLiveClass( seat, transaction )
{
  // A day either side, since stored times are UTC
  const day = new Date( `${seat.startDate}T00:00:00Z` )

  const near = await BasicEvent.findAll( {
    where: {liveClassId: {[Op.ne]: null}, startDatetime: {[Op.between]: [new Date( day - 86400000 ), new Date( +day + 2 * 86400000 )]}},
    attributes: ['liveClassId'],
    transaction,
  } )

  const ids = [...new Set( near.map( e => e.liveClassId ) )]

  if( !ids.length )
    return null

  const classes = await LiveClass.findAll( {where: {id: ids}, include: [{model: BasicEvent, attributes: ['startDatetime']}, {model: Location, include: [Address]}], transaction} )
  const onDay = classes.filter( c => localDate( Math.min( ...c.BasicEvents.map( e => +new Date( e.startDatetime ) ) ) ) === seat.startDate )

  if( onDay.length === 1 )
    return onDay[0].id

  const city = seat.city?.toLowerCase()
  const inCity = city ? onDay.filter( c => `${c.Location?.name ?? ''} ${c.Location?.Address?.city ?? ''} ${c.Location?.Address?.street1 ?? ''}`.toLowerCase().includes( city ) ) : []

  return inCity.length === 1 ? inCity[0].id : null
}

// Live Classes to pick from for a class-seat line: those whose first
// occurrence is no more than `pastDays` ago, soonest first, each with a
// label like "Mirror - Sat, Feb 27, 2027 - Angie's Studio".
export async function liveClassOptions( {pastDays = 60, include = []} = {} )
{
  const since = new Date( Date.now() - pastDays * 86400000 )
  const classes = await LiveClass.findAll( {include: [{model: BasicEvent, attributes: ['startDatetime']}, {model: Location, include: [Address]}]} )

  return classes
    .map( c => ({c, start: c.BasicEvents.length ? Math.min( ...c.BasicEvents.map( e => +new Date( e.startDatetime ) ) ) : null}) )
    .filter( ({c, start}) => include.includes( c.id ) || (start !== null && start >= since) )
    .sort( (a, b) => (a.start ?? 0) - (b.start ?? 0) )
    .map( ({c, start}) => ({id: c.id, label: liveClassLabel( c, start )}) )
}

export function liveClassLabel( liveClass, start )
{
  const when = start === null || start === undefined
    ? 'no date'
    : new Date( start ).toLocaleDateString( 'en-US', {timeZone: TIME_ZONE, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'} )

  return [liveClass.name, when, liveClass.Location?.name].filter( Boolean ).join( ' - ' )
}
