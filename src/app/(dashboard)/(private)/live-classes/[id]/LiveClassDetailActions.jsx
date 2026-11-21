'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteLiveClass } from '@/db/actions/liveClass'
import { useConfirm } from '@/contexts/confirmContext'

export default function LiveClassDetailActions( {liveClass} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()

  async function handleDelete()
  {
    if( !await confirm( `Delete ${liveClass.name}? This also removes its attendee roster.`, {confirmText: 'Delete', destructive: true} ) )
      return

    startTransition( async () => {
      try
      {
        await deleteLiveClass( liveClass.id )
        toast.success( 'Class deleted' )
        router.push( '/live-classes' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the class' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/live-classes/${liveClass.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
