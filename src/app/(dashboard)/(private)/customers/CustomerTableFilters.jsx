'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Controlled by the caller (filters + onFiltersChange), same pattern as
// products/ProductTableFilters.jsx - lets the selected values persist via
// CustomersListTable's useTableViewState instead of resetting on remount.
export default function CustomerTableFilters( {customerData, setData, filters, onFiltersChange} )
{
  const { type, student, marketing } = filters

  useEffect( () => {
    const filtered = customerData?.filter( customer => {
      if( type && customer.type !== type ) return false
      if( student === 'yes' && !customer.classCount ) return false
      if( student === 'no' && customer.classCount ) return false
      if( marketing === 'yes' && !customer.acceptsEmailMarketing ) return false
      if( marketing === 'no' && customer.acceptsEmailMarketing ) return false

      return true
    })

    setData( filtered ?? [] )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, student, marketing, customerData] )

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='customer-type-filter'>Type</InputLabel>
            <Select
              fullWidth
              label='Type'
              labelId='customer-type-filter'
              value={type}
              onChange={e => onFiltersChange( {...filters, type: e.target.value} )}
            >
              <MenuItem value=''>All Types</MenuItem>
              <MenuItem value='wholesale'>Wholesale</MenuItem>
              <MenuItem value='retail'>Retail</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='customer-student-filter'>Student</InputLabel>
            <Select
              fullWidth
              label='Student'
              labelId='customer-student-filter'
              value={student}
              onChange={e => onFiltersChange( {...filters, student: e.target.value} )}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='yes'>Has attended a class</MenuItem>
              <MenuItem value='no'>Never attended a class</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='customer-marketing-filter'>Email Marketing</InputLabel>
            <Select
              fullWidth
              label='Email Marketing'
              labelId='customer-marketing-filter'
              value={marketing}
              onChange={e => onFiltersChange( {...filters, marketing: e.target.value} )}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='yes'>Opted In</MenuItem>
              <MenuItem value='no'>Opted Out</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}
