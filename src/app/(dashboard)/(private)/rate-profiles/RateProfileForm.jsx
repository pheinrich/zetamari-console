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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createRateProfile } from '@/db/actions/rateProfile'

const schema = z.object({
  name: z.string().min( 1 ),
})

// Only handles creation - new profiles are always kind='custom' (the two
// system defaults, Wholesale/Retail, are seeded once by migration and
// never created through this form). Editing a profile's name and rates
// both happen together on its detail page (RateProfileEditor.jsx), since
// there's no separate read-only view worth having for something this
// small.
export default function RateProfileForm()
{
  const router = useRouter()
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: createRateProfile,
  })

  // See ProductForm.jsx for why this is a router.push() effect rather
  // than a render-time redirect() call.
  useEffect( () => {
    if( success )
      router.push( '/rate-profiles' )
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>Create Rate Profile</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href='/rate-profiles'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </Grid>

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Profile Information' subheader='Rates for each cost factor can be set on the next page' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Name' name='name' required />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
