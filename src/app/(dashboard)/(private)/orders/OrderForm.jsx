'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import NextLink from 'next/link'

import { z } from 'zod'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createOrder } from '@/db/actions/order'
import { customerDisplayName } from '../customers/customerFormat'
import DateField from '@/components/DateField'
import tableStyles from '@core/styles/table.module.css'
import { AddLineRow, ProductCell, QuantitySpinner } from './[id]/OrderLinesTable'

const schema = z.object({
  customerId: z.coerce.number().positive( 'Choose a customer' ),
  promisedDate: z.preprocess( val => (val === '' || val == null ? undefined : val), z.string().optional() ),
  lines: z.array( z.object({
    productId: z.coerce.number().positive( 'Choose a product' ),
    quantity: z.coerce.number().positive( 'Quantity must be greater than 0' ),
  }) ).min( 1, 'Add at least one product' ),
})

// Minimal order-intake form: Customer, products, and an optional Promised
// Date. Products are listed and added the way an Order's page does it
// (OrderLinesTable.jsx): a row always at the foot adds one (adding a
// product already listed adds to its quantity), quantities edit in place,
// and a row's delete button removes it. See CONTEXT.md's Piece entry -
// this is the one place a Piece gets its start: createOrder() (db/
// actions/order.js) spawns one Piece per unit of quantity submitted
// here. The lines are held here and submitted as hidden inputs in
// formDataToDeepJSON()'s bracket-array convention (lines[0][productId],
// lines[0][quantity], ...) rather than saved one at a time like the
// Order page's - there's no "draft order" to attach lines to before the
// Order itself exists, so everything submits together in one go.
export default function OrderForm( {customerOptions, productOptions} )
{
  const router = useRouter()
  const [customer, setCustomer] = useState( null )
  const [promisedDate, setPromisedDate] = useState( '' )
  const [lines, setLines] = useState( [] )   // [{product, quantity}], one per product
  const [addKey, setAddKey] = useState( 0 )   // bumped to reset the add row after each add

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

  // A product already listed gets the quantity added to it, as on an Order's page
  function addLine( product, quantity )
  {
    setLines( prev => prev.some( l => l.product.id === product.id )
      ? prev.map( l => l.product.id === product.id ? {...l, quantity: (Number( l.quantity ) || 0) + quantity} : l )
      : [...prev, {product, quantity}] )

    setAddKey( k => k + 1 )
  }

  function setQuantity( productId, quantity )
  {
    setLines( prev => prev.map( l => l.product.id === productId ? {...l, quantity} : l ) )
  }

  function removeLine( productId )
  {
    setLines( prev => prev.filter( l => l.product.id !== productId ) )
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
                  <DateField
                    fullWidth
                    label='Promised Date (optional)'
                    name='promisedDate'
                    value={promisedDate}
                    onChange={setPromisedDate}
                    clearable
                    slotProps={{inputLabel: {shrink: true}}}
                    helperText="Leave blank to ship by default, 3 business days after the order. Set this when the customer asked for a date."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Products' subheader={lines.length ? `${lines.length} ${lines.length === 1 ? 'product' : 'products'}` : undefined} />
            {lines.map( (line, index) => (
              <span key={line.product.id}>
                <input type='hidden' name={`lines[${index}][productId]`} value={line.product.id} />
                <input type='hidden' name={`lines[${index}][quantity]`} value={line.quantity} />
              </span>
            ) )}
            <div className='overflow-x-auto'>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th className='is-[1%]' />
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Pieces</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!lines.length && (
                    <tr><td colSpan={5} className='text-center'>No products yet</td></tr>
                  )}
                  {lines.map( line => (
                    <tr key={line.product.id}>
                      <td />
                      <td className='min-is-[240px] max-is-[560px] whitespace-normal'>
                        <ProductCell product={line.product} />
                      </td>
                      <td>
                        <QuantitySpinner
                          value={line.quantity === '' ? null : Number( line.quantity )}
                          units={line.product.units}
                          whole={line.product.makesPieces}
                          onValueChange={n => setQuantity( line.product.id, n === null ? '' : n )}
                        />
                      </td>
                      <td>
                        <Typography variant='body2' color='text.secondary'>
                          {line.product.makesPieces ? `${Number( line.quantity ) || 0} to make` : 'Not made here'}
                        </Typography>
                      </td>
                      <td>
                        <Tooltip title='Remove from order'>
                          <IconButton size='small' onClick={() => removeLine( line.product.id )}>
                            <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ) )}
                  <AddLineRow
                    key={addKey}
                    products={productOptions}
                    disabled={loading}
                    autoFocus={addKey > 0}
                    onAdd={addLine}
                  />
                </tbody>
              </table>
            </div>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
