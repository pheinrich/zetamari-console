'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { toast } from 'react-toastify'

import { createBasicEvent, updateBasicEvent, deleteBasicEvent } from '@/db/actions/basicEvent'
import { customerDisplayName } from '../customers/customerFormat'
import { useConfirm } from '@/contexts/confirmContext'
import { splitOccurrence, toDatetimes } from '@/utils/occurrences'
import OccurrenceTable from './OccurrenceTable'

const COLOR_OPTIONS = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

// How long typing has to pause before an edit is saved - a date or time
// being typed parses (and changes) at almost every keystroke.
const SAVE_DELAY_MS = 400

// Manages one parent's (Event or LiveClass) BasicEvent occurrences - the
// schedule itself, now that neither parent stores its own startDate/
// endDate (see BasicEvent.js and docs/adr/0008). Exactly one of
// `eventId`/`liveClassId` is passed by the caller. Dates, titles and
// times are edited in place (OccurrenceTable) and saved once typing
// pauses; the new-entry row at the foot adds one, and for a Live Class
// the default 2- and 3-day schedules add a whole class at once.
export default function OccurrenceEditor( {eventId, liveClassId, occurrences, personOptions, subheader} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()
  const timers = useRef( {} )

  // Description/Participants/Color editing - a Dialog rather than inline
  // cells, same reasoning as LiveClassAttendeeEditor.jsx's Notes dialog
  // (free text) plus a multi-select that wouldn't fit a table cell.
  const [editing, setEditing] = useState( null )
  const [descriptionDraft, setDescriptionDraft] = useState( '' )
  const [participantsDraft, setParticipantsDraft] = useState( [] )
  const [colorDraft, setColorDraft] = useState( 'primary' )

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

  function openEditDialog( occurrence )
  {
    setEditing( occurrence )
    setDescriptionDraft( occurrence.description || '' )
    setParticipantsDraft( occurrence.Participants || [] )
    setColorDraft( occurrence.color || 'primary' )
  }

  function closeEditDialog()
  {
    setEditing( null )
  }

  function handleSaveEdit()
  {
    startTransition( async () => {
      await updateBasicEvent( {
        id: editing.id,
        title: editing.title,
        startDatetime: editing.startDatetime,
        endDatetime: editing.endDatetime,
        color: colorDraft,
        description: descriptionDraft || null,
        participantIds: participantsDraft.map( p => p.id ),
      } )
      closeEditDialog()
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
        onRowChange={handleRowChange}
        onRemove={handleRemove}
        onAdd={handleAdd}
        onAddMany={handleAddMany}
        extraColumns={['Participants', 'Details']}
        renderExtra={row => {
          const occurrence = byId[row.key]

          return (
            <>
              <td>
                <div className='flex flex-wrap gap-1'>
                  {(occurrence.Participants || []).length === 0
                    ? <Typography color='text.secondary'>—</Typography>
                    : occurrence.Participants.map( p => (
                      <Chip key={p.id} label={customerDisplayName( p )} size='small' variant='tonal' />
                    ) )}
                </div>
              </td>
              <td>
                <IconButton size='small' disabled={isPending} onClick={() => openEditDialog( occurrence )}>
                  <i className={occurrence.description ? 'ri-file-text-fill' : 'ri-file-text-line'} />
                </IconButton>
              </td>
            </>
          )
        }}
      />

      <Dialog open={Boolean( editing )} onClose={closeEditDialog} fullWidth maxWidth='sm'>
        <DialogTitle>
          Occurrence Details
          {editing && <Typography variant='body2' color='text.secondary'>{editing.title}</Typography>}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={4} className='mbs-1'>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label='Description'
              value={descriptionDraft}
              onChange={e => setDescriptionDraft( e.target.value )}
            />
            <FormControl fullWidth>
              <InputLabel id='occurrence-color-select'>Color</InputLabel>
              <Select labelId='occurrence-color-select' label='Color' value={colorDraft} onChange={e => setColorDraft( e.target.value )}>
                {COLOR_OPTIONS.map( option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ) )}
              </Select>
            </FormControl>
            <Autocomplete
              multiple
              options={personOptions}
              value={participantsDraft}
              getOptionLabel={option => customerDisplayName( option )}
              getOptionKey={option => option.id}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => setParticipantsDraft( value )}
              renderInput={params => <TextField {...params} label='Participants' placeholder='Add participant' />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color='secondary'>Cancel</Button>
          <Button variant='contained' disabled={isPending} onClick={handleSaveEdit}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
