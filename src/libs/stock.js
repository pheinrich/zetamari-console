import StockItem from '@/db/models/StockItem'

// Adds `delta` (negative to take away) to a Product's Stock, inside
// `transaction` - only when its stock is tracked; untracked Products are
// left alone. Stock may go below zero: a hand count can be behind what's
// actually been picked, and a short count shouldn't stop an order
// shipping - the Stock page shows it so someone recounts. -> whether
// the Product is tracked.
export async function adjustStock( productId, delta, transaction )
{
  const item = await StockItem.findOne( {where: {productId}, transaction, lock: transaction.LOCK.UPDATE} )

  if( !item )
    return false

  await item.update( {quantity: Number( item.quantity ) + Number( delta ), updatedAt: new Date()}, {transaction} )

  return true
}
