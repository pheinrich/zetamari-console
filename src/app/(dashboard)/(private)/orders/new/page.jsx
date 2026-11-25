import { readOrderProductOptions } from '@/db/actions/order'
import { readCustomers } from '@/db/actions/person'
import OrderForm from '../OrderForm'

// The same products an Order's page offers to add (readOrderProductOptions())
export default async function NewOrderPage()
{
  const [customers, products] = await Promise.all( [readCustomers(), readOrderProductOptions()] )

  return <OrderForm customerOptions={customers} productOptions={products} />
}
