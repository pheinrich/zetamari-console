'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { addMonths, eachDayOfInterval, endOfMonth, format, isWeekend, startOfMonth } from 'date-fns'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { deleteAssistantAvailability, upsertAssistantAvailability, upsertCapacity } from '@/db/actions/capacity'
import { formatDateOnly, resolveDailyCapacity } from '@/libs/pieceScheduling'
import tableStyles from '@core/styles/table.module.css'

const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

// One Owner's hours cell for one day - always shows the *effective*
// value (an explicit Capacity override, or the computed fallback
// through WeeklyBudget/defaultWeeklyHours), colored differently
// depending on which it is, per the original ask. Blank -> delete the
// override (back to the fallback); any real number including 0 is
// stored as a deliberate override (e.g. a vacation day) - see
// upsertCapacity()'s doc comment for the bug this replaced.
//
// Uncontrolled (defaultValue + onBlur), same convention as products/
// BomEditor.jsx's quantity cells - keyed on the override value itself
// so a save-triggered refresh remounts the input with the new default
// rather than leaving stale typed-but-unsynced state behind.
function OwnerCell( {owner, dateStr, override, fallback, disabled, onSave} )
{
  const hasOverride = null != override

  return (
    <TextField
      key={override ?? 'fallback'}
      type='number'
      size='small'
      title={owner.name}
      defaultValue={hasOverride ? override : fallback}
      onBlur={e => onSave( owner.id, dateStr, e.target.value )}
      disabled={disabled}
      sx={{...noSpinnerSx, '& input': {color: hasOverride ? 'text.primary' : 'text.disabled'}}}
      inputProps={{step: '0.5', min: '0'}}
      className='is-20'
    />
  )
}

// A day's named-assistant entries (removable chips) plus an inline
// add row - name uses a native <input list>/<datalist> suggesting
// previously-used names (freeform, no new User/login - see
// AssistantAvailability's doc comment) rather than a full Autocomplete,
// to stay compact across every day row.
function AssistantsCell( {dateStr, entries, nameSuggestions, disabled, onAdd, onRemove} )
{
  const [name, setName] = useState( '' )
  const [hours, setHours] = useState( '' )

  function handleAdd()
  {
    if( !name.trim() || !hours )
      return

    onAdd( dateStr, name.trim(), hours )
    setName( '' )
    setHours( '' )
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {entries.map( entry => (
        <Chip
          key={entry.id}
          size='small'
          variant='tonal'
          label={`${entry.name} × ${entry.hours}`}
          onDelete={disabled ? undefined : () => onRemove( entry.id )}
        />
      ) )}
      <input
        list={`assistant-names-${dateStr}`}
        placeholder='Name'
        value={name}
        onChange={e => setName( e.target.value )}
        disabled={disabled}
        className='is-24 pli-2 plb-1 rounded border border-solid text-sm'
      />
      <datalist id={`assistant-names-${dateStr}`}>
        {nameSuggestions.map( n => <option key={n} value={n} /> )}
      </datalist>
      <input
        type='number'
        step='0.5'
        min='0'
        placeholder='Hrs'
        value={hours}
        onChange={e => setHours( e.target.value )}
        disabled={disabled}
        className='is-14 pli-2 plb-1 rounded border border-solid text-sm'
      />
      <IconButton size='small' disabled={disabled || !name.trim() || !hours} onClick={handleAdd} aria-label='Add assistant'>
        <i className='ri-add-line' />
      </IconButton>
    </div>
  )
}

export default function CapacityCalendar( {owners, capacities, weeklyBudgets, assistantAvailability, groutingDays} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [monthOffset, setMonthOffset] = useState( 0 )

  const monthStart = startOfMonth( addMonths( new Date(), monthOffset ) )
  const days = eachDayOfInterval( {start: monthStart, end: endOfMonth( monthStart )} )

  const usersById = useMemo( () => Object.fromEntries( owners.map( o => [o.id, o] ) ), [owners] )
  const capacityByUserDate = useMemo(
    () => Object.fromEntries( capacities.map( c => [`${c.userId}:${c.date}`, c.hours] ) ),
    [capacities]
  )
  const weeklyBudgetByUserWeek = useMemo(
    () => Object.fromEntries( weeklyBudgets.map( w => [`${w.userId}:${w.weekStartDate}`, w.hours] ) ),
    [weeklyBudgets]
  )
  const groutingDayDates = useMemo( () => new Set( groutingDays.map( g => g.date ) ), [groutingDays] )
  const assistantsByDate = useMemo( () => {
    const map = {}
    for( const a of assistantAvailability )
      (map[a.date] ??= []).push( a )
    return map
  }, [assistantAvailability] )
  const nameSuggestions = useMemo(
    () => [...new Set( assistantAvailability.map( a => a.name ) )].sort(),
    [assistantAvailability]
  )

  function handleSaveCapacity( userId, dateStr, value )
  {
    startTransition( async () => {
      try
      {
        await upsertCapacity( userId, dateStr, value )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to save Capacity' )
      }
    })
  }

  function handleAddAssistant( dateStr, name, hours )
  {
    startTransition( async () => {
      try
      {
        const result = await upsertAssistantAvailability( dateStr, name, hours )
        if( result?.error )
          toast.error( result.error )
        else
          router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to add the assistant' )
      }
    })
  }

  function handleRemoveAssistant( id )
  {
    startTransition( async () => {
      try
      {
        await deleteAssistantAvailability( id )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to remove the assistant' )
      }
    })
  }

  return (
    <Card>
      <CardHeader
        title={format( monthStart, 'MMMM yyyy' )}
        action={
          <div className='flex items-center gap-2'>
            <IconButton onClick={() => setMonthOffset( m => m - 1 )} aria-label='Previous month'>
              <i className='ri-arrow-left-s-line' />
            </IconButton>
            <IconButton onClick={() => setMonthOffset( 0 )} aria-label='This month' disabled={0 === monthOffset}>
              <i className='ri-record-circle-line text-sm' />
            </IconButton>
            <IconButton onClick={() => setMonthOffset( m => m + 1 )} aria-label='Next month'>
              <i className='ri-arrow-right-s-line' />
            </IconButton>
          </div>
        }
      />
      <CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                {owners.map( owner => <th key={owner.id}>{owner.name}</th> )}
                <th>Assistants</th>
              </tr>
            </thead>
            <tbody>
              {days.map( day => {
                const dateStr = formatDateOnly( day )
                const isGroutingDay = groutingDayDates.has( dateStr )

                return (
                  <tr key={dateStr} className={isWeekend( day ) ? 'bg-actionHover' : undefined}>
                    <td>
                      <div className='flex items-center gap-2'>
                        <Typography className='font-medium'>{format( day, 'EEE MMM d' )}</Typography>
                        {isGroutingDay && <Chip size='small' color='primary' variant='tonal' label='Grouting Day' />}
                      </div>
                    </td>
                    {owners.map( owner => {
                      const override = capacityByUserDate[`${owner.id}:${dateStr}`]
                      const fallback = resolveDailyCapacity( owner.id, dateStr, capacityByUserDate, weeklyBudgetByUserWeek, usersById )

                      return (
                        <td key={owner.id}>
                          <OwnerCell
                            owner={owner}
                            dateStr={dateStr}
                            override={override}
                            fallback={fallback}
                            disabled={isPending}
                            onSave={handleSaveCapacity}
                          />
                        </td>
                      )
                    } )}
                    <td>
                      <AssistantsCell
                        dateStr={dateStr}
                        entries={assistantsByDate[dateStr] ?? []}
                        nameSuggestions={nameSuggestions}
                        disabled={isPending}
                        onAdd={handleAddAssistant}
                        onRemove={handleRemoveAssistant}
                      />
                    </td>
                  </tr>
                )
              } )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
