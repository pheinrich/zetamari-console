import CustomerForm from '../CustomerForm'
import { readRoles } from '@/db/actions/role'

export default async function NewCustomerPage()
{
  const roles = await readRoles()

  return <CustomerForm roleOptions={roles} />
}
