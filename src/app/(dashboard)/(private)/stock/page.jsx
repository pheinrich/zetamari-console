import { readOrderProductOptions } from '@/db/actions/order'
import { readStock } from '@/db/actions/stock'

import StockTable from './StockTable'

// Inventory -> Stock: how much of each tracked Product is on hand.
export default async function StockPage()
{
  const [stock, products] = await Promise.all( [readStock(), readOrderProductOptions()] )

  return <StockTable stock={stock} products={products} />
}
