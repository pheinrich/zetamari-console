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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createEvent, updateEvent } from '@/db/actions/event'

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  type: z.enum( ['art_show', 'conference'] ),
  name: z.string().min( 1 ),
  address: optionalString,
  phone: optionalString,
  email: optionalString,
  website: optionalString,
  boothNumber: optionalString,
  startDate: optionalString,
  endDate: optionalString,
})

// Deliberately lightweight - see db/actions/event.js. This exists so
// CustomerSource has somewhere real to point for art_show/conference
// sources, ahead of eventually breaking events out into their own fuller
// feature.
export default function EventForm( {initialData={}} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateEvent : createEvent
  })

  useEffect( () => {
    if( success )
      router.push( '/events' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Event</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href='/events'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
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
            <CardHeader title='Event Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id='event-type-select'>Type</InputLabel>
                    <Select
                      labelId='event-type-select'
                      label='Type'
                      name='type'
                      defaultValue={initialData?.type || 'art_show'}
                    >
                      <MenuItem value='art_show'>Art Show</MenuItem>
                      <MenuItem value='conference'>Conference</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Start Date'
                    name='startDate'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={initialData?.startDate || ''}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='End Date'
                    name='endDate'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={initialData?.endDate || ''}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Phone' name='phone' defaultValue={initialData?.phone || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Email' name='email' defaultValue={initialData?.email || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Website' name='website' defaultValue={initialData?.website || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Booth Number' name='boothNumber' defaultValue={initialData?.boothNumber || ''} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label='Address' name='address' defaultValue={initialData?.address || ''} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
