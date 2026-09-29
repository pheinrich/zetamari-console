// Shared helpers for anything displaying a summary of one or more
// BasicEvent occurrences (Event/LiveClass list pages, detail pages) -
// see BasicEvent.js's doc comment and docs/adr/0008. A parent's
// "schedule" is now derived from its occurrences rather than stored as
// its own startDate/endDate columns.

// Callers pass either plain BasicEvent JSON (startDatetime as an ISO
// string, e.g. detail pages reading an already-toJSON()'d parent) or raw
// Sequelize instances (e.g. readLiveClasses()/readEvents(), which compute
// this before calling the parent's own toJSON()) - for a Sequelize
// instance, `startDatetime` is a live Date object, and `String(date)`
// gives its default toString() ("Sat Nov 07 2009 00:00:00 GMT...") rather
// than an ISO string, silently dropping the year once sliced. Routing
// both shapes through `new Date()` first normalizes either input to a
// real Date before formatting, so this can't happen regardless of which
// shape a caller hands in.
function toIsoDate( value )
{
  return new Date( value ).toISOString().slice( 0, 10 )
}

// The earliest start / latest end across a parent's BasicEvent rows, as
// plain 'YYYY-MM-DD' date-only strings (dropping the time-of-day, which
// list views don't show) - null/null if there are no occurrences yet.
export function occurrenceDateRange( basicEvents )
{
  if( !basicEvents?.length )
    return {startDate: null, endDate: null}

  const starts = basicEvents.map( e => toIsoDate( e.startDatetime ) )
  const ends = basicEvents.map( e => toIsoDate( e.endDatetime ) )

  return {
    startDate: starts.reduce( (min, d) => (d < min ? d : min) ),
    endDate: ends.reduce( (max, d) => (d > max ? d : max) ),
  }
}

// A single display string for that range - 'Jan 1' or 'Jan 1 – Jan 3'
// (falls back to the raw ISO date if it can't be parsed, and to an
// em-dash placeholder if there are no occurrences at all).
export function formatOccurrenceRange( basicEvents )
{
  const {startDate, endDate} = occurrenceDateRange( basicEvents )

  if( !startDate )
    return '—'

  return startDate === endDate ? startDate : `${startDate} – ${endDate}`
}
