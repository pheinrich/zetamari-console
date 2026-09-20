'use client'

import { forwardRef, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'react-toastify'

import 'bootstrap-icons/font/bootstrap-icons.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { createBasicEvent, updateBasicEvent, deleteBasicEvent } from '@/db/actions/basicEvent'
import { customerDisplayName } from '../customers/customerFormat'
import AppFullCalendar from '@/libs/styles/AppFullCalendar'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import EventCalendarSidebar from './EventCalendarSidebar'

// The 6 colors AppFullCalendar.js's `.event-bg-*` classes style, doing
// double duty as the "Event Filters" sidebar's calendar categories (see
// EventCalendarSidebar.jsx) - there's no separate category concept,
// BasicEvent.color already is one.
const EVENT_COLORS = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

function toDate( value )
{
  return value ? new Date( value ) : null
}

function blankDraft( date )
{
  const start = date ?? new Date()
  const end = new Date( start.getTime() + 60 * 60 * 1000 )

  return {
    id: null,
    title: '',
    startDatetime: start,
    endDatetime: end,
    color: 'primary',
    description: '',
    participants: [],
    parentLabel: null,
    parentHref: null,
  }
}

function draftFromBasicEvent( event )
{
  const parentLabel = event.Event?.name || event.LiveClass?.name || null
  const parentHref = event.Event ? `/events/${event.Event.id}` : event.LiveClass ? `/live-classes/${event.LiveClass.id}` : null

  return {
    id: event.id,
    title: event.title,
    startDatetime: toDate( event.startDatetime ),
    endDatetime: toDate( event.endDatetime ),
    color: event.color,
    description: event.description || '',
    participants: event.Participants || [],
    parentLabel,
    parentHref,
  }
}

// A plain MUI TextField as react-datepicker's custom input - same
// PickersComponent idiom the reference apps/calendar demo's
// AddEventSidebar.jsx uses, in place of the bare native
// `type="datetime-local"` input this replaces.
const PickersComponent = forwardRef( (props, ref) => (
  <TextField inputRef={ref} fullWidth {...props} label={props.label || ''} />
) )

PickersComponent.displayName = 'PickersComponent'

// The simplified calendar that replaced the Capacity Calendar's
// Owner/Assistant/Grouting machinery (see docs/adr/0008) - laid out like
// the reference apps/calendar demo (mini month view + Event Filters
// sidebar, Month/Week/Day/List view buttons, a react-datepicker-based
// edit drawer) but reading/writing real BasicEvent data via server
// actions instead of the demo's Redux mock store. Events created here
// are always standalone (no eventId/liveClassId) - a show/class
// occurrence is added from that record's own Occurrences editor instead.
export default function EventCalendar( {basicEvents, personOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [draft, setDraft] = useState( null )
  const [calendarApi, setCalendarApi] = useState( null )
  const [leftSidebarOpen, setLeftSidebarOpen] = useState( false )
  const [selectedColors, setSelectedColors] = useState( EVENT_COLORS )
  const calendarRef = useRef()
  const mdAbove = useMediaQuery( theme => theme.breakpoints.up( 'md' ) )

  const handleLeftSidebarToggle = () => setLeftSidebarOpen( open => !open )

  useEffect( () => {
    if( calendarApi === null )
      setCalendarApi( calendarRef.current?.getApi() ?? null )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  function toggleColor( color )
  {
    setSelectedColors( colors => (colors.includes( color ) ? colors.filter( c => c !== color ) : [...colors, color]) )
  }

  function toggleAllColors( checked )
  {
    setSelectedColors( checked ? EVENT_COLORS : [] )
  }

  const fcEvents = useMemo( () => basicEvents
    .filter( e => selectedColors.includes( e.color ) )
    .map( e => ({
      id: String( e.id ),
      title: e.title,
      start: e.startDatetime,
      end: e.endDatetime,
      extendedProps: {color: e.color},
    }) ), [basicEvents, selectedColors] )

  function updateDraft( patch )
  {
    setDraft( d => ({...d, ...patch}) )
  }

  function openAddDrawer( date )
  {
    setDraft( blankDraft( date ) )
    if( !mdAbove )
      setLeftSidebarOpen( false )
  }

  function handleSave()
  {
    startTransition( async () => {
      try
      {
        const payload = {
          id: draft.id,
          title: draft.title,
          startDatetime: draft.startDatetime,
          endDatetime: draft.endDatetime,
          color: draft.color,
          description: draft.description || null,
          participantIds: draft.participants.map( p => p.id ),
        }

        const result = draft.id ? await updateBasicEvent( payload ) : await createBasicEvent( payload )

        if( result?.error )
          toast.error( result.error )
        else
        {
          setDraft( null )
          router.refresh()
        }
      }
      catch( err )
      {
        toast.error( 'Failed to save the event' )
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
        await deleteBasicEvent( draft.id )
        setDraft( null )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete the event' )
      }
    } )
  }

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <EventCalendarSidebar
          mdAbove={mdAbove}
          leftSidebarOpen={leftSidebarOpen}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          calendarApi={calendarApi}
          colorOptions={EVENT_COLORS}
          selectedColors={selectedColors}
          onToggleColor={toggleColor}
          onToggleAllColors={toggleAllColors}
          onAddEvent={() => openAddDrawer( calendarApi?.getDate?.() )}
        />
        <div className='p-5 pbe-0 flex-grow overflow-visible'>
          <FullCalendar
            ref={calendarRef}
            plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView='dayGridMonth'
            headerToolbar={{
              start: 'sidebarToggle, prev, next, title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            }}
            customButtons={{
              sidebarToggle: {
                icon: 'bi bi-list',
                click: handleLeftSidebarToggle,
              },
            }}
            views={{week: {titleFormat: {year: 'numeric', month: 'short', day: 'numeric'}}}}
            dayMaxEvents={3}
            navLinks
            events={fcEvents}
            eventClassNames={arg => [`event-bg-${arg.event.extendedProps.color || 'primary'}`]}
            eventContent={arg => (
              <Tooltip title={arg.event.title} arrow>
                <div className='fc-event-main-frame'>
                  <div className='fc-event-title-container'>
                    <div className='fc-event-title fc-sticky'>{arg.event.title}</div>
                  </div>
                </div>
              </Tooltip>
            )}
            dateClick={info => openAddDrawer( info.date )}
            eventClick={info => {
              const event = basicEvents.find( e => String( e.id ) === info.event.id )

              if( event )
                setDraft( draftFromBasicEvent( event ) )
            }}
          />
        </div>
      </AppFullCalendar>

      <Drawer
        anchor='right'
        open={null !== draft}
        onClose={() => setDraft( null )}
        ModalProps={{keepMounted: true}}
        sx={{'& .MuiDrawer-paper': {inlineSize: ['100%', 400]}}}
      >
        {draft && (
          <>
            <Box className='flex justify-between items-center sidebar-header pli-5 plb-4 border-be'>
              <Typography variant='h5'>{draft.id ? 'Edit Event' : 'New Event'}</Typography>
              <IconButton size='small' onClick={() => setDraft( null )} aria-label='Close'>
                <i className='ri-close-line text-2xl' />
              </IconButton>
            </Box>
            <Box className='sidebar-body plb-5 pli-6 flex flex-col gap-6'>
              {draft.parentLabel && (
                <Typography variant='body2' color='text.secondary'>
                  Occurrence of <Link href={draft.parentHref}>{draft.parentLabel}</Link> - manage its full schedule from there.
                </Typography>
              )}

              <TextField
                label='Title'
                value={draft.title}
                onChange={e => updateDraft( {title: e.target.value} )}
                disabled={isPending}
                fullWidth
                autoFocus
              />

              <AppReactDatepicker
                selectsStart
                id='basic-event-start'
                showTimeSelect
                dateFormat='yyyy-MM-dd hh:mm aa'
                selected={draft.startDatetime}
                startDate={draft.startDatetime}
                endDate={draft.endDatetime}
                disabled={isPending}
                customInput={<PickersComponent label='Start' />}
                onChange={date => date && updateDraft( {
                  startDatetime: date,
                  endDatetime: draft.endDatetime < date ? date : draft.endDatetime,
                } )}
              />

              <AppReactDatepicker
                selectsEnd
                id='basic-event-end'
                showTimeSelect
                dateFormat='yyyy-MM-dd hh:mm aa'
                selected={draft.endDatetime}
                startDate={draft.startDatetime}
                endDate={draft.endDatetime}
                minDate={draft.startDatetime}
                disabled={isPending}
                customInput={<PickersComponent label='End' />}
                onChange={date => date && updateDraft( {endDatetime: date} )}
              />

              <FormControl fullWidth disabled={isPending}>
                <InputLabel id='basic-event-color'>Color</InputLabel>
                <Select
                  labelId='basic-event-color'
                  label='Color'
                  value={draft.color}
                  onChange={e => updateDraft( {color: e.target.value} )}
                >
                  {EVENT_COLORS.map( color => (
                    <MenuItem key={color} value={color}>{color}</MenuItem>
                  ) )}
                </Select>
              </FormControl>

              <TextField
                label='Description'
                value={draft.description}
                onChange={e => updateDraft( {description: e.target.value} )}
                disabled={isPending}
                fullWidth
                multiline
                minRows={3}
              />

              <Autocomplete
                multiple
                options={personOptions}
                value={draft.participants}
                getOptionLabel={option => customerDisplayName( option )}
                getOptionKey={option => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => updateDraft( {participants: value} )}
                renderInput={params => <TextField {...params} label='Participants' placeholder='Add participant' disabled={isPending} />}
              />

              <div className='flex justify-between gap-4'>
                <Button variant='contained' disabled={isPending} onClick={handleSave} fullWidth>
                  {isPending ? 'Saving...' : 'Save'}
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
