import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readEvent } from '@/db/actions/event'
import { readPeople } from '@/db/actions/person'
import { formatOccurrenceRange } from '@/utils/basicEventFormat'
import CustomAvatar from '@core/components/mui/Avatar'
import EventDetailActions from './EventDetailActions'
import OccurrenceEditor from '../../calendar/OccurrenceEditor'

export default async function EventPage( {params} )
{
  const {id} = await params

  const [event, people] = await Promise.all([
    readEvent( id, true ),
    readPeople(),
  ])

  if( !event )
    return notFound()

  const occurrences = event.BasicEvents || []

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64} variant='rounded'>
                  <i className={event.type === 'conference' ? 'ri-mic-line text-2xl' : 'ri-palette-line text-2xl'} />
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{event.name}</Typography>
                  <Typography color='text.secondary'>{formatOccurrenceRange( occurrences )}</Typography>
                </div>
              </div>
              <EventDetailActions event={event} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Details' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Type</Typography>
                  <Chip label={event.type === 'conference' ? 'Conference' : 'Art Show'} variant='tonal' size='small' />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Booth Number</Typography>
                  <Typography>{event.boothNumber || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Phone</Typography>
                  <Typography>{event.phone || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Email</Typography>
                  <Typography>{event.email || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant='body2' color='text.secondary'>Website</Typography>
                  <Typography>
                    {event.website ? <a href={event.website} target='_blank' rel='noreferrer'>{event.website}</a> : '—'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='text.secondary'>Address</Typography>
                  <Typography>{event.address || '—'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Occurrences' subheader='One or more days, each with its own hours' />
            <CardContent>
              <OccurrenceEditor eventId={event.id} occurrences={occurrences} personOptions={people} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
