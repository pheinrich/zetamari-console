'use client'

import { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { createLocation, deleteLocation, updateLocation } from '@/db/actions/liveClass'
import { useConfirm } from '@/contexts/confirmContext'
import { formatAddress } from '@/utils/addresses'

// A class's Location (see db/models/Location.js), picked from every
// Location - Angie's own first, then a divider, then the rest A-Z.
// Typing searches names and addresses; the first option is always "New
// location: <what's typed>", which opens a dialog for the name (prefilled
// from the search) and address and saves it. Each listed location has a
// pencil (rename/re-address it, for every class held there) and a trash
// can (delete it - refused while any class uses it). Same shape as the
// Accept dialog's Customer field.
//
// `locations` is readLocations()'s list; `value` is one of them or null.

const isAngies = l => /^angie/i.test( l.name ?? '' )

// Option groups, in the order options are listed: the "New location"
// entry, Angie's, then everyone else's
const groupOf = o => o.isNew ? 'new' : isAngies( o ) ? 'angie' : 'other'

const ADDRESS_FIELDS = [
  ['street1', 'Street 1', {xs: 12}],
  ['street2', 'Street 2', {xs: 12}],
  ['city', 'City', {xs: 12, sm: 6}],
  ['state', 'State', {xs: 6, sm: 3}],
  ['postalCode', 'Zip', {xs: 6, sm: 3}],
  ['country', 'Country', {xs: 12, sm: 6}],
]

const plural = n => `${n} class${n === 1 ? '' : 'es'}`

export default function LocationPicker( {locations: initial, value, onChange} )
{
  const confirm = useConfirm()
  const [locations, setLocations] = useState( initial )
  const [search, setSearch] = useState( '' )
  const [open, setOpen] = useState( false )
  const [editing, setEditing] = useState( null )   // {id?, name, address, classCount} in the dialog
  const [saving, setSaving] = useState( false )
  const [confirming, setConfirming] = useState( false )   // keeps the list shut under the confirm

  const options = useMemo( () => {
    const words = search.trim().toLowerCase().split( /\s+/ ).filter( Boolean )

    const matching = locations
      .filter( l => words.every( w => `${l.name} ${formatAddress( l.Address )}`.toLowerCase().includes( w ) ) )
      .sort( (a, b) => isAngies( b ) - isAngies( a ) || a.name.localeCompare( b.name, undefined, {sensitivity: 'base'} ) )

    return [{isNew: true, name: search.trim()}, ...matching]
  }, [locations, search] )

  function choose( option )
  {
    setOpen( false )

    if( option?.isNew )
      return setEditing( {name: option.name, address: {}} )

    onChange( option ?? null )
  }

  // The pencil and trash sit inside an option - keep their presses from
  // also choosing it (or closing the list before the click lands)
  function hold( e )
  {
    e.preventDefault()
    e.stopPropagation()
  }

  function stop( e )
  {
    hold( e )
    setOpen( false )
  }

  function startEdit( e, location )
  {
    stop( e )
    setEditing( {id: location.id, name: location.name, address: {...location.Address}, classCount: location.classCount} )
  }

  async function remove( e, location )
  {
    stop( e )
    setConfirming( true )

    const ok = await confirm( `Delete the location ${location.name}?`, {confirmText: 'Delete', destructive: true} )

    setConfirming( false )

    if( !ok )
      return

    const result = await deleteLocation( location.id )

    if( result.error )
      return toast.error( result.error )

    setLocations( list => list.filter( l => l.id !== location.id ) )

    if( value?.id === location.id )
      onChange( null )

    toast.success( `Deleted ${location.name}` )
  }

  async function save()
  {
    setSaving( true )

    const fields = {name: editing.name, address: editing.address}
    const result = editing.id ? await updateLocation( editing.id, fields ) : await createLocation( fields )

    setSaving( false )

    if( result.error )
      return toast.error( result.error )

    const saved = result.location

    setLocations( list => [...list.filter( l => l.id !== saved.id ), saved] )

    // A new one becomes this class's; an edited one refreshes the choice if chosen
    if( !editing.id || value?.id === saved.id )
      onChange( saved )

    setEditing( null )
    setSearch( '' )
  }

  const setField = (field, text) => setEditing( d => ({...d, address: {...d.address, [field]: text}}) )

  return (
    <>
      <Autocomplete
        fullWidth
        openOnFocus
        open={open && !editing && !confirming}
        onOpen={() => setOpen( true )}
        onClose={() => setOpen( false )}
        options={options}
        value={value}
        onChange={(e, option) => choose( option )}
        onInputChange={(e, text, reason) => reason === 'input' && setSearch( text )}
        filterOptions={x => x}
        groupBy={groupOf}
        renderGroup={({key, group, children}) => (
          <li key={key}>
            {group === 'other' && <Divider className='mlb-1' />}
            <ul className='p-0'>{children}</ul>
          </li>
        )}
        getOptionLabel={o => o.name ?? ''}
        getOptionKey={o => o.isNew ? 'new' : o.id}
        isOptionEqualToValue={(o, v) => !o.isNew && o.id === v.id}
        renderOption={({key, ...props}, o) => (
          <li key={key} {...props}>
            {o.isNew ? (
              <span className='flex items-center gap-2 text-primary'>
                <i className='ri-map-pin-add-line' />
                {o.name ? `New location: ${o.name}` : 'New location…'}
              </span>
            ) : (
              <div className='flex is-full items-center gap-2'>
                <div className='flex flex-1 flex-col min-is-0'>
                  <span>{o.name}</span>
                  {o.Address && <small className='text-textSecondary'>{formatAddress( o.Address )}</small>}
                </div>
                <Tooltip title='Edit location'>
                  <IconButton size='small' aria-label={`Edit ${o.name}`} onMouseDown={hold} onClick={e => startEdit( e, o )}>
                    <i className='ri-pencil-line' />
                  </IconButton>
                </Tooltip>
                <Tooltip title={o.classCount ? `Used by ${plural( o.classCount )} - can't delete` : 'Delete location'}>
                  <span onMouseDown={hold} onClick={e => o.classCount && hold( e )}>
                    <IconButton size='small' aria-label={`Delete ${o.name}`} disabled={o.classCount > 0} onClick={e => remove( e, o )}>
                      <i className='ri-delete-bin-7-line' />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            )}
          </li>
        )}
        renderInput={params => <TextField {...params} label='Location' placeholder='Search locations by name or address' />}
      />

      {/* No focus back to the box on close - it would reopen the list over the form */}
      <Dialog open={Boolean( editing )} onClose={() => setEditing( null )} fullWidth maxWidth='sm' disableRestoreFocus>
        <DialogTitle>{editing?.id ? 'Edit Location' : 'New Location'}</DialogTitle>
        {editing && (
          <DialogContent>
            <Grid container spacing={4} className='mbs-1'>
              <Grid size={{xs: 12}}>
                <TextField
                  autoFocus
                  fullWidth
                  label='Name'
                  placeholder='e.g. Angie&apos;s Studio, Zoom, SAMA 2026'
                  value={editing.name}
                  onChange={e => setEditing( d => ({...d, name: e.target.value}) )}
                  helperText={editing.classCount ? `Changes apply to ${editing.classCount === 1 ? 'the class' : `all ${plural( editing.classCount )}`} held here.` : null}
                />
              </Grid>
              {ADDRESS_FIELDS.map( ([field, label, size]) => (
                <Grid key={field} size={size}>
                  <TextField fullWidth label={label} value={editing.address[field] ?? ''} onChange={e => setField( field, e.target.value )} />
                </Grid>
              ) )}
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button color='secondary' onClick={() => setEditing( null )}>Cancel</Button>
          <Button variant='contained' disabled={saving || !editing?.name.trim()} onClick={save}>
            {editing?.id ? 'Save' : 'Use Location'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
