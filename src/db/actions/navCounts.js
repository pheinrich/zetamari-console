'use server'

import { unauthorized } from 'next/navigation'

import ChannelOrder from '@/db/models/ChannelOrder'
import InboundEmail from '@/db/models/InboundEmail'
import Shipment from '@/db/models/Shipment'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// The menu's bubbles (hooks/useNavCounts.js):
//   receivedEmails     Inbound Emails still 'received' - arrived, not yet
//                      parsed, ignored or failed (Channels)
//   newChannelOrders   Channel Orders still 'new' - awaiting accept or
//                      dismiss (Inbound)
//   openShipments      Shipments not yet handed off (Outbound)
export async function readNavCounts()
{
  if( !await auth() )
    unauthorized()

  await sequelize.sync()

  const [receivedEmails, newChannelOrders, openShipments] = await Promise.all( [
    InboundEmail.count( {where: {status: 'received'}} ),
    ChannelOrder.count( {where: {status: 'new'}} ),
    Shipment.count( {where: {handedOffAt: null}} ),
  ] )

  return {receivedEmails, newChannelOrders, openShipments}
}
