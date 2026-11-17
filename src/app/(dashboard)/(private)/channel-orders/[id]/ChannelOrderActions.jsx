'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { setChannelOrderStatus } from '@/db/actions/channelOrder'

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

  if( order.status === 'new' )
    return (
      <Button variant='outlined' color='secondary' disabled={isPending} onClick={() => setStatus( 'dismissed' )} startIcon={<i className='ri-archive-line' />}>
        Dismiss
      </Button>
    )

  if( order.status === 'dismissed' )
    return (
      <Button variant='outlined' disabled={isPending} onClick={() => setStatus( 'new' )} startIcon={<i className='ri-inbox-unarchive-line' />}>
        Restore
      </Button>
    )

  return null
}
