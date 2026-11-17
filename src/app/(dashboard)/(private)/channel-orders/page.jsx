import { readChannelOrders, readEtsyConnection } from '@/db/actions/channelOrder'
import ChannelOrdersListTable from './ChannelOrdersListTable'

// `?etsy=` is set by /api/etsy/callback after connecting Etsy: "connected",
// or what went wrong.
export default async function ChannelOrdersPage( {searchParams} )
{
  const [orders, etsy, {etsy: etsyOutcome}] = await Promise.all( [readChannelOrders(), readEtsyConnection(), searchParams] )

  return <ChannelOrdersListTable orderData={orders} etsy={etsy} etsyOutcome={etsyOutcome ?? null} />
}
