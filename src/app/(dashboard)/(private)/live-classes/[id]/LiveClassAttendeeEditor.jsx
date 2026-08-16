'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
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
  const [email, setEmail] = useState( '' )
  const [status, setStatus] = useState( 'enrolled' )
  const [error, setError] = useState( null )

  // Notes/Upgrade Notes editing - a Dialog rather than inline table cells
  // like Status/Discount above, since both are free-text TEXT columns
  // that can run long (see the model's own doc comment on upgradeNotes/
  // notes) and don't fit a table cell well. `notesAttendee` holds the row
  // currently being edited (null when the dialog is closed); the two
  // draft fields are separate local state rather than mutating
  // notesAttendee directly, so Cancel can discard edits cleanly.
  const [notesAttendee, setNotesAttendee] = useState( null )
  const [notesDraft, setNotesDraft] = useState( '' )
  const [upgradeNotesDraft, setUpgradeNotesDraft] = useState( '' )

  function handleAdd()
  {
    setError( null )
    startTransition( async () => {
      const result = await addLiveClassAttendee( liveClassId, {
        customerId: customer?.id || null,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        status,
      } )

      if( result?.error )
        setError( result.error )
      else
      {
        setCustomer( null )
        setFirstName( '' )
        setLastName( '' )
        setEmail( '' )
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

  // enrolledOn is NOT NULL on the model (defaults to today's date if a
  // row is created without one - see LiveClassAttendee.js) - an empty
  // value here is left alone rather than sent as null, since the date
  // input can't be blanked back to "unset" once a real value exists.
  function handleEnrolledOnChange( attendeeId, newEnrolledOn )
  {
    if( !newEnrolledOn )
      return

    startTransition( async () => {
      await updateLiveClassAttendee( attendeeId, {enrolledOn: newEnrolledOn} )
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

  function openNotesDialog( attendee )
  {
    setNotesAttendee( attendee )
    setNotesDraft( attendee.notes || '' )
    setUpgradeNotesDraft( attendee.upgradeNotes || '' )
  }

  function closeNotesDialog()
  {
    setNotesAttendee( null )
  }

  function handleSaveNotes()
  {
    startTransition( async () => {
      await updateLiveClassAttendee( notesAttendee.id, {
        notes: notesDraft || null,
        upgradeNotes: upgradeNotesDraft || null,
      } )
      closeNotesDialog()
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
              <th>Email</th>
              <th>Status</th>
              <th>Discount %</th>
              <th>Enrolled</th>
              <th>Notes</th>
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
                  <Typography variant='body2' color='text.secondary'>{attendee.email || '—'}</Typography>
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
                  <TextField
                    type='date'
                    size='small'
                    defaultValue={attendee.enrolledOn || ''}
                    onBlur={e => handleEnrolledOnChange( attendee.id, e.target.value )}
                    disabled={isPending}
                    className='is-40'
                  />
                </td>
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => openNotesDialog( attendee )}>
                    <i className={(attendee.notes || attendee.upgradeNotes) ? 'ri-file-text-fill' : 'ri-file-text-line'} />
                  </IconButton>
                </td>
                <td>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( attendee.id )}>
                    <i className='ri-delete-bin-7-line' />
                  </IconButton>
                </td>
              </tr>
            ) )}
            {0 === attendees.length && (
              <tr><td colSpan={7}>No attendees added yet.</td></tr>
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

          // Without this, MUI keys each dropdown option by
          // getOptionLabel(option) (see useAutocomplete.js) - fine for
          // most lists, but two different Customers can legitimately
          // share a display name (e.g. two people both named "Anne
          // Huddleston"), which produced a duplicate-key React warning.
          // id is always unique.
          getOptionKey={option => option.id}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, value) => {
            setCustomer( value )

            if( value )
            {
              setFirstName( value.firstName || '' )
              setLastName( value.lastName || '' )
              setEmail( value.email || '' )
            }
          }}
          renderInput={params => <TextField {...params} label='Customer (optional)' />}
        />
        <TextField size='small' label='First Name' value={firstName} onChange={e => setFirstName( e.target.value )} />
        <TextField size='small' label='Last Name' value={lastName} onChange={e => setLastName( e.target.value )} />
        <TextField size='small' label='Email' value={email} onChange={e => setEmail( e.target.value )} />
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

      <Dialog open={Boolean( notesAttendee )} onClose={closeNotesDialog} fullWidth maxWidth='sm'>
        <DialogTitle>
          Notes
          {notesAttendee && (
            <Typography variant='body2' color='text.secondary'>
              {[notesAttendee.firstName, notesAttendee.lastName].filter( Boolean ).join( ' ' ) || 'Attendee'}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={4} className='mbs-1'>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label='Notes'
              value={notesDraft}
              onChange={e => setNotesDraft( e.target.value )}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label='Upgrade Notes'
              value={upgradeNotesDraft}
              onChange={e => setUpgradeNotesDraft( e.target.value )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNotesDialog} color='secondary'>Cancel</Button>
          <Button variant='contained' disabled={isPending} onClick={handleSaveNotes}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
