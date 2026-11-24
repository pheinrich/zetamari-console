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
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { updateOrder } from '@/db/actions/order'
import { customerDisplayName } from '../customers/customerFormat'
import DateField from '@/components/DateField'

const schema = z.object({
  id: z.coerce.number(),
  customerId: z.coerce.number().positive( 'Choose a customer' ),
  promisedDate: z.preprocess( val => (val === '' || val == null ? undefined : val), z.string().optional() ),
})

// Edits Customer/Promised Date only - line items are edited in place on
// the Order page (orders/[id]/OrderLinesTable.jsx).
export default function OrderEditForm( {order, customerOptions} )
{
  const router = useRouter()
  const [customer, setCustomer] = useState( customerOptions.find( c => c.id === order.customerId ) ?? null )
  const [promisedDate, setPromisedDate] = useState( order.promisedDate || '' )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: updateOrder,
  })

  useEffect( () => {
    if( success )
      router.push( `/orders/${order.id}` )
  }, [success, router, order.id] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>Edit Order #{order.id}</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={`/orders/${order.id}`}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Grid>

        <input type='hidden' name='id' value={order.id} />
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
                    helperText="Clear to ship by default, 3 business days after the order. Set this when the customer asked for a date."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
