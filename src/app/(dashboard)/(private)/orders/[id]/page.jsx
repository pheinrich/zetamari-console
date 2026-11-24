import Link from 'next/link'
import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readOrder, readOrderProductOptions } from '@/db/actions/order'
import { customerDisplayName } from '../../customers/customerFormat'
import { channelLabel, shipDateText } from '../../channel-orders/channelOrderFormat'
import OrderDetailActions from './OrderDetailActions'
import OrderLinesTable from './OrderLinesTable'

const ORIGIN_LABELS = {
  explicit: 'Explicit (customer requested)',
  computed: 'Computed (from backlog)',
  default: 'Default (3 business days after the order)',
}

// An Order: its scheduling dates, and its products - edited in place
// (OrderLinesTable). Customer and Promised Date are changed via Edit.
export default async function OrderPage( {params} )
{
  const {id} = await params
  const [order, products] = await Promise.all( [readOrder( id ), readOrderProductOptions()] )

  if( !order )
    return notFound()

  const shipVia = [...new Set( order.ChannelOrders.map( c => c.shippingMethod ).filter( Boolean ) )]

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-wrap items-center justify-between gap-6'>
            <div className='flex flex-col gap-1'>
              <Typography variant='h4'>Order #{order.id}</Typography>
              <Typography color='text.secondary'>{customerDisplayName( order.Customer )}</Typography>
              {order.ChannelOrders.map( c => (
                <Link key={c.id} href={`/channel-orders/${c.id}`}>
                  From {channelLabel( c.channel )} #{c.externalOrderId}
                </Link>
              ) )}
            </div>
            <div className='flex items-center gap-4'>
              {order.isAtRisk && <Chip color='error' label='At Risk' />}
              <OrderDetailActions order={order} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Scheduling' />
          <CardContent className='flex flex-col gap-3'>
            <Typography><strong>Ship by:</strong> {shipDateText( order.shipDate )}</Typography>
            <Typography><strong>Origin:</strong> {ORIGIN_LABELS[order.shipDateOrigin] ?? 'Not yet set'}</Typography>
            {shipVia.length > 0 && <Typography><strong>Ship via:</strong> {shipVia.join( ', ' )}</Typography>}
            <Typography><strong>Projected Completion Date:</strong> {order.projectedCompletionDate || 'Not yet computed'}</Typography>
            <Typography><strong>Grouting Day:</strong> {order.GroutingDay?.date || 'None (kit-only order, or not yet ready for Grouting)'}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <OrderLinesTable order={order} products={products} />
      </Grid>
    </Grid>
  )
}
