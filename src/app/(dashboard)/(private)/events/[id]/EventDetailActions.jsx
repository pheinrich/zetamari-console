'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteEvent } from '@/db/actions/event'
import { useConfirm } from '@/contexts/confirmContext'

export default function EventDetailActions( {event} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const confirm = useConfirm()

  async function handleDelete()
  {
    if( !await confirm( `Delete ${event.name}? This also removes its occurrences and unlinks it from any customer sources.`, {confirmText: 'Delete', destructive: true} ) )
      return

    startTransition( async () => {
      try
      {
        await deleteEvent( event.id )
        toast.success( 'Event deleted' )
        router.push( '/events' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the event' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/events/${event.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
