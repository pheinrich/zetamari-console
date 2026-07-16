'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { PRODUCT_TYPE_META } from './ProductTypeMeta'

// Controlled by the caller (filters + onFiltersChange) rather than owning
// its own state, so the selected values can be persisted (see
// ProductListTable's useTableViewState) instead of resetting whenever
// this component remounts.
export default function ProductTableFilters( {productData, supplierData=[], setData, filters, onFiltersChange} )
{
  const { type, sellable, status, supplier } = filters

  useEffect( () => {
    const supplierId = supplier ? Number( supplier ) : null

    const filtered = productData?.filter( product => {
      if( type === '__assembled__' && product.type ) return false
      if( type && type !== '__assembled__' && product.type !== type ) return false
      if( sellable === 'yes' && !product.sellable ) return false
      if( sellable === 'no' && product.sellable ) return false
      if( status && product.status !== status ) return false
      if( supplierId && !product.suppliers?.some( s => s.id === supplierId ) ) return false

      return true
    })

    setData( filtered ?? [] )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, sellable, status, supplier, productData] )

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='type-select'>Type</InputLabel>
            <Select
              fullWidth
              id='select-type'
              label='Type'
              value={type}
              onChange={e => onFiltersChange( {...filters, type: e.target.value} )}
              labelId='type-select'
            >
              <MenuItem value=''>All Types</MenuItem>
              <MenuItem value='__assembled__'>Assembled (no type)</MenuItem>
              {Object.entries( PRODUCT_TYPE_META ).map( ([value, meta]) => (
                <MenuItem key={value} value={value}>{meta.label}</MenuItem>
              ) )}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='sellable-select'>Sellable</InputLabel>
            <Select
              fullWidth
              id='select-sellable'
              value={sellable}
              onChange={e => onFiltersChange( {...filters, sellable: e.target.value} )}
              label='Sellable'
              labelId='sellable-select'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='yes'>Sellable</MenuItem>
              <MenuItem value='no'>Material Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              value={status}
              onChange={e => onFiltersChange( {...filters, status: e.target.value} )}
              label='Status'
              labelId='status-select'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='visible'>Visible</MenuItem>
              <MenuItem value='hidden'>Hidden</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='supplier-select'>Supplier</InputLabel>
            <Select
              fullWidth
              id='select-supplier'
              value={supplier}
              onChange={e => onFiltersChange( {...filters, supplier: e.target.value} )}
              label='Supplier'
              labelId='supplier-select'
            >
              <MenuItem value=''>All Suppliers</MenuItem>
              {supplierData.map( s => (
                <MenuItem key={s.id} value={String( s.id )}>{s.name}</MenuItem>
              ) )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}
