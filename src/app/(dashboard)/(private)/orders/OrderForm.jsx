'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createOrder } from '@/db/actions/order'
import { customerDisplayName } from '../customers/customerFormat'

const schema = z.object({
  customerId: z.coerce.number().positive( 'Choose a customer' ),
  promisedDate: z.preprocess( val => (val === '' || val == null ? undefined : val), z.string().optional() ),
  lines: z.array( z.object({
    productId: z.coerce.number().positive( 'Choose a product' ),
    quantity: z.coerce.number().positive( 'Quantity must be greater than 0' ),
  }) ).min( 1, 'Add at least one product' ),
})

// Minimal order-intake form: Customer + repeatable Product/quantity
// lines + an optional Promised Date. See CONTEXT.md's Piece entry -
// this is the one place a Piece gets its start: createOrder() (db/
// actions/order.js) spawns one Piece per unit of quantity submitted
// here. Uses formDataToDeepJSON()'s bracket-array convention
// (lines[0][productId], lines[0][quantity], ...) for the repeatable
// rows rather than a per-row round-trip like products/BomEditor.jsx -
// there's no "draft order" to attach lines to before the Order itself
// exists, so everything submits together in one go, same as
// UserForm.jsx's single-submit pattern.
export default function OrderForm( {customerOptions, productOptions} )
{
  const router = useRouter()
  const nextRowKey = useRef( 1 )
  const [rowKeys, setRowKeys] = useState( [0] )
  const [customer, setCustomer] = useState( null )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: createOrder,
  })

  // See ProductForm.jsx for why this is a router.push() effect rather
  // than a render-time redirect() call.
  useEffect( () => {
    if( success )
      router.push( '/orders' )
  }, [success, router] )

  function addRow()
  {
    setRowKeys( keys => [...keys, nextRowKey.current++] )
  }

  function removeRow( key )
  {
    setRowKeys( keys => keys.length > 1 ? keys.filter( k => k !== key ) : keys )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>New Order</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href='/orders'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </Grid>

        <input type='hidden' name='customerId' value={customer?.id ?? ''} />

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Order Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={customerOptions}
                    value={customer}
                    getOptionLabel={option => customerDisplayName( option )}
                    getOptionKey={option => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value) => setCustomer( value )}
                    renderInput={params => <TextField {...params} fullWidth label='Customer' required />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Promised Date (optional)'
                    name='promisedDate'
                    slotProps={{ inputLabel: { shrink: true } }}
                    helperText="Leave blank to let scheduling compute one from the backlog. Set this only when the customer requested a specific date."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Products' />
            <CardContent>
              <Grid container spacing={5}>
                {rowKeys.map( (key, index) => (
                  <Grid key={key} size={{ xs: 12 }} className='flex items-end gap-4'>
                    <FormControl fullWidth>
                      <InputLabel id={`order-line-product-${key}`}>Product</InputLabel>
                      <Select
                        labelId={`order-line-product-${key}`}
                        label='Product'
                        name={`lines[${index}][productId]`}
                        defaultValue=''
                      >
                        <MenuItem value=''>Choose a product</MenuItem>
                        {productOptions.map( p => (
                          <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>
                        ) )}
                      </Select>
                    </FormControl>
                    <TextField
                      type='number'
                      label='Quantity'
                      name={`lines[${index}][quantity]`}
                      defaultValue={1}
                      className='min-is-[140px]'
                      slotProps={{ htmlInput: { min: 1, step: 1 } }}
                    />
                    <IconButton onClick={() => removeRow( key )} disabled={1 === rowKeys.length} aria-label='Remove line'>
                      <i className='ri-delete-bin-7-line' />
                    </IconButton>
                  </Grid>
                ) )}
                <Grid size={{ xs: 12 }}>
                  <Button variant='outlined' onClick={addRow}>Add Product</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
