'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteSupplier } from '@/db/actions/supplier'
import { useConfirm } from '@/contexts/confirmContext'

export default function SupplierDetailActions( {supplier} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()

  async function handleDelete()
  {
    if( !await confirm( `Delete ${supplier.name}? This also removes its pricing on all products.`, {confirmText: 'Delete', destructive: true} ) )
      return

    startTransition( async () => {
      try
      {
        await deleteSupplier( supplier.id )
        toast.success( 'Supplier deleted' )
        router.push( '/suppliers' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the supplier' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/suppliers/${supplier.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
