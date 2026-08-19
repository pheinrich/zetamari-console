'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { deleteCapacityEvent, upsertCapacityEvent } from '@/db/actions/capacity'
import { formatCapacityFormula, formatDateOnly, parseCapacityFormula, parseDateOnly, sumCapacity } from '@/libs/pieceScheduling'
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

// The 5 colors AppFullCalendar.js's `.event-bg-*` classes actually style
// (see eventClassNames below) - not an arbitrary subset, the full set it
// supports.
const EVENT_COLORS = ['primary', 'success', 'warning', 'error', 'info']

// Left-panel "Show" toggles. Purely a display filter over data that's
// already been fetched - unchecking a box never refetches or drops
// anything from `capacityEvents`, it just changes what fcEvents/
// dayCellContent choose to render. Persisted client-side only (see
// loadFilters/persistFilters below) since this is "how I like my own
// calendar to look", not data worth a server round-trip.
const FILTERS_STORAGE_KEY = 'capacityCalendarFilters'
const DEFAULT_FILTERS = {owner: true, assistant: true, holidays: true}

function loadFilters()
{
  try
  {
    const stored = JSON.parse( window.localStorage.getItem( FILTERS_STORAGE_KEY ) )

    return stored ? {...DEFAULT_FILTERS, ...stored} : DEFAULT_FILTERS
  }
  catch( err )
  {
    return DEFAULT_FILTERS
  }
}

function addDaysToDateStr( dateStr, days )
{
  const date = parseDateOnly( dateStr )

  date.setDate( date.getDate() + days )

  return formatDateOnly( date )
}

// Whole-calendar-day difference between two "YYYY-MM-DD" strings. Uses
// Date.UTC rather than parseDateOnly()'s local-time Dates so a DST
// transition falling inside the span can't throw the ms-based diff off
// by an hour and round to the wrong day count.
function dateOnlyDiffDays( aStr, bStr )
{
  const [ay, am, ad] = aStr.split( '-' ).map( Number )
  const [by, bm, bd] = bStr.split( '-' ).map( Number )

  return Math.round( (Date.UTC( by, bm - 1, bd ) - Date.UTC( ay, am - 1, ad )) / 86400000 )
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
    <div className='flex items-center gap-2 person-draggable'>
      <i
        className='ri-draggable text-textSecondary person-drag-handle'
        style={{cursor: disabled ? 'default' : 'grab'}}
        aria-label={`Reorder ${person.displayName}`}
      />
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
          color={person.userId ? 'success' : 'info'}
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

  // Left-panel "Show" toggles - starts from DEFAULT_FILTERS (matching
  // server-rendered markup) and hydrates from localStorage right after
  // mount, since `window` isn't available during SSR.
  const [filters, setFilters] = useState( DEFAULT_FILTERS )

  useEffect( () => {
    setFilters( loadFilters() )
  }, [] )

  useEffect( () => {
    try { window.localStorage.setItem( FILTERS_STORAGE_KEY, JSON.stringify( filters ) ) } catch( err ) { /* ignore */ }
  }, [filters] )

  function toggleFilter( key )
  {
    setFilters( f => ({...f, [key]: !f[key]}) )
  }

  // Holiday chips - a purely cosmetic hint (e.g. "don't forget to zero
  // out Christmas") sourced live from Nager.Date, never persisted here.
  // `visibleYears` tracks whatever year(s) the month grid currently
  // shows (usually one, occasionally two around a Dec/Jan boundary);
  // `fetchedYearsRef` remembers which years have already been fetched
  // so paging back to a year already seen doesn't refetch it.
  const [visibleYears, setVisibleYears] = useState( () => [new Date().getFullYear()] )
  const [holidaysByDate, setHolidaysByDate] = useState( {} )
  const fetchedYearsRef = useRef( new Set() )

  useEffect( () => {
    if( !filters.holidays )
      return

    const missingYears = visibleYears.filter( y => !fetchedYearsRef.current.has( y ) )

    if( 0 === missingYears.length )
      return

    missingYears.forEach( y => fetchedYearsRef.current.add( y ) )

    Promise.all( missingYears.map( y =>
      fetch( `https://date.nager.at/api/v3/PublicHolidays/${y}/US` )
        .then( res => res.ok ? res.json() : [] )
        .catch( () => [] )
    ) ).then( results => {
      setHolidaysByDate( prev => {
        const next = {...prev}

        results.flat().forEach( h => { next[h.date] = h.localName ?? h.name } )

        return next
      } )
    } )
  }, [visibleYears, filters.holidays] )

  // Drag-and-drop for the drawer's Who list. `draft.who` stays the
  // single source of truth (it's what handleSave reads); this hook's
  // own `personsList` state just mirrors it for rendering/dragging.
  // The two effects below keep them in sync without ping-ponging:
  // draft.who -> personsList runs whenever draft.who gets a new array
  // reference (add/remove/capacity edit, or a draft swap); personsList
  // -> draft.who only pushes back up when a drag has actually made
  // personsList diverge from draft.who (the sync-down effect assigns
  // the *same* array reference, so it never re-triggers this one).
  const [personsListRef, personsList, setPersonsList] = useDragAndDrop( [], {
    plugins: [animations()],
    dragHandle: '.person-drag-handle',
  } )

  useEffect( () => {
    setPersonsList( draft?.who ?? [] )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.who] )

  useEffect( () => {
    if( draft && personsList !== draft.who )
      updateDraft( {who: personsList} )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personsList] )

  const assistantNameSuggestions = useMemo( () => {
    const names = capacityEvents.flatMap( e => (e.CapacityEventPeople ?? []).map( p => p.assistantName ).filter( Boolean ) )

    
return [...new Set( names )].sort()
  }, [capacityEvents] )

  const fcEvents = useMemo( () => capacityEvents

    // An event with a mix of Owners and Assistants stays visible as
    // long as *either* of its roles is checked - unchecking Assistant
    // Capacity only hides events that are exclusively Assistants, it
    // doesn't touch a mixed event's Owner info.
    .filter( e => {
      const people = e.CapacityEventPeople ?? []
      const hasOwner = people.some( p => null != p.userId )
      const hasAssistant = people.some( p => null == p.userId )

      return (hasOwner && filters.owner) || (hasAssistant && filters.assistant)
    } )
    .map( e => {
      const people = e.CapacityEventPeople ?? []
      const ownerTotal = people.filter( p => null != p.userId ).reduce( (sum, p) => sum + sumCapacity( p.capacity ), 0 )
      const assistantTotal = people.filter( p => null == p.userId ).reduce( (sum, p) => sum + sumCapacity( p.capacity ), 0 )

      return {
        id: String( e.id ),
        title: e.title,
        start: e.startDate,
        end: addDaysToDateStr( e.endDate, 1 ), // FullCalendar's allDay `end` is exclusive
        allDay: true,
        extendedProps: {color: e.color, tooltip: `Capacity: ${ownerTotal + assistantTotal} (${ownerTotal}+${assistantTotal})`},
      }
    } ), [capacityEvents, filters.owner, filters.assistant] )

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

  // Clones the open draft onto the next same-weekday period - a Mon-Wed
  // span lands on the *following* Mon-Wed, not the Thu right after the
  // original ends, so the copy keeps whatever weekly rhythm the
  // original had. Shifts by the smallest whole number of weeks that
  // clears the original span (7 * ceil(spanDays / 7)) rather than a
  // flat 7 days, so spans longer than a week still land clean of the
  // original instead of overlapping it. Clears `id` so Save creates a
  // new CapacityEvent rather than overwriting this one; nothing
  // touches the DB until the user actually hits Save.
  function handleDuplicate()
  {
    const spanDays = dateOnlyDiffDays( draft.startDate, draft.endDate ) + 1
    const shiftDays = 7 * Math.ceil( spanDays / 7 )

    updateDraft( {
      id: null,
      startDate: addDaysToDateStr( draft.startDate, shiftDays ),
      endDate: addDaysToDateStr( draft.endDate, shiftDays ),
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
            layout - see the reference apps/calendar page), which is what
            this "Show" panel rides on - it's a plain flex sibling, not a
            Drawer like the reference apps/calendar page uses, since it
            doesn't need the reference's mobile-collapse/redux plumbing
            for what's currently just 3 checkboxes. Revisit as a Drawer
            if this list keeps growing (Grouting/Promised Dates/Events/
            Classes are on the roadmap - see the grilling session this
            panel came out of). */}
        <div className='is-[220px] flex-shrink-0 plb-5 pli-5 border-ie flex flex-col gap-2'>
          <Typography variant='h6' className='mbe-2'>Show</Typography>
          <FormControlLabel
            label='Owner Capacity'
            control={<Checkbox color='success' checked={filters.owner} onChange={() => toggleFilter( 'owner' )} />}
          />
          <FormControlLabel
            label='Assistant Capacity'
            control={<Checkbox color='info' checked={filters.assistant} onChange={() => toggleFilter( 'assistant' )} />}
          />
          <FormControlLabel
            label='Holidays'
            control={<Checkbox checked={filters.holidays} onChange={() => toggleFilter( 'holidays' )} />}
          />
        </div>

        {/* Its child needs `flex-grow` itself or it shrinks to its
            content's intrinsic width instead of stretching, which is what
            made every day cell collapse to its header-abbreviation width.
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

            // A plain `el.title` set in eventDidMount only fires once per
            // DOM mount, so an event whose hours change after that (edit
            // + Save, no unmount/remount) would keep showing the old
            // total forever. eventContent is a render function FullCalendar
            // re-invokes on every React re-render, so wrapping it in a
            // MUI Tooltip here - reading straight from extendedProps -
            // keeps the tooltip current for free. The inner markup keeps
            // FullCalendar's own class names (fc-event-main-frame etc.)
            // since AppFullCalendar.js's color theming targets them by
            // class, not by DOM structure.
            eventContent={arg => (
              <Tooltip title={arg.event.extendedProps.tooltip} arrow>
                <div className='fc-event-main-frame'>
                  <div className='fc-event-title-container'>
                    <div className='fc-event-title fc-sticky'>{arg.event.title}</div>
                  </div>
                </div>
              </Tooltip>
            )}
            dateClick={info => setDraft( blankDraft( info.dateStr ) )}
            eventClick={info => {
              const event = capacityEvents.find( e => String( e.id ) === info.event.id )

              if( event )
                setDraft( draftFromEvent( event, ownersById ) )
            }}

            // Tracks which calendar year(s) the visible month grid spans
            // (2 around a Dec/Jan boundary) so the Holiday-fetching effect
            // above knows what to fetch as the user pages between months.
            datesSet={arg => {
              const startYear = arg.start.getFullYear()
              const endYear = new Date( arg.end.getTime() - 1 ).getFullYear() // end is exclusive
              const years = startYear === endYear ? [startYear] : [startYear, endYear]

              setVisibleYears( prev => (prev.length === years.length && prev.every( (y, i) => y === years[i] )) ? prev : years )
            }}
            dayCellContent={arg => {
              const dateStr = formatDateOnly( arg.date )

              return (
                <div className='flex items-center justify-between gap-1 is-full'>
                  <span className='fc-daygrid-day-number'>{arg.dayNumberText}</span>
                  <div className='flex items-center gap-1'>
                    {groutingDayDates.has( dateStr ) && (
                      <Chip size='small' color='primary' variant='tonal' label='Grouting' />
                    )}
                    {filters.holidays && holidaysByDate[dateStr] && (
                      <Chip size='small' color='secondary' variant='tonal' label={holidaysByDate[dateStr]} />
                    )}
                  </div>
                </div>
              )
            }}
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
                <div ref={personsListRef} className='flex flex-col gap-3'>
                  {personsList.map( (person, index) => (
                    <PersonRow
                      key={person.userId ?? person.assistantName}
                      person={person}
                      disabled={isPending}
                      onCapacityChange={capacity => setPersonCapacity( index, capacity )}
                      onRemove={() => removePerson( index )}
                    />
                  ) )}
                </div>
                {0 === personsList.length && <Typography color='text.disabled'>Nobody assigned yet</Typography>}

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
                  <Button variant='outlined' disabled={isPending} onClick={handleDuplicate}>
                    Duplicate
                  </Button>
                )}
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
