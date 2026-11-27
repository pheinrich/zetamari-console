'use client'

import { useEffect, useMemo, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'


import { toast } from 'react-toastify'

import { createBasicEvent, updateBasicEvent, deleteBasicEvent } from '@/db/actions/basicEvent'
import { useConfirm } from '@/contexts/confirmContext'
import { splitOccurrence, toDatetimes } from '@/utils/occurrences'
import OccurrenceTable from './OccurrenceTable'

// How long typing has to pause before an edit is saved - a date or time
// being typed parses (and changes) at almost every keystroke.
const SAVE_DELAY_MS = 400

// Manages one parent's (Event or LiveClass) BasicEvent occurrences - the
// schedule itself, now that neither parent stores its own startDate/
// endDate (see BasicEvent.js and docs/adr/0008). Exactly one of
// `eventId`/`liveClassId` is passed by the caller. Dates, titles and
// times are edited in place (OccurrenceTable) and saved once typing
// pauses; the new-entry row at the foot adds one, and for a Live Class
// the default 2- and 3-day schedules add a whole class at once. An
// occurrence's color, description and participants are kept as they
// are (the Calendar page edits those).
export default function OccurrenceEditor( {eventId, liveClassId, occurrences, subheader, defaultStartDate} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()
  const timers = useRef( {} )

  const sorted = useMemo( () => [...occurrences].sort( (a, b) => new Date( a.startDatetime ) - new Date( b.startDatetime ) ), [occurrences] )
  const rows = useMemo( () => sorted.map( o => ({key: o.id, ...splitOccurrence( o )}) ), [sorted] )
  const byId = useMemo( () => Object.fromEntries( occurrences.map( o => [o.id, o] ) ), [occurrences] )

  // Pending saves still go through if the page is left
  useEffect( () => () => Object.values( timers.current ).forEach( t => t.flush() ), [] )

  function save( occurrence, changes )
  {
    return updateBasicEvent( {
      id: occurrence.id,
      title: occurrence.title,
      startDatetime: occurrence.startDatetime,
      endDatetime: occurrence.endDatetime,
      color: occurrence.color,
      description: occurrence.description,
      ...changes,
    } )
  }

  // A row's date/title/times, saved SAVE_DELAY_MS after its last change -
  // and not while it's incomplete or ends before it starts.
  function handleRowChange( id, fields )
  {
    clearTimeout( timers.current[id]?.timer )

    const run = async () => {
      delete timers.current[id]

      const datetimes = toDatetimes( fields )

      if( datetimes.error )
        return

      const result = await save( byId[id], {title: fields.title.trim(), ...datetimes} )

      if( result?.error )
        toast.error( result.error )
      else
        router.refresh()
    }

    timers.current[id] = {timer: setTimeout( run, SAVE_DELAY_MS ), flush: () => { clearTimeout( timers.current[id]?.timer ); run() }}
  }

  async function add( fields, color = 'primary' )
  {
    return createBasicEvent( {title: fields.title.trim(), ...toDatetimes( fields ), color, eventId, liveClassId} )
  }

  async function handleAdd( fields )
  {
    const result = await add( fields )

    if( !result?.error )
      router.refresh()

    return result
  }

  async function handleAddMany( drafts )
  {
    for( const draft of drafts )
    {
      const result = await add( draft )

      if( result?.error )
      {
        router.refresh()

        return result
      }
    }

    toast.success( `Added ${drafts.length} occurrences` )
    router.refresh()
  }

  async function handleRemove( id )
  {
    if( !await confirm( 'Remove this occurrence?', {confirmText: 'Remove', destructive: true} ) )
      return

    clearTimeout( timers.current[id]?.timer )
    delete timers.current[id]

    startTransition( async () => {
      await deleteBasicEvent( id )
      router.refresh()
    })
  }

  return (
    <>
      <OccurrenceTable
        subheader={subheader}
        rows={rows}
        disabled={isPending}
        shortcuts={Boolean( liveClassId )}
        defaultStartDate={defaultStartDate}
        onRowChange={handleRowChange}
        onRemove={handleRemove}
        onAdd={handleAdd}
        onAddMany={handleAddMany}
      />

    </>
  )
}
