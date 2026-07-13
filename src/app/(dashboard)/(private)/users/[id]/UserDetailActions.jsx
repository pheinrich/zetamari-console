'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { deleteUser } from '@/db/actions/user'

export default function UserDetailActions( {user} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete()
  {
    if( !confirm( `Delete ${user.name}? This cannot be undone.` ) )
      return

    startTransition( async () => {
      try
      {
        await deleteUser( user.id )
        toast.success( 'User deleted' )
        router.push( '/users' )
      }
      catch( err )
      {
        toast.error( 'Failed to delete the user' )
      }
    })
  }

  return (
    <div className='flex flex-wrap gap-4'>
      <Button variant='outlined' color='secondary' component={Link} href={`/users/${user.id}/edit`}>
        Edit
      </Button>
      <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
