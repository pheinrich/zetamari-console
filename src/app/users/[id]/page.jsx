import { notFound } from 'next/navigation'
import { readUser } from '@/db/actions/user'

export default async function UserPage( {params} )
{
  const {id} = await params
  const user = await readUser( id )

  if( !user )
    return notFound()
  
  return (
    <div>
      <h1>User Profile: {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
