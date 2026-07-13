'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteContour } from '@/db/actions/contour'

export default function ContourDetailActions( {contour} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete()
  {
    if( !confirm( `Delete ${contour.name}? This will fail if it's still referenced by a substrate product.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteContour( contour.id )
        toast.success( 'Contour deleted' )
        router.push( '/contours' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the contour - it may still be in use' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/contours/${contour.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
