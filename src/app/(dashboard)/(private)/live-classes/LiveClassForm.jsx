'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createLiveClass, updateLiveClass } from '@/db/actions/liveClass'
import { dollarInputProps } from '@/utils/units'
import { isBlankDraft, toDatetimes } from '@/utils/occurrences'
import LocationPicker from './LocationPicker'
import OccurrenceTable from '../calendar/OccurrenceTable'

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
  cost: optionalPositiveNumber,
  notes: optionalString,
  occurrences: optionalString,
})

// A new class's occurrences as createLiveClass() takes them (JSON, with
// the datetimes worked out here, in the browser's time zone) - or the
// reason they can't be saved. A complete entry left in the new-entry
// row counts as added; a partly filled one stops the save.
function occurrencesPayload( rows, draft )
{
  const all = isBlankDraft( draft ) ? rows : [...rows, draft]
  const out = []

  for( const row of all )
  {
    const datetimes = toDatetimes( row )

    if( datetimes.error )
      return {error: datetimes.error}

    out.push( {title: row.title.trim(), startDatetime: datetimes.startDatetime.toISOString(), endDatetime: datetimes.endDatetime.toISOString()} )
  }

  return {json: JSON.stringify( out )}
}

export default function LiveClassForm( {initialData={}, locationOptions=[]} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )
  const [location, setLocation] = useState( initialData?.locationName ? {locationName: initialData.locationName, locationAddress: initialData.locationAddress || ''} : null )
  const [locationType, setLocationType] = useState( initialData?.locationType || 'in_person' )

  // New classes only - an existing one's occurrences are edited on its page
  const [occurrences, setOccurrences] = useState( [] )
  const [draft, setDraft] = useState( {} )
  const nextKey = useRef( 0 )
  const payload = useMemo( () => occurrencesPayload( occurrences, draft ), [occurrences, draft] )
  const keyed = drafts => drafts.map( d => ({...d, key: ++nextKey.current}) )

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateLiveClass : data => payload.error ? {error: payload.error} : createLiveClass( data ),
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
                <Grid size={{ xs: 12, sm: 6 }} className='flex flex-col gap-5'>
                  <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1 min-is-0'>
                        <LocationPicker
                          locations={locationOptions}
                          value={location}
                          onChange={setLocation}
                        />
                      </div>
                      <ToggleButtonGroup
                        exclusive
                        color='primary'
                        value={locationType}
                        onChange={(e, value) => value && setLocationType( value )}
                        aria-label='Location type'
                        className='shrink-0'
                      >
                        <ToggleButton value='in_person'>In Person</ToggleButton>
                        <ToggleButton value='online'>Online</ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    <Typography variant='body2' color='text.secondary' className='pis-3'>
                      {location?.locationAddress || (location ? 'No address' : 'Pick a location, or add a new one')}
                    </Typography>
                    <input type='hidden' name='locationName' value={location?.locationName ?? ''} />
                    <input type='hidden' name='locationAddress' value={location?.locationAddress ?? ''} />
                    <input type='hidden' name='locationType' value={locationType} />
                  </div>
                  <TextField
                    label='Cost'
                    name='cost'
                    inputProps={{inputMode: 'decimal', maxLength: 8}}
                    InputProps={dollarInputProps()}
                    defaultValue={initialData?.cost ?? ''}
                    sx={{inlineSize: 135, alignSelf: 'flex-start'}}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} className='flex'>
                  <TextField
                    fullWidth
                    multiline
                    minRows={8}
                    label='Notes'
                    name='notes'
                    defaultValue={initialData?.notes || ''}
                    className='flex-1'
                    slotProps={{input: {className: 'bs-full items-start'}}}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {!isEdit && (
          <Grid size={{ xs: 12 }}>
            <Card>
                <OccurrenceTable
                  subheader='One or more sessions, each with its own hours - or start from a default schedule'
                  rows={occurrences}
                  shortcuts
                  onRowChange={(key, fields) => setOccurrences( list => list.map( o => o.key === key ? {...fields, key} : o ) )}
                  onRemove={key => setOccurrences( list => list.filter( o => o.key !== key ) )}
                  onAdd={fields => setOccurrences( list => [...list, ...keyed( [fields] )] )}
                  onAddMany={drafts => setOccurrences( list => [...list, ...keyed( drafts )] )}
                  onDraftChange={setDraft}
                >
                  <input type='hidden' name='occurrences' value={payload.json ?? '[]'} />
                </OccurrenceTable>
            </Card>
          </Grid>
        )}
      </Grid>
    </form>
  )
}
