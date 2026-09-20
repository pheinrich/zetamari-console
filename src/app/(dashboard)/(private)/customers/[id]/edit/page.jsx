import { notFound } from 'next/navigation'
import CustomerForm from '../../CustomerForm'
import { readCustomer } from '@/db/actions/person'
import { readRoles } from '@/db/actions/role'

export default async function EditCustomerPage( {params} )
{
  const {id} = await params
  const [customer, roles] = await Promise.all( [readCustomer( id ), readRoles()] )

  if( !customer )
    return notFound()

  return <CustomerForm initialData={customer} roleOptions={roles} />
}
