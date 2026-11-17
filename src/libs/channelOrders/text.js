// Small text helpers shared by the per-channel order email parsers.
// Kept free of '@/' imports (like the parsers themselves) so they can be
// exercised directly with plain `node` against saved .eml fixtures, not
// only from inside Next.

// Marketplace emails pad preheader text with zero-width joiners/
// combining grapheme joiners/nbsp to stop mail clients previewing body
// text - collapse those along with ordinary whitespace.
const JUNK_WHITESPACE = /[\s͏​‌‍﻿\xa0]+/g

export function clean( text )
{
  return (text ?? '').replace( JUNK_WHITESPACE, ' ' ).trim()
}

// "$4,315.00" / "($86.04)" / "2.00" -> Number, or null when there's
// nothing numeric to read. Parenthesized amounts are negative, the way
// Houzz/Faire show commission deductions.
export function money( text )
{
  const s = clean( text )
  const digits = s.replace( /[^0-9.]/g, '' )

  if( !digits )
    return null

  const n = Number( digits )

  if( Number.isNaN( n ) )
    return null

  return /^\(.*\)$/.test( s ) || s.startsWith( '-' ) ? -n : n
}

const MONTHS = {jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12}

// "11/14/2026", "Jul 28, 2026", "September 18, 2026" or "2026-11-13
// 16:48:36.0" -> "2026-11-14" (DATEONLY), built by hand rather than
// through Date so no timezone can shift the day.
export function dateOnly( text )
{
  const s = clean( text )
  let y, m, d

  let match = s.match( /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/ )

  if( match )
    [, m, d, y] = match.map( Number )
  else if( (match = s.match( /^(\d{4})-(\d{2})-(\d{2})\b/ )) )
    [, y, m, d] = match.map( Number )
  else if( (match = s.match( /^([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4})$/ )) )
  {
    m = MONTHS[match[1].toLowerCase()]
    d = Number( match[2] )
    y = Number( match[3] )
  }

  if( !y || !m || !d )
    return null

  return `${y}-${String( m ).padStart( 2, '0' )}-${String( d ).padStart( 2, '0' )}`
}

// The shop's calendar day (Pacific) for an instant - for emails whose
// only order date is when they were sent (an evening order in Seattle is
// already the next day in UTC).
export function pacificDate( date )
{
  if( !date || Number.isNaN( new Date( date ).getTime() ) )
    return null

  return new Intl.DateTimeFormat( 'en-CA', {timeZone: 'America/Los_Angeles'} ).format( new Date( date ) )
}

// "Springfield, IL 62701" (or Squarespace's "Springfield, IL, 62701") ->
// {city, state, postalCode}, or null if the line doesn't look like a US
// city/state/ZIP line.
export function cityStateZip( text )
{
  const match = clean( text ).match( /^(.+?),\s*([A-Za-z]{2}),?\s+(\d{5}(?:-\d{4})?)$/ )

  return match ? {city: match[1], state: match[2].toUpperCase(), postalCode: match[3]} : null
}

// Phone fields arrive as junk like "0--" when the buyer left them
// blank - only keep values with enough digits to be a real number.
export function phone( text )
{
  const s = clean( text )

  return s.replace( /\D/g, '' ).length >= 7 ? s : null
}
