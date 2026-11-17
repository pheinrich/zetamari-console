import { readChannelOrders } from '@/db/actions/channelOrder'
import ChannelOrdersListTable from './ChannelOrdersListTable'

export default async function ChannelOrdersPage()
{
  const orders = await readChannelOrders()

  return <ChannelOrdersListTable orderData={orders} />
}
