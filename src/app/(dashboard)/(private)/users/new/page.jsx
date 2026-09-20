import UserForm from '../UserForm'
import { readRoles } from '@/db/actions/role'

export default async function NewUserPage()
{
  const roles = await readRoles()

  return <UserForm roleOptions={roles} />
}
