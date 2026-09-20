import { notFound } from 'next/navigation'
import UserForm from '../../UserForm'
import { readUser } from '@/db/actions/person'
import { readRoles } from '@/db/actions/role'

export default async function EditUserPage( {params} )
{
  const {id} = await params
  const [user, roles] = await Promise.all( [readUser( id, true ), readRoles()] )

  if( !user )
    return notFound()

  return <UserForm initialData={user} roleOptions={roles} />
}
