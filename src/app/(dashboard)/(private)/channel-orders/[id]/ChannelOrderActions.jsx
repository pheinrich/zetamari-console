'use client'

import { useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { refreshChannelOrder, setChannelOrderStatus, unacceptChannelOrder } from '@/db/actions/channelOrder'
import { announceNavCountsChanged } from '@/hooks/useNavCounts'

import { channelLabel } from '../channelOrderFormat'
import AcceptDialog from './AcceptDialog'

export default function ChannelOrderActions( {order} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [accepting, setAccepting] = useState( false )

  function setStatus( status )
  {
    startTransition( async () => {
      const result = await setChannelOrderStatus( order.id, status )

      announceNavCountsChanged()

      if( result.error )
        toast.error( result.error )
      else
      {
        toast.success( status === 'dismissed' ? 'Order dismissed' : 'Order restored to new' )
        router.refresh()
      }
    } )
  }

  const apiChannel = ['faire', 'etsy'].includes( order.channel ) ? channelLabel( order.channel ) : null

  function fetchFromApi()
  {
    startTransition( async () => {
      const result = await refreshChannelOrder( order.id )

      announceNavCountsChanged()

      if( result.error )
        toast.error( `${apiChannel} API: ${result.error}` )
      else
      {
        toast.success( `Fetched ${result.lineCount} lines from ${apiChannel}` )
        router.refresh()
      }
    } )
  }

  // Back to review: deletes its Order(s), while none of their Pieces is
  // started, and the class seats it enrolled
  function unaccept()
  {
    startTransition( async () => {
      const result = await unacceptChannelOrder( order.id )

      announceNavCountsChanged()

      if( result.error )
        toast.error( result.error )
      else
      {
        const deleted = [
          result.orderIds?.length && `Order ${result.orderIds.map( id => `#${id}` ).join( ', ' )}`,
          result.seatCount && `${result.seatCount} class seat${result.seatCount === 1 ? '' : 's'}`,
        ].filter( Boolean ).join( ' and ' )

        toast.success( deleted ? `${deleted} deleted - back to review` : 'Back to review' )
        router.refresh()
      }
    } )
  }

  if( order.status === 'new' )
    return (
      <div className='flex flex-wrap gap-4'>
        <Button variant='contained' disabled={isPending} onClick={() => setAccepting( true )} startIcon={<i className='ri-checkbox-circle-line' />}>
          Accept
        </Button>
        <AcceptDialog order={order} open={accepting} onClose={() => setAccepting( false )} />
        {apiChannel && (
          <Button variant='outlined' disabled={isPending} onClick={fetchFromApi} startIcon={<i className='ri-download-cloud-2-line' />}>
            Fetch from {apiChannel}
          </Button>
        )}
        <Button variant='outlined' color='secondary' disabled={isPending} onClick={() => setStatus( 'dismissed' )} startIcon={<i className='ri-archive-line' />}>
          Dismiss
        </Button>
      </div>
    )

  if( order.status === 'dismissed' )
    return (
      <Button variant='outlined' disabled={isPending} onClick={() => setStatus( 'new' )} startIcon={<i className='ri-inbox-unarchive-line' />}>
        Restore
      </Button>
    )

  if( order.status === 'accepted' )
    return (
      <div className='flex flex-wrap gap-4'>
        {order.orderIds.map( id => (
          <Button key={id} component={Link} href={`/orders/${id}`} variant='outlined' startIcon={<i className='ri-file-list-3-line' />}>
            Order #{id}
          </Button>
        ) )}
        {order.liveClassIds.map( id => (
          <Button key={`class${id}`} component={Link} href={`/live-classes/${id}`} variant='outlined' startIcon={<i className='ri-graduation-cap-line' />}>
            Class #{id}
          </Button>
        ) )}
        <Button variant='outlined' color='secondary' disabled={isPending} onClick={unaccept} startIcon={<i className='ri-arrow-go-back-line' />}>
          Unaccept
        </Button>
      </div>
    )

  return null
}
