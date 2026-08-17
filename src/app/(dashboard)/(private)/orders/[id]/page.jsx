import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readOrder } from '@/db/actions/order'
import { customerDisplayName } from '../../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'

function originLabel( origin )
{
  if( 'explicit' === origin )
    return 'Explicit (customer requested)'
  if( 'computed' === origin )
    return 'Computed (from backlog)'

  return 'Not yet set'
}

// Read-only - enough to see the recalculation engine's output (Promised
// Date/origin, Projected Completion Date, at-risk state, assigned
// Grouting Day) without the kanban/at-risk-list UI, which is deferred to
// a follow-up. See the implementation plan's Verification section.
export default async function OrderPage( {params} )
{
  const {id} = await params
  const order = await readOrder( id )

  if( !order )
    return notFound()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-wrap items-center justify-between gap-6'>
            <div className='flex flex-col gap-1'>
              <Typography variant='h4'>Order #{order.id}</Typography>
              <Typography color='text.secondary'>{customerDisplayName( order.Customer )}</Typography>
            </div>
            {order.isAtRisk && <Chip color='error' label='At Risk' />}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Scheduling' />
          <CardContent className='flex flex-col gap-3'>
            <Typography><strong>Promised Date:</strong> {order.promisedDate || 'Not yet computed'}</Typography>
            <Typography><strong>Origin:</strong> {originLabel( order.promisedDateOrigin )}</Typography>
            <Typography><strong>Projected Completion Date:</strong> {order.projectedCompletionDate || 'Not yet computed'}</Typography>
            <Typography><strong>Grouting Day:</strong> {order.GroutingDay?.date || 'None (kit-only order, or not yet ready for Grouting)'}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Pieces by Phase' />
          <CardContent className='flex flex-col gap-2'>
            {Object.keys( order.pieceCountsByPhase ).length === 0 && <Typography color='text.secondary'>No pieces.</Typography>}
            {Object.entries( order.pieceCountsByPhase ).map( ([phase, count]) => (
              <Typography key={phase}>{phase}: {count}</Typography>
            ) )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Products' />
          <CardContent>
            <div className='overflow-x-auto'>
              <table className={tableStyles.table}>
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Quantity</th></tr>
                </thead>
                <tbody>
                  {order.lines.map( line => (
                    // OrderProduct has no id column (see its model's
                    // doc comment) - orderId+productId is unique per
                    // line in practice.
                    <tr key={`${line.orderId}-${line.productId}`}>
                      <td>{line.Product?.name}</td>
                      <td>{line.Product?.sku}</td>
                      <td>{line.quantity}</td>
                    </tr>
                  ) )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
