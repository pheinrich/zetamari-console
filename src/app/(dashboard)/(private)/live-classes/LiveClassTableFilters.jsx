'use client'

import { useEffect, useMemo } from 'react'

import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Controlled by the caller (filters + onFiltersChange), same pattern as
// customers/CustomerTableFilters.jsx.
export default function LiveClassTableFilters( {liveClassData, setData, filters, onFiltersChange} )
{
  const { location = '' } = filters || {}

  // The Locations classes in the list are held at (see Location.js)
  const locationOptions = useMemo( () => {
    const names = new Set( (liveClassData || []).map( c => c.Location?.name ).filter( Boolean ) )

    return [...names].sort()
  }, [liveClassData] )

  useEffect( () => {
    const filtered = liveClassData?.filter( liveClass => {
      if( location && liveClass.Location?.name !== location ) return false

      return true
    })

    setData( filtered ?? [] )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, liveClassData] )

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='live-class-location-filter'>Location</InputLabel>
            <Select
              fullWidth
              label='Location'
              labelId='live-class-location-filter'
              value={location}
              onChange={e => onFiltersChange( {...filters, location: e.target.value} )}
            >
              <MenuItem value=''>All Locations</MenuItem>
              {locationOptions.map( name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ) )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}
