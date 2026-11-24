'use client'

import { useState, useTransition } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { refreshChannelOrder, setChannelOrderStatus, unacceptChannelOrder } from '@/db/actions/channelOrder'

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

      if( result.error )
        toast.error( `${apiChannel} API: ${result.error}` )
      else
      {
        toast.success( `Fetched ${result.lineCount} lines from ${apiChannel}` )
        router.refresh()
      }
    } )
  }

  // Back to review: deletes its Order(s), while none of their Pieces is started
  function unaccept()
  {
    startTransition( async () => {
      const result = await unacceptChannelOrder( order.id )

      if( result.error )
        toast.error( result.error )
      else
      {
        const deleted = order.orderIds.map( id => `#${id}` ).join( ', ' )

        toast.success( deleted ? `Order ${deleted} deleted - back to review` : 'Back to review' )
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
        <Button variant='outlined' color='secondary' disabled={isPending} onClick={unaccept} startIcon={<i className='ri-arrow-go-back-line' />}>
          Unaccept
        </Button>
      </div>
    )

  return null
}
