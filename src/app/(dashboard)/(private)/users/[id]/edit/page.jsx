import { notFound } from 'next/navigation'
import UserForm from '../../UserForm'
import { readUser } from '@/db/actions/user'

export default async function EditUserPage( {params} )
{
  const {id} = await params
  const user = await readUser( id )
  if( !user )
    return notFound()

  return <UserForm initialData={user} />
}
