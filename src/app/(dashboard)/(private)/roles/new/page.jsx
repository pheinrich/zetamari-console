import RoleForm from '../RoleForm'
import { readPermissions } from '@/db/actions/permission'

export default async function NewRolePage()
{
  const permissions = await readPermissions()

  return <RoleForm permissionOptions={permissions} />
}
