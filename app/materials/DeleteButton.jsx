'use client'

import { useTransition } from 'react'
import { deleteMaterial } from '@/db/actions/material'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function DeleteButton( {id} )
{
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete()
  {
    const confirmed = confirm( 'Are you sure you want to delete this material?' )
    if( !confirmed )
      return

    startTransition( async () => {
      try
      {
        const formData = new FormData()
        formData.append( 'id', String( id ) )
        await deleteMaterial( formData )
        toast.success( 'Material deleted' )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to delete material' )
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}