'use client'

import { forwardRef, useState, useTransition } from 'react'
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

import { createBasicEvent, updateBasicEvent, deleteBasicEvent } from '@/db/actions/basicEvent'
import { customerDisplayName } from '../customers/customerFormat'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import tableStyles from '@core/styles/table.module.css'

const COLOR_OPTIONS = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

// Sequelize DATE columns round-trip as ISO strings once they've been
// through toJSON() - react-datepicker wants a real Date instead.
function toDate( value )
{
  return value ? new Date( value ) : null
}

// Same PickersComponent idiom as EventCalendar.jsx - a plain MUI
// TextField as react-datepicker's custom input, in place of the bare
// `type="datetime-local"` native control this replaced (no year visible
// once the table column narrows it, and a different look/feel than the
// Calendar page's own start/end pickers).
const PickersComponent = forwardRef( (props, ref) => (
  <TextField inputRef={ref} size='small' {...props} label={props.label || ''} />
) )

PickersComponent.displayName = 'PickersComponent'

// Manages one parent's (Event or LiveClass) BasicEvent occurrences - the
// schedule itself, now that neither parent stores its own startDate/
// endDate (see BasicEvent.js and docs/adr/0008). Exactly one of
// `eventId`/`liveClassId` is passed by the caller. Same "separate
// mini-CRUD table + add row below" idiom as LiveClassAttendeeEditor.jsx/
// CustomerSourceEditor.jsx.
export default function OccurrenceEditor( {eventId, liveClassId, occurrences, personOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState( '' )
  const [startDatetime, setStartDatetime] = useState( null )
  const [endDatetime, setEndDatetime] = useState( null )
  const [color, setColor] = useState( 'primary' )
  const [error, setError] = useState( null )

  // Description/Participants editing - a Dialog rather than inline
  // cells, same reasoning as LiveClassAttendeeEditor.jsx's Notes dialog
  // (free text) plus a multi-select that wouldn't fit a table cell.
  const [editing, setEditing] = useState( null )
  const [descriptionDraft, setDescriptionDraft] = useState( '' )
  const [participantsDraft, setParticipantsDraft] = useState( [] )

  function handleAdd()
  {
    setError( null )
    startTransition( async () => {
      const result = await createBasicEvent( {
        title,
        startDatetime,
        endDatetime,
        color,
        eventId,
        liveClassId,
      } )

      if( result?.error )
        setError( result.error )
      else
      {
        setTitle( '' )
        setStartDatetime( null )
        setEndDatetime( null )
        setColor( 'primary' )
        router.refresh()
      }
    })
  }

  function handleFieldChange( occurrence, field, value )
  {
    if( !value )
      return

    startTransition( async () => {
      await updateBasicEvent( {
        id: occurrence.id,
        title: occurrence.title,
        startDatetime: occurrence.startDatetime,
        endDatetime: occurrence.endDatetime,
        color: occurrence.color,
        description: occurrence.description,
        [field]: value,
      } )
      router.refresh()
    })
  }

  function handleRemove( id )
  {
    if( !confirm( 'Remove this occurrence?' ) )
      return

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
        color: editing.color,
        description: descriptionDraft || null,
        participantIds: participantsDraft.map( p => p.id ),
      } )
      closeEditDialog()
      router.refresh()
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Color</th>
              <th>Participants</th>
              <th>Details</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {occurrences.map( occurrence => (
              <tr key={occurrence.id}>
                <td>
                  <TextField
                    size='small'
                    defaultValue={occurrence.title}
                    disabled={isPending}
                    onBlur={e => handleFieldChange( occurrence, 'title', e.target.value )}
                  />
                </td>
                <td>
                  <AppReactDatepicker
                    showTimeSelect
                    dateFormat='yyyy-MM-dd hh:mm aa'
                    selected={toDate( occurrence.startDatetime )}
                    disabled={isPending}
                    customInput={<PickersComponent />}
                    onChange={date => date && handleFieldChange( occurrence, 'startDatetime', date )}
                  />
                </td>
                <td>
                  <AppReactDatepicker
                    showTimeSelect
                    dateFormat='yyyy-MM-dd hh:mm aa'
                    selected={toDate( occurrence.endDatetime )}
                    disabled={isPending}
                    customInput={<PickersComponent />}
                    onChange={date => date && handleFieldChange( occurrence, 'endDatetime', date )}
                  />
                </td>
                <td>
                  <FormControl size='small' className='min-is-[120px]'>
                    <Select
                      value={occurrence.color}
                      disabled={isPending}
                      onChange={e => handleFieldChange( occurrence, 'color', e.target.value )}
                    >
                      {COLOR_OPTIONS.map( option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ) )}
                    </Select>
                  </FormControl>
                </td>
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
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( occurrence.id )}>
                    <i className='ri-delete-bin-7-line' />
                  </IconButton>
                </td>
              </tr>
            ) )}
            {0 === occurrences.length && (
              <tr><td colSpan={7}>No occurrences added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <TextField size='small' label='Title' value={title} onChange={e => setTitle( e.target.value )} />
        <AppReactDatepicker
          selectsStart
          showTimeSelect
          dateFormat='yyyy-MM-dd hh:mm aa'
          selected={startDatetime}
          startDate={startDatetime}
          endDate={endDatetime}
          customInput={<PickersComponent label='Start' />}
          onChange={date => setStartDatetime( date )}
        />
        <AppReactDatepicker
          selectsEnd
          showTimeSelect
          dateFormat='yyyy-MM-dd hh:mm aa'
          selected={endDatetime}
          startDate={startDatetime}
          endDate={endDatetime}
          minDate={startDatetime}
          customInput={<PickersComponent label='End' />}
          onChange={date => setEndDatetime( date )}
        />
        <FormControl size='small' className='min-is-[120px]'>
          <InputLabel id='occurrence-color-select'>Color</InputLabel>
          <Select
            labelId='occurrence-color-select'
            label='Color'
            value={color}
            onChange={e => setColor( e.target.value )}
          >
            {COLOR_OPTIONS.map( option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ) )}
          </Select>
        </FormControl>
        <Button variant='outlined' disabled={isPending} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <Typography color='error' variant='body2'>{error}</Typography>}

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
    </div>
  )
}
