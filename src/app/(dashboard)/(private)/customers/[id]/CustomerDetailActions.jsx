'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteCustomer } from '@/db/actions/customer'
import { customerDisplayName } from '../customerFormat'

export default function CustomerDetailActions( {customer} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete()
  {
    if( !confirm( `Delete ${customerDisplayName( customer )}? This also removes their sources and class attendance history.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteCustomer( customer.id )
        toast.success( 'Customer deleted' )
        router.push( '/customers' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the customer' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/customers/${customer.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
