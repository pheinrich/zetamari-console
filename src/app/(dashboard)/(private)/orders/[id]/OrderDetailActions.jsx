'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteOrder } from '@/db/actions/order'

export default function OrderDetailActions( {order} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete()
  {
    if( !confirm( `Delete order #${order.id}? This removes its Pieces and cannot be undone.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteOrder( order.id )
        toast.success( 'Order deleted' )
        router.push( '/orders' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the order' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/orders/${order.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
