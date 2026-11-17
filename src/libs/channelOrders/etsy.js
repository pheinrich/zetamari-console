import { cityStateZip, clean, money, pacificDate } from './text.js'

export const ETSY_NEW_ORDER_SUBJECT = /^You made a sale on Etsy - Ship by (.+?) - \[\$[\d,.]+, Order #(\d+)\]$/

// Etsy's "You made a sale on Etsy" email. Its plain-text part is the
// cleanest source - labelled "Key: value" lines - so that's what's read
// here, not the HTML. Everything about the order is present except SKUs:
// items are named only by listing title (plus any variation lines), so
// every line arrives unmatched and is resolved at review.
//
// The order date isn't in the text, only the send time, which Etsy sends
// within seconds of the sale - hence `date` (the email's Date header).
export function parseEtsyOrder( text, subject, date )
{
  const subjectMatch = clean( subject ).match( ETSY_NEW_ORDER_SUBJECT )

  if( !subjectMatch )
    throw new Error( `Not an Etsy new-order subject: "${subject}"` )

  const [, shipBy, externalOrderId] = subjectMatch
  const body = (text ?? '').replace( /\r\n/g, '\n' )

  if( !/^Transaction ID:/m.test( body ) )
    throw new Error( 'Etsy order email has no "Transaction ID" lines - template may have changed' )

  const value = label => {
    const match = body.match( new RegExp( `^${label}:[ \\t]*(.*)$`, 'm' ) )

    return match ? clean( match[1] ) : null
  }

  // Each item is a blank-line-separated block starting "Transaction ID:".
  // Lines other than the known four (e.g. "Size: Large", personalization)
  // are variation details, kept with the description.
  const lines = body.split( /\n[ \t]*\n/ )
    .filter( block => /^\s*Transaction ID:/.test( block ) )
    .map( block => {
      const fields = block.trim().split( '\n' ).map( l => l.match( /^([^:]+):\s*(.*)$/ ) ).filter( Boolean )
      const get = key => clean( fields.find( f => f[1] === key )?.[2] )
      const details = fields.filter( f => !['Transaction ID', 'Item', 'Quantity', 'Item price'].includes( f[1] ) ).map( f => clean( `${f[1]}: ${f[2]}` ) )

      return {
        sku: null,
        description: [get( 'Item' ), ...details].filter( Boolean ).join( ', ' ) || null,
        unitPrice: money( get( 'Item price' ) ),
        quantity: money( get( 'Quantity' ) ),
      }
    } )

  // "Note from {buyer's Etsy username}:" heads the buyer's note.
  const noteMatch = body.match( /^Note from (.+):\n-+\n\n([\s\S]*?)\n\n-{10,}/m )
  const note = clean( noteMatch?.[2] )

  // The shipping address is Etsy's hCard HTML, verbatim inside the text.
  const span = name => {
    const match = body.match( new RegExp( `<span class='${name}'>([^<]*)</span>` ) )

    return match ? clean( match[1] ) : null
  }

  const cityLine = `${span( 'city' ) ?? ''}, ${span( 'state' ) ?? ''} ${span( 'zip' ) ?? ''}`

  const shipTo = {
    name: span( 'name' ),
    company: null,
    street1: span( 'first-line' ),
    street2: span( 'second-line' ),
    ...(cityStateZip( cityLine ) ?? {city: span( 'city' ), state: span( 'state' ), postalCode: span( 'zip' )}),
    country: span( 'country-name' ),
    phone: null,
    email: null,
  }

  const email = body.match( /^\* Email (\S+@\S+)$/m )?.[1] ?? null
  const discount = money( value( 'Discount' ) )

  return {
    channel: 'etsy',
    externalOrderId,
    orderedOn: pacificDate( date ),
    requestedShipDate: shipBy,
    paymentType: null,
    buyer: {company: null, name: shipTo.name, email, phone: null, externalId: noteMatch ? clean( noteMatch[1] ) : null},
    shipTo,
    lines,
    linesComplete: true,
    expectedLineCount: lines.length,
    subtotal: money( value( 'Item total' ) ),
    shipping: money( value( 'Shipping' )?.replace( /\(.*\)$/, '' ) ),
    discount: discount === null ? null : Math.abs( discount ),
    tax: money( value( 'Sales Tax' ) ),
    commission: null,
    total: money( value( 'Order Total' ) ),
    notes: note && note !== 'The buyer did not leave a note.' ? note : null,
  }
}
