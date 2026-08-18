'use client'

import { useMemo, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { deleteCapacityEvent, upsertCapacityEvent } from '@/db/actions/capacity'
import { formatCapacityFormula, formatDateOnly, parseCapacityFormula, parseDateOnly, sumCapacity } from '@/libs/pieceScheduling'
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// The 5 colors AppFullCalendar.js's `.event-bg-*` classes actually style
// (see eventClassNames below) - not an arbitrary subset, the full set it
// supports.
const EVENT_COLORS = ['primary', 'success', 'warning', 'error', 'info']

function addDaysToDateStr( dateStr, days )
{
  const date = parseDateOnly( dateStr )

  date.setDate( date.getDate() + days )

  return formatDateOnly( date )
}

function blankDraft( dateStr )
{
  return {id: null, title: '', startDate: dateStr, endDate: dateStr, color: 'primary', notes: '', who: []}
}

function draftFromEvent( event, ownersById )
{
  return {
    id: event.id,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    color: event.color,
    notes: event.notes ?? '',
    who: (event.CapacityEventPeople ?? []).map( p => ({
      userId: p.userId,
      assistantName: p.assistantName,
      displayName: p.userId ? (ownersById[p.userId]?.name ?? `User #${p.userId}`) : p.assistantName,
      capacity: formatCapacityFormula( p.capacity ),
    }) ),
  }
}

// One assigned person's row in the drawer - name, a click-to-edit
// capacity chip, and a remove button. The chip always shows the
// *result* of the stored formula (parseCapacityFormula()/sumCapacity()
// - "8+1+4" -> "13h", "8*5" -> "40h"), not the formula text itself;
// clicking it swaps in a text field pre-filled with the formula so it's
// still the thing being edited. Local `text` only commits back up to
// the drawer's draft on blur/Enter (matching OwnerField's old
// uncontrolled-input convention elsewhere in this file's history), and
// only if it still parses - an invalid edit reverts rather than
// corrupting the draft with something upsertCapacityEvent would only
// reject later anyway.
function PersonRow( {person, onCapacityChange, onRemove, disabled} )
{
  const [editing, setEditing] = useState( false )
  const [text, setText] = useState( person.capacity )

  const parsedDays = parseCapacityFormula( person.capacity )
  const total = parsedDays ? sumCapacity( parsedDays ) : '?'

  function commit()
  {
    if( text.trim() && text !== person.capacity )
    {
      if( parseCapacityFormula( text ) )
        onCapacityChange( text.trim() )
      else
        toast.error( `"${text}" isn't a valid formula - use numbers with "+" and "*", e.g. "8+1+4" or "8*5"` )
    }

    setEditing( false )
  }

  return (
    <div className='flex items-center gap-2'>
      <Typography className='flex-grow'>{person.displayName}</Typography>
      {editing ? (
        <TextField
          size='small'
          autoFocus
          value={text}
          onChange={e => setText( e.target.value )}
          onBlur={commit}
          onKeyDown={e => { if( 'Enter' === e.key ) e.target.blur() }}
          placeholder='8+1+4 or 8*5'
          className='is-32'
        />
      ) : (
        <Chip
          size='small'
          variant='tonal'
          icon={<i className='ri-pencil-line' />}
          label={`${total}h`}
          onClick={disabled ? undefined : () => { setText( person.capacity ); setEditing( true ) }}
          className='cursor-pointer'
          title={`${person.capacity} - click to edit hours`}
        />
      )}
      <IconButton size='small' disabled={disabled} onClick={onRemove} aria-label={`Remove ${person.displayName}`}>
        <i className='ri-close-line' />
      </IconButton>
    </div>
  )
}

export default function CapacityCalendar( {owners, capacityEvents, groutingDays} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [draft, setDraft] = useState( null )
  const [newAssistantName, setNewAssistantName] = useState( '' )
  const [newOwnerId, setNewOwnerId] = useState( '' )

  const ownersById = useMemo( () => Object.fromEntries( owners.map( o => [o.id, o] ) ), [owners] )
  const groutingDayDates = useMemo( () => new Set( groutingDays.map( g => g.date ) ), [groutingDays] )

  const assistantNameSuggestions = useMemo( () => {
    const names = capacityEvents.flatMap( e => (e.CapacityEventPeople ?? []).map( p => p.assistantName ).filter( Boolean ) )

    
return [...new Set( names )].sort()
  }, [capacityEvents] )

  const fcEvents = useMemo( () => capacityEvents.map( e => ({
    id: String( e.id ),
    title: e.title,
    start: e.startDate,
    end: addDaysToDateStr( e.endDate, 1 ), // FullCalendar's allDay `end` is exclusive
    allDay: true,
    extendedProps: {color: e.color},
  }) ), [capacityEvents] )

  const availableOwners = owners.filter( o => !draft?.who.some( w => w.userId === o.id ) )

  function updateDraft( patch )
  {
    setDraft( d => ({...d, ...patch}) )
  }

  function addOwner()
  {
    if( !newOwnerId )
      return

    const owner = ownersById[newOwnerId]

    updateDraft( {who: [...draft.who, {userId: owner.id, assistantName: null, displayName: owner.name, capacity: '8'}]} )
    setNewOwnerId( '' )
  }

  function addAssistant()
  {
    const name = newAssistantName.trim()

    if( !name )
      return

    updateDraft( {who: [...draft.who, {userId: null, assistantName: name, displayName: name, capacity: '8'}]} )
    setNewAssistantName( '' )
  }

  function removePerson( index )
  {
    updateDraft( {who: draft.who.filter( (_, i) => i !== index )} )
  }

  function setPersonCapacity( index, capacity )
  {
    updateDraft( {who: draft.who.map( (w, i) => i === index ? {...w, capacity} : w )} )
  }

  function handleSave()
  {
    startTransition( async () => {
      try
      {
        const result = await upsertCapacityEvent( draft.id, draft )

        if( result?.error )
        {
          toast.error( result.error )
        }
        else
        {
          setDraft( null )
          router.refresh()
        }
      }
      catch( err )
      {
        toast.error( 'Failed to save the Capacity Event' )
      }
    } )
  }

  function handleDelete()
  {
    if( !window.confirm( `Delete "${draft.title}"? This can't be undone.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteCapacityEvent( draft.id )
        setDraft( null )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the Capacity Event' )
      }
    } )
  }

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        {/* AppFullCalendar's root is `display:flex` (built for a sidebar
            layout - see the reference apps/calendar page) - its child
            needs `flex-grow` itself or it shrinks to its content's
            intrinsic width instead of stretching, which is what made
            every day cell collapse to its header-abbreviation width.
            The `p-5`/`pbe-0` padding matters too, not just cosmetically -
            AppFullCalendar.js gives `.fc-view-harness` a matching
            negative margin (`theme.spacing(0, -5.25)`) calibrated to
            exactly cancel this specific padding so the day grid bleeds
            to the card's edge; drop the padding and that same negative
            margin instead pushes the grid past the card's edge, which is
            what made the first column hang off the left. */}
        <div className='p-5 pbe-0 flex-grow overflow-visible'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            headerToolbar={{start: 'prev,next today', center: 'title', end: ''}}
            dayMaxEvents={3}
            events={fcEvents}
            eventClassNames={arg => [`event-bg-${arg.event.extendedProps.color || 'primary'}`]}
            dateClick={info => setDraft( blankDraft( info.dateStr ) )}
            eventClick={info => {
              const event = capacityEvents.find( e => String( e.id ) === info.event.id )

              if( event )
                setDraft( draftFromEvent( event, ownersById ) )
            }}
            dayCellContent={arg => (
              <div className='flex items-center justify-between gap-1 is-full'>
                <span className='fc-daygrid-day-number'>{arg.dayNumberText}</span>
                {groutingDayDates.has( formatDateOnly( arg.date ) ) && (
                  <Chip size='small' color='primary' variant='tonal' label='Grouting' />
                )}
              </div>
            )}
          />
        </div>
      </AppFullCalendar>

      <Drawer
        anchor='right'
        open={null !== draft}
        onClose={() => setDraft( null )}
        ModalProps={{keepMounted: true}}
        sx={{'& .MuiDrawer-paper': {inlineSize: ['100%', 420]}}}
      >
        {draft && (
          <>
            <Box className='flex justify-between items-center sidebar-header pli-5 plb-4 border-be'>
              <Typography variant='h5'>{draft.id ? 'Edit Capacity Event' : 'New Capacity Event'}</Typography>
              <IconButton size='small' onClick={() => setDraft( null )} aria-label='Close'>
                <i className='ri-close-line text-2xl' />
              </IconButton>
            </Box>
            <Box className='sidebar-body plb-5 pli-6 flex flex-col gap-6'>
              <TextField
                label='Title'
                value={draft.title}
                onChange={e => updateDraft( {title: e.target.value} )}
                disabled={isPending}
                fullWidth
                autoFocus
              />

              <div className='flex gap-4'>
                <TextField
                  type='date'
                  label='Start Date'
                  value={draft.startDate}
                  onChange={e => updateDraft( {startDate: e.target.value, endDate: draft.endDate < e.target.value ? e.target.value : draft.endDate} )}
                  disabled={isPending}
                  fullWidth
                  slotProps={{inputLabel: {shrink: true}}}
                />
                <TextField
                  type='date'
                  label='End Date'
                  value={draft.endDate}
                  onChange={e => updateDraft( {endDate: e.target.value} )}
                  disabled={isPending}
                  fullWidth
                  slotProps={{inputLabel: {shrink: true}, htmlInput: {min: draft.startDate}}}
                />
              </div>

              <FormControl fullWidth disabled={isPending}>
                <InputLabel id='capacity-event-color'>Color</InputLabel>
                <Select
                  labelId='capacity-event-color'
                  label='Color'
                  value={draft.color}
                  onChange={e => updateDraft( {color: e.target.value} )}
                >
                  {EVENT_COLORS.map( color => (
                    <MenuItem key={color} value={color}>
                      <div className='flex items-center gap-2'>
                        <Chip size='small' color={color} variant='tonal' label={color} />
                      </div>
                    </MenuItem>
                  ) )}
                </Select>
              </FormControl>

              <Divider />

              <div className='flex flex-col gap-3'>
                <Typography variant='h6'>Who</Typography>
                {draft.who.map( (person, index) => (
                  <PersonRow
                    key={person.userId ?? person.assistantName}
                    person={person}
                    disabled={isPending}
                    onCapacityChange={capacity => setPersonCapacity( index, capacity )}
                    onRemove={() => removePerson( index )}
                  />
                ) )}
                {0 === draft.who.length && <Typography color='text.disabled'>Nobody assigned yet</Typography>}

                <div className='flex items-center gap-2'>
                  <FormControl size='small' className='flex-grow' disabled={isPending || 0 === availableOwners.length}>
                    <InputLabel id='capacity-event-add-owner'>Add Owner</InputLabel>
                    <Select
                      labelId='capacity-event-add-owner'
                      label='Add Owner'
                      value={newOwnerId}
                      onChange={e => setNewOwnerId( e.target.value )}
                    >
                      {availableOwners.map( o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem> )}
                    </Select>
                  </FormControl>
                  <IconButton size='small' disabled={isPending || !newOwnerId} onClick={addOwner} aria-label='Add owner'>
                    <i className='ri-add-line' />
                  </IconButton>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    list='capacity-event-assistant-names'
                    placeholder='Assistant name'
                    value={newAssistantName}
                    onChange={e => setNewAssistantName( e.target.value )}
                    disabled={isPending}
                    className='flex-grow pli-2 plb-2 rounded border border-solid text-sm'
                  />
                  <datalist id='capacity-event-assistant-names'>
                    {assistantNameSuggestions.map( n => <option key={n} value={n} /> )}
                  </datalist>
                  <IconButton size='small' disabled={isPending || !newAssistantName.trim()} onClick={addAssistant} aria-label='Add assistant'>
                    <i className='ri-add-line' />
                  </IconButton>
                </div>
              </div>

              <Divider />

              <TextField
                label='Notes'
                value={draft.notes}
                onChange={e => updateDraft( {notes: e.target.value} )}
                disabled={isPending}
                multiline
                rows={3}
                fullWidth
              />

              <div className='flex items-center gap-4'>
                <Button variant='contained' disabled={isPending} onClick={handleSave}>
                  {draft.id ? 'Save Changes' : 'Create Event'}
                </Button>
                {draft.id && (
                  <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
                    Delete
                  </Button>
                )}
              </div>
            </Box>
          </>
        )}
      </Drawer>
    </Card>
  )
}
