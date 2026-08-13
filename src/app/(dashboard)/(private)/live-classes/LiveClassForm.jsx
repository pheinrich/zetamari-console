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
import { createLiveClass, updateLiveClass } from '@/db/actions/liveClass'

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )

const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().optional()
)

const schema = z.object({
  id: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().optional() ),
  name: z.string().min( 1 ),
  locationType: z.enum( ['in_person', 'online'] ),
  locationName: optionalString,
  locationAddress: optionalString,
  startDate: z.string().min( 1 ),
  endDate: optionalString,
  cost: optionalPositiveNumber,
  notes: optionalString,
})

export default function LiveClassForm( {initialData={}} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateLiveClass : createLiveClass
  })

  useEffect( () => {
    if( success )
      router.push( isEdit ? `/live-classes/${initialData.id}` : '/live-classes' )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Live Class</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={isEdit ? `/live-classes/${initialData.id}` : '/live-classes'}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Class'}
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
            <CardHeader title='Class Information' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id='location-type-select'>Location Type</InputLabel>
                    <Select
                      labelId='location-type-select'
                      label='Location Type'
                      name='locationType'
                      defaultValue={initialData?.locationType || 'in_person'}
                    >
                      <MenuItem value='in_person'>In Person</MenuItem>
                      <MenuItem value='online'>Online</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Location Name'
                    name='locationName'
                    placeholder='e.g. Angie&apos;s Studio, Zoom, SAMA 2026'
                    defaultValue={initialData?.locationName || ''}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Location Address' name='locationAddress' defaultValue={initialData?.locationAddress || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Start Date'
                    name='startDate'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={initialData?.startDate || ''}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='End Date'
                    name='endDate'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={initialData?.endDate || ''}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Cost'
                    name='cost'
                    inputProps={{step: '0.01', min: '0'}}
                    defaultValue={initialData?.cost ?? ''}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label='Notes'
                    name='notes'
                    defaultValue={initialData?.notes || ''}
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
