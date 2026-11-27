'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { format, isValid, parse } from 'date-fns'

import tableStyles from '@core/styles/table.module.css'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DateField from '@/components/DateField'
import TimeField from '@/components/TimeField'
import { CLASS_TEMPLATES, isBlankDraft, templateOccurrences, toDatetimes } from '@/utils/occurrences'

const BLANK = {date: '', title: '', startTime: '', endTime: ''}

// The Date | Title | Start | End table shared by the occurrence editors -
// OccurrenceEditor (saved occurrences of an Event or Live Class) and the
// Create Live Class form (occurrences kept until the class is created).
// Each row is {key, date, title, startTime, endTime, endDays} (see
// utils/occurrences.js), edited in place: every change goes to
// onRowChange( key, fields ) - the caller decides when to save. A new-
// entry row is always at the foot: onAdd( fields ) -> {error} or nothing,
// cleared when it succeeds. `extraColumns` adds headers, with
// renderExtra( row ) giving that row's cells.
//
// onDraftChange( fields ), when given, hears what's typed in the new-
// entry row (a form can then keep a complete one that wasn't added).
//
// Renders the inside of its Card: a header (`title`, `subheader`) and
// the table beneath. With `shortcuts`, "Default 2-day"/"Default 3-day" -
// at the header's right - ask for a start date and hand the usual class
// days (CLASS_TEMPLATES) to onAddMany( drafts ); `defaultStartDate`
// ('YYYY-MM-DD', e.g. from the class's SKU) prefills that date.
export default function OccurrenceTable( {title = 'Occurrences', subheader, rows, onRowChange, onRemove, onAdd, onAddMany, onDraftChange, shortcuts = false, defaultStartDate, children, disabled, extraColumns = [], renderExtra} )
{
  const [addKey, setAddKey] = useState( 0 )   // bumped to reset the add row after each add
  const [error, setError] = useState( null )

  async function add( draft )
  {
    const problem = toDatetimes( draft ).error

    if( problem )
      return setError( problem )

    const result = await onAdd( draft )

    if( result?.error )
      return setError( result.error )

    setError( null )
    setAddKey( k => k + 1 )
    onDraftChange?.( BLANK )
  }

  return (
    <>
    <CardHeader
      title={title}
      subheader={subheader}
      action={shortcuts && (
        <div className='flex flex-wrap items-center justify-end gap-3'>
          {CLASS_TEMPLATES.map( template => (
            <TemplateButton key={template.label} template={template} defaultStartDate={defaultStartDate} disabled={disabled} onPick={async drafts => {
              const result = await onAddMany( drafts )

              setError( result?.error ?? null )
            }} />
          ) )}
        </div>
      )}
    />
    <CardContent className='flex flex-col gap-4'>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              {extraColumns.map( c => <th key={c}>{c}</th> )}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map( row => (
              <OccurrenceRow
                key={row.key}
                row={row}
                disabled={disabled}
                onChange={fields => onRowChange( row.key, fields )}
                onRemove={() => onRemove( row.key )}
                extra={renderExtra?.( row )}
              />
            ) )}
            <AddRow key={addKey} disabled={disabled} autoFocus={addKey > 0} extraCount={extraColumns.length} onAdd={add} onChange={onDraftChange} />
          </tbody>
        </table>
      </div>
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
      {children}
    </CardContent>
    </>
  )
}

function Fields( {fields, set, disabled, autoFocus, endDays} )
{
  return (
    <>
      <td>
        <DateField size='small' value={fields.date} disabled={disabled} onChange={date => set( {date} )} boxProps={{className: 'is-36'}} />
      </td>
      <td>
        <TextField size='small' value={fields.title} disabled={disabled} autoFocus={autoFocus} placeholder='Title' onChange={e => set( {title: e.target.value} )} className='min-is-[140px]' />
      </td>
      <td>
        <TimeField size='small' value={fields.startTime} disabled={disabled} onChange={startTime => set( {startTime} )} boxProps={{className: 'is-32'}} />
      </td>
      <td>
        <div className='flex items-center gap-1'>
          <TimeField size='small' placeholder='4:30 PM' value={fields.endTime} disabled={disabled} onChange={endTime => set( {endTime} )} boxProps={{className: 'is-32'}} />
          {endDays > 0 && (
            <Tooltip title={`Ends ${endDays} day${endDays === 1 ? '' : 's'} after it starts`}>
              <Typography variant='body2' color='text.secondary'>+{endDays}d</Typography>
            </Tooltip>
          )}
        </div>
      </td>
    </>
  )
}

// A saved (or kept) occurrence. Holds what's typed itself, so a caller
// that saves after a pause doesn't reset the fields mid-edit.
function OccurrenceRow( {row, disabled, onChange, onRemove, extra} )
{
  const [fields, setFields] = useState( row )

  function set( patch )
  {
    const next = {...fields, ...patch}

    setFields( next )
    onChange( next )
  }

  return (
    <tr>
      <Fields fields={fields} set={set} disabled={disabled} endDays={row.endDays} />
      {extra}
      <td>
        <IconButton size='small' disabled={disabled} onClick={onRemove} aria-label='Remove occurrence'>
          <i className='ri-delete-bin-7-line' />
        </IconButton>
      </td>
    </tr>
  )
}

// Always at the foot of the table; cleared after each add (by its parent
// remounting it), and focused again then - but not on page load.
function AddRow( {disabled, autoFocus, extraCount, onAdd, onChange} )
{
  const [fields, setFields] = useState( BLANK )

  function set( patch )
  {
    const next = {...fields, ...patch}

    setFields( next )
    onChange?.( next )
  }

  return (
    <tr>
      <Fields fields={fields} set={set} disabled={disabled} autoFocus={autoFocus} />
      {extraCount > 0 && <td colSpan={extraCount} />}
      <td>
        <Button size='small' variant='contained' disabled={disabled || isBlankDraft( fields )} onClick={() => onAdd( fields )}>Add</Button>
      </td>
    </tr>
  )
}

// Typed dates the shortcuts' Start Date accepts
const TYPED_DATE_FORMATS = ['yyyy-MM-dd', 'M/d/yyyy', 'M/d/yy']

function parseTypedDate( text )
{
  for( const f of TYPED_DATE_FORMATS )
  {
    const date = parse( text.trim(), f, new Date() )

    if( isValid( date ) && date.getFullYear() > 1900 )
      return format( date, 'yyyy-MM-dd' )
  }

  return ''
}

// "Default 2-day" etc.: asks for the first day - typed, or picked from
// the calendar beneath (shown in place, since a pop-up calendar can't
// position itself inside a popover) - then adds a day each.
function TemplateButton( {template, defaultStartDate, disabled, onPick} )
{
  const [anchor, setAnchor] = useState( null )
  const [typed, setTyped] = useState( '' )
  const startDate = parseTypedDate( typed )

  function close()
  {
    setAnchor( null )
    setTyped( '' )
  }

  return (
    <>
      <Tooltip title={template.days.map( d => d.title ).join( ', then ' )}>
        <Button size='small' variant='outlined' disabled={disabled} onClick={e => { setTyped( defaultStartDate || '' ); setAnchor( e.currentTarget ) }} startIcon={<i className='ri-calendar-schedule-line' />}>
          {template.label}
        </Button>
      </Tooltip>
      <Popover open={Boolean( anchor )} anchorEl={anchor} onClose={close} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
        <div className='flex flex-col gap-3 p-4'>
          <div className='flex items-center gap-3'>
            <TextField
              size='small'
              label='Start Date'
              placeholder='YYYY-MM-DD'
              autoFocus
              value={typed}
              onChange={e => setTyped( e.target.value )}
              onKeyDown={e => {
                if( e.key !== 'Enter' )
                  return

                // Else the same keypress "clicks" the shortcut button focus returns to
                e.preventDefault()

                if( startDate )
                {
                  onPick( templateOccurrences( template, startDate ) )
                  close()
                }
              }}
              error={Boolean( typed.trim() ) && !startDate}
              slotProps={{inputLabel: {shrink: true}}}
            />
            <Button size='small' variant='contained' disabled={!startDate} onClick={() => { onPick( templateOccurrences( template, startDate ) ); close() }}>
              Add {template.days.length} days
            </Button>
          </div>
          <AppReactDatepicker
            inline
            selected={startDate ? parse( startDate, 'yyyy-MM-dd', new Date() ) : null}
            onChange={date => date && setTyped( format( date, 'yyyy-MM-dd' ) )}
          />
        </div>
      </Popover>
    </>
  )
}
