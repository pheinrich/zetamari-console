import StockItem from '@/db/models/StockItem'

// Adds `delta` (negative to take away) to a Product's Stock, inside
// `transaction` - only when its stock is tracked; untracked Products are
// left alone. Picking a product that isn't built is held to what's on
// hand (libs/shipments.js's setLinePicked()), but Stock may still go
// below zero - a built product's Piece stepping back out of Ready after
// a hand recount, say - and the Stock page flags it for a recount.
// -> whether the Product is tracked.
export async function adjustStock( productId, delta, transaction )
{
  const item = await StockItem.findOne( {where: {productId}, transaction, lock: transaction.LOCK.UPDATE} )

  if( !item )
    return false

  await item.update( {quantity: Number( item.quantity ) + Number( delta ), updatedAt: new Date()}, {transaction} )

  return true
}
