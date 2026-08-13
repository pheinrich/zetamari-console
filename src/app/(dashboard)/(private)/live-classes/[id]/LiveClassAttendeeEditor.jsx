'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { addLiveClassAttendee, updateLiveClassAttendee, removeLiveClassAttendee } from '@/db/actions/liveClass'
import { customerDisplayName } from '../../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'

const STATUS_OPTIONS = ['enrolled', 'waitlisted', 'cancelled', 'completed']

// Manages a class's roster of LiveClassAttendee rows - deliberately not
// called "students" in code (see that model's doc comment). `customer` is
// optional per row: a seat can belong to a walk-in with no Customer
// record at all. Same "separate mini-CRUD, not bundled into the parent
// form" approach as products/BomEditor.jsx and the sibling
// CustomerSourceEditor.jsx.
export default function LiveClassAttendeeEditor( {liveClassId, attendees, customerOptions} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [customer, setCustomer] = useState( null )
  const [firstName, setFirstName] = useState( '' )
  const [lastName, setLastName] = useState( '' )
  const [status, setStatus] = useState( 'enrolled' )
  const [error, setError] = useState( null )

  function handleAdd()
  {
    setError( null )
    startTransition( async () => {
      const result = await addLiveClassAttendee( liveClassId, {
        customerId: customer?.id || null,
        firstName: firstName || null,
        lastName: lastName || null,
        status,
      } )

      if( result?.error )
        setError( result.error )
      else
      {
        setCustomer( null )
        setFirstName( '' )
        setLastName( '' )
        setStatus( 'enrolled' )
        router.refresh()
      }
    })
  }

  function handleStatusChange( attendeeId, newStatus )
  {
    startTransition( async () => {
      await updateLiveClassAttendee( attendeeId, {status: newStatus} )
      router.refresh()
    })
  }

  function handleDiscountChange( attendeeId, newDiscount )
  {
    startTransition( async () => {
      await updateLiveClassAttendee( attendeeId, {
        discountPercent: '' === newDiscount ? null : Number( newDiscount )
      } )
      router.refresh()
    })
  }

  function handleRemove( attendeeId )
  {
    if( !confirm( 'Remove this attendee?' ) )
      return

    startTransition( async () => {
      await removeLiveClassAttendee( attendeeId )
      router.refresh()
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Status</th>
              <th>Discount %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendees.map( attendee => (
              <tr key={attendee.id}>
                <td>
                  <div className='flex flex-col'>
                    {attendee.Customer ? (
                      <Link href={`/customers/${attendee.Customer.id}`}>
                        {[attendee.firstName, attendee.lastName].filter( Boolean ).join( ' ' ) || customerDisplayName( attendee.Customer )}
                      </Link>
                    ) : (
                      <Typography>{[attendee.firstName, attendee.lastName].filter( Boolean ).join( ' ' ) || '—'}</Typography>
                    )}
                    {!attendee.Customer && <Chip label='not linked to a customer' variant='tonal' size='small' className='is-fit' />}
                  </div>
                </td>
                <td>
                  <FormControl size='small' className='min-is-[140px]'>
                    <Select
                      value={attendee.status}
                      disabled={isPending}
                      onChange={e => handleStatusChange( attendee.id, e.target.value )}
                    >
                      {STATUS_OPTIONS.map( option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ) )}
                    </Select>
                  </FormControl>
                </td>
                <td>
                  <TextField
                    type='number'
                    size='small'
                    inputProps={{step: '1', min: '0', max: '100'}}
                    defaultValue={attendee.discountPercent ?? ''}
                    onBlur={e => handleDiscountChange( attendee.id, e.target.value )}
                    disabled={isPending}
                    className='is-24'
                  />
                </td>
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( attendee.id )}>
                    <i className='ri-delete-bin-7-line' />
                  </IconButton>
                </td>
              </tr>
            ) )}
            {0 === attendees.length && (
              <tr><td colSpan={4}>No attendees added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <Autocomplete
          size='small'
          className='min-is-[240px]'
          options={customerOptions}
          value={customer}
          getOptionLabel={option => customerDisplayName( option )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, value) => {
            setCustomer( value )

            if( value )
            {
              setFirstName( value.firstName || '' )
              setLastName( value.lastName || '' )
            }
          }}
          renderInput={params => <TextField {...params} label='Customer (optional)' />}
        />
        <TextField size='small' label='First Name' value={firstName} onChange={e => setFirstName( e.target.value )} />
        <TextField size='small' label='Last Name' value={lastName} onChange={e => setLastName( e.target.value )} />
        <FormControl size='small' className='min-is-[140px]'>
          <InputLabel id='attendee-status-select'>Status</InputLabel>
          <Select
            labelId='attendee-status-select'
            label='Status'
            value={status}
            onChange={e => setStatus( e.target.value )}
          >
            {STATUS_OPTIONS.map( option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ) )}
          </Select>
        </FormControl>
        <Button variant='outlined' disabled={isPending} onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <Typography color='error' variant='body2'>{error}</Typography>}
    </div>
  )
}
