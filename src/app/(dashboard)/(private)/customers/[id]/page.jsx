import Link from 'next/link'
import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readCustomer, readCustomerOrders } from '@/db/actions/customer'
import { readEvents } from '@/db/actions/event'
import { isApronEligible, isDiscountEligible } from '@/libs/customerLoyalty'
import { customerDisplayName, emailMarketingLabel } from '../customerFormat'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomerDetailActions from './CustomerDetailActions'
import CustomerSourceEditor from './CustomerSourceEditor'

export default async function CustomerPage( {params} )
{
  const {id} = await params

  const [customer, orders, events] = await Promise.all([
    readCustomer( id, true ),
    readCustomerOrders( id ),
    readEvents(),
  ])

  if( !customer )
    return notFound()

  const address = [customer.street1, customer.street2].filter( Boolean ).join( ', ' )
  const cityLine = [customer.city, customer.state, customer.postalCode].filter( Boolean ).join( ', ' )

  // Only enrolled/completed seats count toward the apron/discount
  // thresholds - same definition countCustomerClasses() in
  // db/actions/customer.js uses server-side, applied here to the eager-
  // loaded roster instead of a second query.
  const attendances = customer.LiveClassAttendees || []
  const classCount = attendances.filter( a => ['enrolled', 'completed'].includes( a.status ) ).length

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64} variant='rounded'>
                  <i className='ri-user-line text-2xl' />
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{customerDisplayName( customer )}</Typography>
                  {customer.email && <Typography color='text.secondary'>{customer.email}</Typography>}
                </div>
              </div>
              <CustomerDetailActions customer={customer} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Details' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Phone</Typography>
                  <Typography>{customer.phone || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Type</Typography>
                  <Typography>{customer.type ? (customer.type === 'wholesale' ? 'Wholesale' : 'Retail') : '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Company</Typography>
                  <Typography>{customer.company || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Website</Typography>
                  <Typography>
                    {customer.website ? <a href={customer.website} target='_blank' rel='noreferrer'>{customer.website}</a> : '—'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Created</Typography>
                  <Typography>{customer.createdOn || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant='body2' color='text.secondary'>Address</Typography>
                  <Typography>{address || '—'}</Typography>
                  {cityLine && <Typography>{cityLine}</Typography>}
                  {customer.country && <Typography>{customer.country}</Typography>}
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Email Marketing</Typography>
                  <Chip
                    label={emailMarketingLabel( customer.acceptsEmailMarketing )}
                    color={
                      true === customer.acceptsEmailMarketing ? 'success'
                        : false === customer.acceptsEmailMarketing ? 'secondary'
                        : 'default'
                    }
                    variant='tonal'
                    size='small'
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Class Discount</Typography>
                  <Typography>{null != customer.discountPercent ? `${customer.discountPercent}%` : '—'}</Typography>
                </Grid>
                {customer.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' color='text.secondary'>Notes</Typography>
                    <Typography>{customer.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Sources' subheader='Everywhere this customer/contact record has come from' />
            <CardContent>
              <CustomerSourceEditor customerId={customer.id} sources={customer.CustomerSources || []} eventOptions={events} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title='Classes'
              subheader={classCount > 0 ? (
                <div className='flex flex-wrap items-center gap-2 mt-1'>
                  {isApronEligible( classCount ) && <Chip label='Apron eligible' color='success' variant='tonal' size='small' />}
                  {isDiscountEligible( classCount ) && <Chip label='Discount eligible' color='success' variant='tonal' size='small' />}
                </div>
              ) : undefined}
            />
            <CardContent>
              {0 === attendances.length ? (
                <Typography color='text.secondary'>Hasn&apos;t attended any live classes yet.</Typography>
              ) : (
                <div className='flex flex-col gap-3'>
                  {attendances.map( attendance => (
                    <div key={attendance.id} className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <Link href={`/live-classes/${attendance.LiveClass?.id}`}>{attendance.LiveClass?.name}</Link>
                        <Typography variant='caption' color='text.secondary'>{attendance.LiveClass?.startDate}</Typography>
                      </div>
                      <Chip label={attendance.status} variant='tonal' size='small' />
                    </div>
                  ) )}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Order History' />
            <CardContent>
              {0 === orders.length ? (
                <Typography color='text.secondary'>No orders yet.</Typography>
              ) : (
                <div className='flex flex-col gap-3'>
                  {orders.map( order => (
                    <div key={order.id} className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        {/* No standalone /orders/[id] admin page exists yet in
                            this app (only the demo apps/ecommerce/orders
                            section) - shown as plain text rather than a
                            dead link until that page exists. */}
                        <Typography className='font-medium'>Order #{order.id}</Typography>
                        <Typography variant='caption' color='text.secondary'>{order.createdOn}</Typography>
                      </div>
                      <Typography color='text.secondary'>{order.itemCount} item{1 === order.itemCount ? '' : 's'}</Typography>
                    </div>
                  ) )}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
