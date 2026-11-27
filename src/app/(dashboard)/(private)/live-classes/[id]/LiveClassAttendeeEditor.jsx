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

import { addLiveClassAttendee, removeLiveClassAttendee, setLiveClassAttendeeCustomer, updateLiveClassAttendee } from '@/db/actions/liveClass'
import { customerDisplayName } from '../../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'
import { useConfirm } from '@/contexts/confirmContext'
import DateField from '@/components/DateField'
import { unitInputProps } from '@/utils/units'

const STATUS_OPTIONS = ['enrolled', 'waitlisted', 'cancelled', 'completed']

// The "who is this seat" dialog's first choice: make a new customer from it
const NEW_CUSTOMER = {id: 'new', label: 'New customer from the name and email below'}

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
  const confirm = useConfirm()
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

  // The "who" dialog: re-link a seat to a different (or new) customer,
  // or unlink it - and, while it isn't linked to an existing customer,
  // edit its own name and email. A linked seat takes its customer's.
  const [whoAttendee, setWhoAttendee] = useState( null )
  const [whoCustomer, setWhoCustomer] = useState( null )
  const [whoFirstName, setWhoFirstName] = useState( '' )
  const [whoLastName, setWhoLastName] = useState( '' )
  const [whoEmail, setWhoEmail] = useState( '' )
  const [whoError, setWhoError] = useState( null )
  const linkedToExisting = whoCustomer && whoCustomer.id !== 'new'

  function openWhoDialog( attendee )
  {
    setWhoAttendee( attendee )
    setWhoCustomer( attendee.customerId ? customerOptions.find( c => c.id === attendee.customerId ) ?? attendee.Customer ?? null : null )
    setWhoFirstName( attendee.firstName || '' )
    setWhoLastName( attendee.lastName || '' )
    setWhoEmail( attendee.email || '' )
    setWhoError( null )
  }

  function chooseWhoCustomer( value )
  {
    setWhoCustomer( value )

    if( value && value.id !== 'new' )
    {
      setWhoFirstName( value.firstName || '' )
      setWhoLastName( value.lastName || '' )
      setWhoEmail( value.email || '' )
    }
  }

  function handleSaveWho()
  {
    setWhoError( null )
    startTransition( async () => {
      const result = await setLiveClassAttendeeCustomer( whoAttendee.id, {
        customerId: whoCustomer?.id ?? null,
        firstName: whoFirstName,
        lastName: whoLastName,
        email: whoEmail,
      } )

      if( result?.error )
        return setWhoError( result.error )

      setWhoAttendee( null )
      router.refresh()
    })
  }

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

  async function handleRemove( attendeeId )
  {
    if( !await confirm( 'Remove this attendee?', {confirmText: 'Remove', destructive: true} ) )
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
              <th></th>
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
                  <IconButton size='small' disabled={isPending} onClick={() => openWhoDialog( attendee )} title='Change customer, name or email'>
                    <i className='ri-user-settings-line' />
                  </IconButton>
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
                    InputProps={unitInputProps( '%' )}
                    className='is-24'
                  />
                </td>
                <td>
                  <DateField
                    size='small'
                    defaultValue={attendee.enrolledOn || ''}
                    onChange={v => handleEnrolledOnChange( attendee.id, v )}
                    disabled={isPending}
                    boxProps={{className: 'is-40'}}
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
              <tr><td colSpan={8}>No attendees added yet.</td></tr>
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

      <Dialog open={Boolean( whoAttendee )} onClose={() => setWhoAttendee( null )} fullWidth maxWidth='sm'>
        <DialogTitle>Attendee</DialogTitle>
        <DialogContent>
          <Stack spacing={4} className='mbs-1'>
            <Autocomplete
              options={[NEW_CUSTOMER, ...customerOptions]}
              value={whoCustomer}
              onChange={(e, value) => chooseWhoCustomer( value )}
              getOptionLabel={o => o.id === 'new' ? o.label : customerDisplayName( o )}
              getOptionKey={o => o.id}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderOption={({key, ...props}, o) => (
                <li key={key} {...props}>
                  {o.id === 'new'
                    ? <span className='flex items-center gap-2 text-primary'><i className='ri-user-add-line' />{o.label}</span>
                    : <div className='flex flex-col'><span>{customerDisplayName( o )}</span>{o.email && <small className='text-textSecondary'>{o.email}</small>}</div>}
                </li>
              )}
              renderInput={params => <TextField {...params} label='Customer' placeholder='Not linked - search customers' />}
            />
            <Typography variant='body2' color='text.secondary'>
              {linkedToExisting
                ? 'The seat takes this customer\'s name and email. Clear the customer to unlink it.'
                : whoCustomer ? 'A new customer (a Student) is made from these.' : 'Not linked to a customer.'}
            </Typography>
            <div className='flex flex-wrap gap-4'>
              <TextField size='small' label='First Name' value={whoFirstName} disabled={linkedToExisting} onChange={e => setWhoFirstName( e.target.value )} />
              <TextField size='small' label='Last Name' value={whoLastName} disabled={linkedToExisting} onChange={e => setWhoLastName( e.target.value )} />
              <TextField size='small' label='Email' value={whoEmail} disabled={linkedToExisting} onChange={e => setWhoEmail( e.target.value )} className='min-is-[240px]' />
            </div>
            {whoError && <Typography color='error' variant='body2'>{whoError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWhoAttendee( null )} color='secondary'>Cancel</Button>
          <Button variant='contained' disabled={isPending} onClick={handleSaveWho}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

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
