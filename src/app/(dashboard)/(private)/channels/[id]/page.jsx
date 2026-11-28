import Link from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { readInboundEmail } from '@/db/actions/channelOrder'
import { EMAIL_KIND_LABELS, EMAIL_STATUS_COLORS, channelLabel, dateTime } from '../../channel-orders/channelOrderFormat'
import EmailSourceView from '../EmailSourceView'
import InboundEmailActions from '../InboundEmailActions'

function Field( {label, children} )
{
  return <Typography><strong>{label}:</strong> {children || '—'}</Typography>
}

export default async function InboundEmailPage( {params} )
{
  const {id} = await params
  const email = await readInboundEmail( id )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-wrap items-start justify-between gap-6'>
            <div className='flex flex-col gap-2'>
              <Typography variant='h5'>{email.subject || '(no subject)'}</Typography>
              <Field label='From'>{email.fromAddress}</Field>
              <Field label='Sent'>{dateTime( email.sentAt )}</Field>
              <Field label='Received'>{dateTime( email.receivedAt )}</Field>
              <Field label='Source'>{email.channel ? channelLabel( email.channel ) : null}</Field>
              <Field label='Kind'>{EMAIL_KIND_LABELS[email.kind]}</Field>
              {email.ChannelOrder && (
                <Field label='Channel order'>
                  <Link href={`/channel-orders/${email.ChannelOrder.id}`}>
                    {channelLabel( email.ChannelOrder.channel )} #{email.ChannelOrder.externalOrderId}
                  </Link>
                  {` (${email.ChannelOrder.status})`}
                </Field>
              )}
              {email.error && <Typography color='error'><strong>Error:</strong> {email.error}</Typography>}
            </div>
            <div className='flex flex-col items-end gap-4'>
              <Chip variant='tonal' color={EMAIL_STATUS_COLORS[email.status]} label={email.status} />
              <InboundEmailActions email={email} deletable afterDeleteHref='/channels' />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <EmailSourceView email={email} />
      </Grid>
    </Grid>
  )
}
