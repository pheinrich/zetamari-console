import { artfulHomeWholesale } from './artfulhomePrices.js'
import { clean, dateOnly } from './text.js'

// "New Artful Home Order PO #2103635-AT7859" (since 2025), or the older
// "Purchase order #1876636-AT7859". Not "Purchase Order (…)", which is a
// past-ship-date reminder for an existing order.
export const ARTFUL_HOME_NEW_ORDER_SUBJECT = /^(?:New Artful Home Order PO #|Purchase order #)(\d+-AT\d+)$/

// Artful Home's new-order email is only a pointer to Artist Center: PO
// number, order date, and per item a title ("Golden Meadow"), a
// description ("Mosaic Mirror"), Artful Home's own item number
// ("P07859-P00152" - not a console SKU) and, in newer emails, a
// variation ("Small"). No price, quantity or customer - Artful Home
// drop-ships to its customer and keeps those in Artist Center.
//
// Every unit ordered gets its own item block, though, so quantity is
// implied: identical blocks collapse into one line whose quantity is how
// many times it appears, and the order's lines are complete.
//
// A line's SKU is the item number, as received; it matches its Product
// through a Product Alias (seeded for every listed item by the
// 20261124000000-artful-home-product-aliases.js migration). Its unit
// price is Artful Home's wholesale price, from ARTFUL_HOME_WHOLESALE
// (artfulhomePrices.js), when listed.
export function parseArtfulHomeOrder( text, subject )
{
  const subjectMatch = clean( subject ).match( ARTFUL_HOME_NEW_ORDER_SUBJECT )

  if( !subjectMatch )
    throw new Error( `Not an Artful Home new-order subject: "${subject}"` )

  const body = (text ?? '').replace( /\r\n/g, '\n' )

  const value = (label, from = body) => {
    const match = from.match( new RegExp( `^${label}\\s*:\\s*(.*)$`, 'm' ) )

    return match ? clean( match[1] ) : null
  }

  // Each item starts at its "Title:" line.
  const items = body.split( /^(?=Title\s*:)/m ).slice( 1 ).map( block => {
    const item = value( 'Item', block )
    const variation = value( 'Variation Title', block )

    return {
      sku: item,
      description: [
        value( 'Title', block )?.replace( /^"(.*)"$/, '$1' ),
        value( 'Description', block ),
        variation,
      ].filter( Boolean ).join( ', ' ) || null,
      unitPrice: artfulHomeWholesale( item ),
    }
  } )

  // One line per distinct item, in first-seen order, counting repeats.
  const byKey = new Map()

  for( const item of items )
  {
    const key = `${item.sku}\u0000${item.description}`
    const line = byKey.get( key )

    if( line )
      line.quantity += 1
    else
      byKey.set( key, {...item, quantity: 1} )
  }

  const lines = [...byKey.values()]

  if( !lines.length )
    throw new Error( 'Artful Home order email has no "Title:" items - template may have changed' )

  return {
    channel: 'artfulhome',
    externalOrderId: subjectMatch[1],
    orderedOn: dateOnly( value( 'Order Date' ) ),
    requestedShipDate: null,
    paymentType: null,
    buyer: {company: 'Artful Home', name: null, email: null, phone: null, externalId: null},
    shipTo: null,
    lines,
    linesComplete: true,
    expectedLineCount: lines.length,
    subtotal: null,
    shipping: null,
    discount: null,
    tax: null,
    commission: null,
    total: null,
    notes: null,
  }
}
