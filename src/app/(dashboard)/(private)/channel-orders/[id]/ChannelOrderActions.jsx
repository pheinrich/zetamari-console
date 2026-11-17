'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { refreshChannelOrder, setChannelOrderStatus } from '@/db/actions/channelOrder'

import { channelLabel } from '../channelOrderFormat'

export default function ChannelOrderActions( {order} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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

  if( order.status === 'new' )
    return (
      <div className='flex flex-wrap gap-4'>
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

  return null
}
