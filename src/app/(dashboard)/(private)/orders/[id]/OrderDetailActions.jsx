'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteOrder } from '@/db/actions/order'
import { useConfirm } from '@/contexts/confirmContext'

export default function OrderDetailActions( {order} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()

  async function handleDelete()
  {
    if( !await confirm( `Delete order #${order.id}? This removes its Pieces and cannot be undone.`, {confirmText: 'Delete', destructive: true} ) )
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
