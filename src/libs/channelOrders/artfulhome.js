import { artfulHomeSku } from './artfulhomeSkus.js'
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
// drop-ships to its customer and keeps those in Artist Center - so the
// order is staged `linesComplete: false` for someone to fill in from
// there.
//
// Item numbers are translated to our SKUs through ARTFUL_HOME_SKUS
// (artfulhomeSkus.js), so a mapped line can match its Product like any
// other channel's; the item number is then kept in the description. An
// unmapped item keeps its item number as the line's SKU, unmatched.
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
  const lines = body.split( /^(?=Title\s*:)/m ).slice( 1 ).map( block => {
    const item = value( 'Item', block )
    const variation = value( 'Variation Title', block )
    const sku = artfulHomeSku( item )

    return {
      sku: sku ?? item,
      description: [
        value( 'Title', block )?.replace( /^"(.*)"$/, '$1' ),
        value( 'Description', block ),
        variation,
        sku && item ? `Artful Home item ${item}` : null,
      ].filter( Boolean ).join( ', ' ) || null,
      unitPrice: null,
      quantity: null,
    }
  } )

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
    linesComplete: false,
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
