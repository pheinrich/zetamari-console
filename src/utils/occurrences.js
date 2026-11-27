import { addDays, format, isValid, parseISO } from 'date-fns'

// An occurrence (BasicEvent) as its editors show it: a date, a title and
// start/end times on that date - 'YYYY-MM-DD' and 'HH:mm' strings, read
// and written in the browser's time zone - rather than the two stored
// datetimes.

// A stored occurrence -> {date, title, startTime, endTime, endDays}.
// `endDays` is how many days after its date it ends - 0 for nearly
// every one, but older all-day entries (and multi-day shows) span
// midnight, and keep doing so when edited.
export function splitOccurrence( {title, startDatetime, endDatetime} )
{
  const start = new Date( startDatetime )
  const end = new Date( endDatetime )
  const date = format( start, 'yyyy-MM-dd' )

  return {
    title: title ?? '',
    date,
    startTime: format( start, 'HH:mm' ),
    endTime: format( end, 'HH:mm' ),
    endDays: Math.round( (parseISO( format( end, 'yyyy-MM-dd' ) ) - parseISO( date )) / 86400000 ),
  }
}

// 'YYYY-MM-DD' + 'HH:mm' -> a Date (local time), or null
export function combine( date, time )
{
  if( !date || !time )
    return null

  const value = parseISO( `${date}T${time}` )

  return isValid( value ) ? value : null
}

// -> {startDatetime, endDatetime} for a complete draft, or {error}
export function toDatetimes( {title, date, startTime, endTime, endDays = 0} )
{
  if( !title?.trim() )
    return {error: 'Each occurrence needs a title'}

  const startDatetime = combine( date, startTime )
  const endDatetime = combine( date && endDays ? format( addDays( parseISO( date ), endDays ), 'yyyy-MM-dd' ) : date, endTime )

  if( !startDatetime || !endDatetime )
    return {error: 'Each occurrence needs a date, a start time and an end time'}

  if( endDatetime < startDatetime )
    return {error: `"${title.trim()}" ends before it starts`}

  return {startDatetime, endDatetime}
}

export const isBlankDraft = d => !d.title?.trim() && !d.date && !d.startTime && !d.endTime

// The usual class schedules: one occurrence per consecutive day.
export const CLASS_TEMPLATES = [
  {
    label: 'Default 2-day',
    days: [
      {title: 'Design/Assemble', startTime: '09:30', endTime: '16:30'},
      {title: 'Grout', startTime: '09:30', endTime: '12:30'},
    ],
  },
  {
    label: 'Default 3-day',
    days: [
      {title: 'Design/Assemble', startTime: '09:30', endTime: '16:30'},
      {title: 'Assemble', startTime: '09:30', endTime: '16:30'},
      {title: 'Grout', startTime: '09:30', endTime: '12:30'},
    ],
  },
]

// A template's occurrences, starting on `startDate` ('YYYY-MM-DD')
export function templateOccurrences( template, startDate )
{
  const first = parseISO( startDate )

  return template.days.map( (day, i) => ({...day, date: format( addDays( first, i ), 'yyyy-MM-dd' )}) )
}
