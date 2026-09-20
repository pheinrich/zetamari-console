import { notFound } from 'next/navigation'
import RoleForm from '../../RoleForm'
import { readRole } from '@/db/actions/role'
import { readPermissions } from '@/db/actions/permission'

export default async function EditRolePage( {params} )
{
  const {id} = await params
  const [role, permissions] = await Promise.all( [readRole( id, true ), readPermissions()] )

  if( !role )
    return notFound()

  return <RoleForm initialData={role} permissionOptions={permissions} />
}
