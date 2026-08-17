import { notFound } from 'next/navigation'

import { readOrder } from '@/db/actions/order'
import { readCustomers } from '@/db/actions/customer'
import OrderEditForm from '../../OrderEditForm'

export default async function EditOrderPage( {params} )
{
  const {id} = await params
  const [order, customers] = await Promise.all( [readOrder( id ), readCustomers()] )

  if( !order )
    return notFound()

  return <OrderEditForm order={order} customerOptions={customers} />
}
