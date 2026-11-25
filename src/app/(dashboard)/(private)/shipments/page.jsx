import { readShipments } from '@/db/actions/shipment'

import ShipmentsListTable from './ShipmentsListTable'

// Customer -> Shipments: every Order's Shipments in one queue.
export default async function ShipmentsPage()
{
  const shipments = await readShipments()

  return <ShipmentsListTable shipments={shipments} />
}
