import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readLiveClass } from '@/db/actions/liveClass'
import { readCustomers } from '@/db/actions/person'
import { formatCurrency } from '../../products/productFormat'
import { formatOccurrenceRange } from '@/utils/basicEventFormat'
import CustomAvatar from '@core/components/mui/Avatar'
import LiveClassDetailActions from './LiveClassDetailActions'
import LiveClassAttendeeEditor from './LiveClassAttendeeEditor'
import OccurrenceEditor from '../../calendar/OccurrenceEditor'
import { formatAddress } from '@/utils/addresses'
import { skuStartDate } from '@/utils/occurrences'

export default async function LiveClassPage( {params} )
{
  const {id} = await params

  const [liveClass, customers] = await Promise.all([
    readLiveClass( id, true ),
    readCustomers(),
  ])

  if( !liveClass )
    return notFound()

  const attendees = liveClass.LiveClassAttendees || []
  const occurrences = liveClass.BasicEvents || []

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64} variant='rounded'>
                  <i className='ri-graduation-cap-line text-2xl' />
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{liveClass.name}</Typography>
                  <Typography color='text.secondary'>{formatOccurrenceRange( occurrences )}</Typography>
                </div>
              </div>
              <LiveClassDetailActions liveClass={liveClass} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Details' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Location</Typography>
                  <Chip label={liveClass.locationType === 'online' ? 'Online' : 'In Person'} variant='tonal' size='small' />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>SKU</Typography>
                  <Typography>{liveClass.sku || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Cost</Typography>
                  <Typography>{formatCurrency( liveClass.cost )}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant='body2' color='text.secondary'>Location Name / Address</Typography>
                  <Typography>{[liveClass.Location?.name, formatAddress( liveClass.Location?.Address )].filter( Boolean ).join( ' — ' ) || '—'}</Typography>
                </Grid>
                {liveClass.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' color='text.secondary'>Notes</Typography>
                    <Typography>{liveClass.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <OccurrenceEditor liveClassId={liveClass.id} occurrences={occurrences} defaultStartDate={skuStartDate( liveClass.sku )} subheader='One or more sessions, each with its own hours' />
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Attendees' />
            <CardContent>
              <LiveClassAttendeeEditor liveClassId={liveClass.id} attendees={attendees} customerOptions={customers} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
