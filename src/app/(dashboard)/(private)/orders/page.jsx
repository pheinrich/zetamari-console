import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readOrders } from '@/db/actions/order'
import { customerDisplayName } from '../customers/customerFormat'
import tableStyles from '@core/styles/table.module.css'

// Bare list - no filtering/sorting/pagination infra (tanstack table +
// useTableViewState, as products/customers use) yet. This exists to
// navigate to individual orders and verify the recalculation engine's
// output; the real list/kanban/at-risk dashboard is a follow-up.
export default async function OrdersPage()
{
  const orders = await readOrders()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <Typography variant='h4'>Orders</Typography>
          <Button variant='contained' component={NextLink} href='/orders/new'>New Order</Button>
        </div>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title={`${orders.length} order${1 === orders.length ? '' : 's'}`} />
          <CardContent>
            <div className='overflow-x-auto'>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Promised</th>
                    <th>Projected</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map( order => (
                    <tr key={order.id}>
                      <td><NextLink href={`/orders/${order.id}`}>#{order.id}</NextLink></td>
                      <td>{customerDisplayName( order.Customer )}</td>
                      <td>{order.itemCount}</td>
                      <td>{order.promisedDate || '—'}</td>
                      <td>{order.projectedCompletionDate || '—'}</td>
                      <td>{order.isAtRisk && <Chip size='small' color='error' label='At Risk' />}</td>
                    </tr>
                  ) )}
                  {0 === orders.length && (
                    <tr><td colSpan={6}>No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
