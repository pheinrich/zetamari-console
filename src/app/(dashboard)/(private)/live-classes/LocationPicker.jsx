'use client'

import { useMemo, useState } from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

// A class's location, picked from those other classes already use
// (readLiveClassLocations() - there's no Location model, just each
// class's locationName/locationAddress) or entered new. Typing searches
// names and addresses; the first option is always "New location: <what's
// typed>", which opens a dialog for the name (prefilled from the search)
// and address. Same shape as the Accept dialog's Customer field.
//
// `value` is {locationName, locationAddress} or null; onChange gets the same.
export default function LocationPicker( {locations, value, onChange} )
{
  const [search, setSearch] = useState( '' )
  const [creating, setCreating] = useState( null )   // {locationName, locationAddress} being entered
  const [open, setOpen] = useState( false )

  const options = useMemo( () => {
    const words = search.trim().toLowerCase().split( /\s+/ ).filter( Boolean )
    const matching = locations.filter( l => words.every( w => `${l.locationName} ${l.locationAddress ?? ''}`.toLowerCase().includes( w ) ) )

    return [{isNew: true, locationName: search.trim()}, ...matching]
  }, [locations, search] )

  function choose( option )
  {
    setOpen( false )

    if( option?.isNew )
      return setCreating( {locationName: option.locationName, locationAddress: ''} )

    onChange( option ? {locationName: option.locationName, locationAddress: option.locationAddress ?? ''} : null )
  }

  function saveNew()
  {
    onChange( {locationName: creating.locationName.trim(), locationAddress: creating.locationAddress.trim()} )
    setCreating( null )
    setSearch( '' )
  }

  return (
    <>
      <Autocomplete
        fullWidth
        openOnFocus
        open={open && !creating}
        onOpen={() => setOpen( true )}
        onClose={() => setOpen( false )}
        options={options}
        value={value}
        onChange={(e, option) => choose( option )}
        onInputChange={(e, text, reason) => reason === 'input' && setSearch( text )}
        filterOptions={x => x}
        getOptionLabel={o => o.locationName ?? ''}
        getOptionKey={o => o.isNew ? 'new' : o.locationName}
        isOptionEqualToValue={(o, v) => !o.isNew && o.locationName === v.locationName}
        renderOption={({key, ...props}, o) => (
          <li key={key} {...props}>
            {o.isNew ? (
              <span className='flex items-center gap-2 text-primary'>
                <i className='ri-map-pin-add-line' />
                {o.locationName ? `New location: ${o.locationName}` : 'New location…'}
              </span>
            ) : (
              <div className='flex flex-col'>
                <span>{o.locationName}</span>
                {o.locationAddress && <small className='text-textSecondary'>{o.locationAddress}</small>}
              </div>
            )}
          </li>
        )}
        renderInput={params => <TextField {...params} label='Location' placeholder='Search locations by name or address' />}
      />

      {/* No focus back to the box on close - it would reopen the list over the form */}
      <Dialog open={Boolean( creating )} onClose={() => setCreating( null )} fullWidth maxWidth='sm' disableRestoreFocus>
        <DialogTitle>New Location</DialogTitle>
        {creating && (
          <DialogContent className='flex flex-col gap-4'>
            <TextField
              autoFocus
              fullWidth
              label='Name'
              className='mbs-1'
              placeholder='e.g. Angie&apos;s Studio, Zoom, SAMA 2026'
              value={creating.locationName}
              onChange={e => setCreating( c => ({...c, locationName: e.target.value}) )}
            />
            <TextField
              fullWidth
              label='Address'
              value={creating.locationAddress}
              onChange={e => setCreating( c => ({...c, locationAddress: e.target.value}) )}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button color='secondary' onClick={() => setCreating( null )}>Cancel</Button>
          <Button variant='contained' disabled={!creating?.locationName.trim()} onClick={saveNew}>Use Location</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
