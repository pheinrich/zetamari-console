'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { addCustomerSource, removeCustomerSource } from '@/db/actions/customer'
import { SOURCE_TYPE_META, sourceTypeLabel, sourceTypeUsesEvent } from '../sourceTypeMeta'
import tableStyles from '@core/styles/table.module.css'

// Manages a customer's CustomerSource rows - the multi-source attribution
// Angie asked for (a record may come from her website, her accounting
// software, a conference, etc., sometimes more than one at once). Kept as
// its own mini-CRUD, added from the detail page once a Customer already
// exists - same "separate from the main form submit" approach as
// products/BomEditor.jsx.
export default function CustomerSourceEditor( {customerId, sources, eventOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sourceType, setSourceType] = useState( 'website' )
  const [sourceName, setSourceName] = useState( '' )
  const [eventId, setEventId] = useState( '' )
  const [externalId, setExternalId] = useState( '' )
  const [notes, setNotes] = useState( '' )
  const [error, setError] = useState( null )

  const usesEvent = sourceTypeUsesEvent( sourceType )
  const relevantEvents = eventOptions.filter( e => e.type === sourceType )

  function handleAdd()
  {
    setError( null )
    startTransition( async () => {
      const result = await addCustomerSource( customerId, {
        sourceType,
        sourceName: sourceName || null,
        eventId: usesEvent && eventId ? Number( eventId ) : null,
        externalId: externalId || null,
        notes: notes || null,
      } )

      if( result?.error )
        setError( result.error )
      else
      {
        setSourceName( '' )
        setEventId( '' )
        setExternalId( '' )
        setNotes( '' )
        router.refresh()
      }
    })
  }

  function handleRemove( id )
  {
    if( !confirm( 'Remove this source?' ) )
      return

    startTransition( async () => {
      await removeCustomerSource( id )
      router.refresh()
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Event</th>
              <th>First Seen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sources.map( source => (
              <tr key={source.id}>
                <td>{sourceTypeLabel( source.sourceType )}</td>
                <td>{source.sourceName || '—'}</td>
                <td>
                  {source.Event ? (
                    <Typography variant='body2'>{source.Event.name}</Typography>
                  ) : '—'}
                </td>
                <td>{source.firstSeenOn || '—'}</td>
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( source.id )}>
                    <i className='ri-delete-bin-7-line' />
                  </IconButton>
                </td>
              </tr>
            ) )}
            {0 === sources.length && (
              <tr><td colSpan={5}>No sources recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <FormControl size='small' className='min-is-[180px]'>
          <InputLabel id='source-type-select'>Source Type</InputLabel>
          <Select
            labelId='source-type-select'
            label='Source Type'
            value={sourceType}
            onChange={e => { setSourceType( e.target.value ); setEventId( '' ) }}
          >
            {Object.entries( SOURCE_TYPE_META ).map( ([value, meta]) => (
              <MenuItem key={value} value={value}>{meta.label}</MenuItem>
            ) )}
          </Select>
        </FormControl>
        <TextField
          size='small'
          label='Source Name'
          placeholder={SOURCE_TYPE_META[sourceType]?.examples}
          value={sourceName}
          onChange={e => setSourceName( e.target.value )}
        />
        {usesEvent && (
          <FormControl size='small' className='min-is-[200px]'>
            <InputLabel id='source-event-select'>Event</InputLabel>
            <Select
              labelId='source-event-select'
              label='Event'
              displayEmpty
              value={eventId}
              onChange={e => setEventId( e.target.value )}
            >
              <MenuItem value=''>None</MenuItem>
              {relevantEvents.map( event => (
                <MenuItem key={event.id} value={event.id}>{event.name}</MenuItem>
              ) )}
            </Select>
          </FormControl>
        )}
        <TextField
          size='small'
          label='External ID'
          value={externalId}
          onChange={e => setExternalId( e.target.value )}
        />
        <TextField
          size='small'
          label='Notes'
          value={notes}
          onChange={e => setNotes( e.target.value )}
        />
        <Button variant='outlined' disabled={isPending} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {usesEvent && 0 === relevantEvents.length && (
        <Typography variant='body2' color='text.secondary'>
          No {sourceTypeLabel( sourceType ).toLowerCase()} events yet - <Link href='/events/new'>add one</Link> to link it here.
        </Typography>
      )}
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
    </div>
  )
}
