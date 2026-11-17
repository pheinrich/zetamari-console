// Faire's External API v2, for the parts of an order its email leaves
// out: the email lists at most four lines ("+N more items") and shows
// the payout before Faire's payout fee. GET /orders/{id} returns every
// line (SKU, quantity, wholesale price) and the actual payout costs.
//
// Authenticated with the brand's own API key (Brand Portal → Settings →
// Integrations), FAIRE_API_KEY. The API's order id is the email's order
// number lowercased, prefixed "bo_" ("AJBDYYWBBT" -> "bo_ajbdyywbbt").

const BASE_URL = 'https://www.faire.com/external-api/v2'

const cents = money => (money?.amount_minor ?? 0) / 100

// -> {lines, linesComplete, expectedLineCount, subtotal, discount,
// commission, commissionFee, total, state} in the Channel Order shape
// (see parseIndieMeOrder()). Throws with a readable message on failure.
export async function fetchFaireOrder( externalOrderId )
{
  const key = process.env.FAIRE_API_KEY

  if( !key )
    throw new Error( 'FAIRE_API_KEY is not set' )

  const response = await fetch( `${BASE_URL}/orders/bo_${externalOrderId.toLowerCase()}`, {
    headers: {'X-FAIRE-ACCESS-TOKEN': key},
    cache: 'no-store',
  } )

  if( !response.ok )
    throw new Error( `GET order ${externalOrderId} returned ${response.status}${response.status === 404 ? ' (not found)' : ''}` )

  const order = await response.json()

  // Cancelled lines won't be made or shipped - unless the whole order
  // was cancelled, when they're kept so the order still shows what it was.
  const live = order.items.filter( i => i.state !== 'CANCELED' )
  const items = live.length ? live : order.items

  const lines = items.map( item => ({
    sku: item.sku || null,
    description: [item.product_name, item.variant_name && item.variant_name !== 'default' ? item.variant_name : null].filter( Boolean ).join( ', ' ) || null,
    unitPrice: cents( item.price ?? {amount_minor: item.price_cents} ),
    quantity: item.quantity,
  }) )

  const costs = order.payout_costs ?? {}
  const discount = cents( costs.total_brand_discounts )

  return {
    lines,
    linesComplete: true,
    expectedLineCount: lines.length,
    subtotal: Math.round( lines.reduce( (sum, l) => sum + l.unitPrice * l.quantity, 0 ) * 100 ) / 100,
    discount: discount || null,
    commission: cents( costs.commission ),
    commissionFee: cents( costs.payout_fee ),
    total: costs.total_payout ? cents( costs.total_payout ) : null,
    state: order.state,
  }
}

// Folds the API's order into a parsed Faire order (or a stored Channel
// Order's fields). Faire's payout fee is added to the commission, so
// subtotal - discount - commission still equals the payout (total).
export function withFaireApiOrder( order, api )
{
  const fee = api.commissionFee
  const label = (order.commissionLabel ?? 'Commission').replace( / \+ payout fee$/, '' )

  return {
    ...order,
    lines: api.lines,
    linesComplete: api.linesComplete,
    expectedLineCount: api.expectedLineCount,
    subtotal: api.subtotal,
    discount: api.discount,
    commission: Math.round( (api.commission + fee) * 100 ) / 100,
    commissionLabel: fee ? `${label} + payout fee` : label,
    total: api.total ?? order.total,
  }
}
