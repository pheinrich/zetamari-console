import { notFound } from 'next/navigation'
import CustomerForm from '../../CustomerForm'
import { readCustomer } from '@/db/actions/customer'

export default async function EditCustomerPage( {params} )
{
  const {id} = await params
  const customer = await readCustomer( id )

  if( !customer )
    return notFound()

  return <CustomerForm initialData={customer} />
}
