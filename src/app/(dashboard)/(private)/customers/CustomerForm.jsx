'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createCustomer, updateCustomer } from '@/db/actions/customer'

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )

const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().optional()
)

const optionalType = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.enum( ['wholesale', 'retail'] ).optional()
)

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  firstName: optionalString,
  lastName: optionalString,
  email: optionalString,
  phone: optionalString,
  street1: optionalString,
  street2: optionalString,
  city: optionalString,
  state: optionalString,
  postalCode: optionalString,
  country: optionalString,
  notes: optionalString,
  type: optionalType,
  website: optionalString,
  acceptsEmailMarketing: z.preprocess( (val) => val === 'on' || val === true, z.boolean() ),
  discountPercent: optionalPositiveNumber,
})

// Every field here is optional except the record itself - see the
// 20260807000000-customers.js migration for why: sometimes all Angie has
// is an email address from a mailing list signup, other times everything
// but an email (a cash sale at a show). Nothing here should block a save
// just because a field wasn't captured.
export default function CustomerForm( {initialData={}} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateCustomer : createCustomer
  })

  useEffect( () => {
    if( success )
      router.push( isEdit ? `/customers/${initialData.id}` : '/customers' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Customer</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={isEdit ? `/customers/${initialData.id}` : '/customers'}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Customer'}
              </Button>
            </div>
          </div>
        </Grid>

        {isEdit && <input type='hidden' name='id' value={initialData?.id} />}

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Contact Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='First Name' name='firstName' defaultValue={initialData?.firstName || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Last Name' name='lastName' defaultValue={initialData?.lastName || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Email' name='email' defaultValue={initialData?.email || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Phone' name='phone' defaultValue={initialData?.phone || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Website' name='website' defaultValue={initialData?.website || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id='customer-type-select'>Type</InputLabel>
                    <Select
                      labelId='customer-type-select'
                      label='Type'
                      name='type'
                      defaultValue={initialData?.type || ''}
                    >
                      <MenuItem value=''>Unspecified</MenuItem>
                      <MenuItem value='wholesale'>Wholesale</MenuItem>
                      <MenuItem value='retail'>Retail</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Address' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label='Street 1' name='street1' defaultValue={initialData?.street1 || ''} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label='Street 2' name='street2' defaultValue={initialData?.street2 || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='City' name='city' defaultValue={initialData?.city || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField fullWidth label='State / Province' name='state' defaultValue={initialData?.state || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField fullWidth label='Zip / Postal Code' name='postalCode' defaultValue={initialData?.postalCode || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Country' name='country' defaultValue={initialData?.country || ''} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Marketing & Loyalty' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={<Checkbox name='acceptsEmailMarketing' defaultChecked={!!initialData?.acceptsEmailMarketing} />}
                    label='Accepts email marketing'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Class Discount %'
                    name='discountPercent'
                    inputProps={{step: '1', min: '0', max: '100'}}
                    defaultValue={initialData?.discountPercent ?? ''}
                    helperText='Set automatically to 20% on the 4th class - adjust here any time after that.'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Notes' />
            <CardContent>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Notes'
                name='notes'
                defaultValue={initialData?.notes || ''}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
