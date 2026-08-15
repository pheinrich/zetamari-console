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
  // Defensive defaults - a view persisted from before this filter set
  // changed (see useTableViewState.js) may be missing newer keys
  // entirely, and MUI's Select warns if `value` is ever undefined.
  const { type = '', marketing = '', orders = '', classes = '' } = filters || {}

  useEffect( () => {
    const filtered = customerData?.filter( customer => {
      if( type && customer.type !== type ) return false

      // Tri-state - see the acceptsEmailMarketing model doc comment.
      // 'no' here means an explicit opt-out (false), not merely "unknown"
      // (null), which has its own option below.
      if( marketing === 'yes' && true !== customer.acceptsEmailMarketing ) return false
      if( marketing === 'no' && false !== customer.acceptsEmailMarketing ) return false
      if( marketing === 'unknown' && null != customer.acceptsEmailMarketing ) return false

      if( orders === 'none' && customer.orderCount ) return false
      if( orders === 'some' && !customer.orderCount ) return false

      if( classes === 'none' && customer.classCount ) return false
      if( classes === 'some' && !customer.classCount ) return false

      return true
    })

    setData( filtered ?? [] )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, marketing, orders, classes, customerData] )

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
              <MenuItem value='unknown'>Unknown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='customer-orders-filter'>Orders</InputLabel>
            <Select
              fullWidth
              label='Orders'
              labelId='customer-orders-filter'
              value={orders}
              onChange={e => onFiltersChange( {...filters, orders: e.target.value} )}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='some'>Has ordered</MenuItem>
              <MenuItem value='none'>Never ordered</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='customer-classes-filter'>Classes</InputLabel>
            <Select
              fullWidth
              label='Classes'
              labelId='customer-classes-filter'
              value={classes}
              onChange={e => onFiltersChange( {...filters, classes: e.target.value} )}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='some'>Has attended a class</MenuItem>
              <MenuItem value='none'>Never attended a class</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}
