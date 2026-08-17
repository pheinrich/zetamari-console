import { readOrders } from '@/db/actions/order'
import OrdersListTable from './OrdersListTable'

export default async function OrdersPage()
{
  const orders = await readOrders()

  return <OrdersListTable orderData={orders} />
}
