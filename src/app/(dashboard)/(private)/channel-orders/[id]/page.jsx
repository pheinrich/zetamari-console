import Link from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readChannelOrder } from '@/db/actions/channelOrder'
import tableStyles from '@core/styles/table.module.css'
import InboundEmailActions from '../../inbound-emails/InboundEmailActions'
import {
  EMAIL_KIND_LABELS, EMAIL_STATUS_COLORS, ORDER_STATUS_COLORS, buyerLabel, channelLabel, dateTime, money,
} from '../channelOrderFormat'
import ChannelOrderActions from './ChannelOrderActions'

function Field( {label, children} )
{
  return <Typography><strong>{label}:</strong> {children || '—'}</Typography>
}

function addressLines( a )
{
  if( !a )
    return []

  return [
    a.company,
    a.name,
    a.street1,
    a.street2,
    [[a.city, a.state].filter( Boolean ).join( ', ' ), a.postalCode].filter( Boolean ).join( ' ' ),
    a.country,
  ].filter( Boolean )
}

// One Channel Order as its channel reported it - see CONTEXT.md's
// Channel Order entry. Lines keep the channel's SKU/description/price;
// "Product" is the console Product the SKU matched exactly, if any.
export default async function ChannelOrderPage( {params} )
{
  const {id} = await params
  const order = await readChannelOrder( id )
  const shipTo = addressLines( order.shipTo )
  const lineSum = order.Lines.reduce( (sum, l) => sum + Number( l.unitPrice ?? 0 ) * Number( l.quantity ?? 0 ), 0 )

  const amounts = [
    ['Item subtotal', order.subtotal],
    ['Shipping', order.shipping],
    ['Discount', order.discount === null ? null : -Number( order.discount )],
    ['Tax', order.tax],
    [order.commissionLabel || 'Commission', order.commission === null ? null : -Number( order.commission )],
    [order.channel === 'faire' ? 'Total (payout)' : 'Total', order.total],
  ].filter( ([, v]) => v !== null && v !== undefined )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-wrap items-center justify-between gap-6'>
            <div className='flex flex-col gap-1'>
              <Typography variant='h4'>{channelLabel( order.channel )} #{order.externalOrderId}</Typography>
              <Typography color='text.secondary'>{buyerLabel( order )}</Typography>
            </div>
            <div className='flex flex-wrap items-center gap-4'>
              <Chip variant='tonal' color={ORDER_STATUS_COLORS[order.status]} label={order.status} />
              {!order.linesComplete && <Chip variant='tonal' color='warning' label='incomplete' />}
              <ChannelOrderActions order={order} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className='bs-full'>
          <CardHeader title='Order' />
          <CardContent className='flex flex-col gap-2'>
            <Field label='Ordered'>{order.orderedOn}</Field>
            <Field label='Requested ship'>{order.requestedShipDate}</Field>
            <Field label='Payment'>{order.paymentType}</Field>
            <Field label='Received'>{dateTime( order.createdAt )}</Field>
            {order.notes && <Field label='Notes'>{order.notes}</Field>}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className='bs-full'>
          <CardHeader title='Buyer' />
          <CardContent className='flex flex-col gap-2'>
            <Field label='Company'>{order.buyerCompany}</Field>
            <Field label='Name'>{order.buyerName}</Field>
            <Field label='Email'>{order.buyerEmail}</Field>
            <Field label='Phone'>{order.buyerPhone}</Field>
            {order.buyerExternalId && <Field label={`${channelLabel( order.channel )} ID`}>{order.buyerExternalId}</Field>}
            <Typography className='mbs-2'><strong>Ship to:</strong></Typography>
            {shipTo.length
              ? shipTo.map( (line, i) => <Typography key={i}>{line}</Typography> )
              : <Typography color='text.secondary'>No shipping address</Typography>}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className='bs-full'>
          <CardHeader title='Amounts' />
          <CardContent className='flex flex-col gap-2'>
            {amounts.length ? amounts.map( ([label, value]) => (
              <div key={label} className='flex justify-between gap-4'>
                <Typography>{label}</Typography>
                <Typography className='font-medium'>{money( value )}</Typography>
              </div>
            ) ) : <Typography color='text.secondary'>The channel didn&apos;t report amounts</Typography>}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title='Lines'
            subheader={!order.linesComplete
              ? `Incomplete: ${order.Lines.length}${order.expectedLineCount ? ` of ${order.expectedLineCount}` : ''} lines, or details missing - fill in from the channel`
              : null}
          />
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr><th>Channel SKU</th><th>Description</th><th>Product</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr>
              </thead>
              <tbody>
                {order.Lines.map( line => (
                  <tr key={line.id}>
                    <td>{line.sku || '—'}</td>
                    <td>{line.description || '—'}</td>
                    <td>
                      {line.Product
                        ? <Link href={`/products/${line.Product.id}`}>{line.Product.name}</Link>
                        : <Chip size='small' variant='tonal' color='warning' label='unmatched' />}
                    </td>
                    <td>{line.quantity ?? '—'}</td>
                    <td>{money( line.unitPrice )}</td>
                    <td>{line.unitPrice !== null && line.quantity !== null ? money( Number( line.unitPrice ) * line.quantity ) : '—'}</td>
                  </tr>
                ) )}
                <tr>
                  <td colSpan={5} className='text-end'><strong>Lines total</strong></td>
                  <td><strong>{money( lineSum )}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Source emails' />
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr><th>Received</th><th>Subject</th><th>Kind</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {order.emails.map( email => (
                  <tr key={email.id}>
                    <td>{dateTime( email.receivedAt )}</td>
                    <td><Link href={`/inbound-emails/${email.id}`}>{email.subject || '(no subject)'}</Link></td>
                    <td>{EMAIL_KIND_LABELS[email.kind] ?? '—'}</td>
                    <td><Chip size='small' variant='tonal' color={EMAIL_STATUS_COLORS[email.status]} label={email.status} /></td>
                    <td><InboundEmailActions email={email} size='small' afterUndoHref='/channel-orders' /></td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
