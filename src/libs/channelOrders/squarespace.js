import * as cheerio from 'cheerio'

import { cityStateZip, clean, dateOnly, money, phone } from './text.js'

export const SQUARESPACE_NEW_ORDER_SUBJECT = /^.+ : A New Order has Arrived \((\d+)\)$/

// Squarespace Commerce's "A New Order has Arrived" email to the store
// owner (zetamari.com's own shop). Complete: billing and shipping
// addresses, buyer email/phone, and each line's product name, SKU,
// variant, quantity and price.
//
// Class registrations arrive the same way ("January 30-31, 2027 |
// In-person Mosaic Mirror Class | ..."), with no shipping address. For
// now they're staged like any other order and dismissed at review.
export function parseSquarespaceOrder( html, subject )
{
  const subjectMatch = clean( subject ).match( SQUARESPACE_NEW_ORDER_SUBJECT )

  if( !subjectMatch )
    throw new Error( `Not a Squarespace new-order subject: "${subject}"` )

  const $ = cheerio.load( html )
  const externalOrderId = subjectMatch[1]

  $( 'head, style, script' ).remove()

  const header = $( 'th' ).filter( (i, el) => /^(BILLED|SHIPPING) TO:$/.test( clean( $( el ).text() ) ) )
  const itemHeader = $( 'tr' ).filter( (i, el) => $( el ).children( 'td' ).map( (j, td) => clean( $( td ).text() ) ).get().join( '|' ) === 'ITEM|QTY|UNIT PRICE|SUBTOTAL' ).last()

  if( !header.length || !itemHeader.length )
    throw new Error( 'Squarespace order email has no address or item table - template may have changed' )

  // Address cells sit in the row below their "BILLED TO:"/"SHIPPING TO:"
  // headings, one per column.
  const addressCell = heading => {
    const th = header.filter( (i, el) => clean( $( el ).text() ) === heading )

    return th.length ? th.closest( 'tr' ).next( 'tr' ).children( 'td' ).eq( th.index() ) : null
  }

  const billing = parseAddressCell( $, addressCell( 'BILLED TO:' ) )
  const shipping = parseAddressCell( $, addressCell( 'SHIPPING TO:' ) )

  // Item rows: name in the first <span>, then "<br>SKU<br>variant..." in
  // the second (a variant of "None" means the product has none).
  const lines = []
  const totals = {}

  itemHeader.nextAll( 'tr' ).each( (i, tr) => {
    const cells = $( tr ).children( 'td' )
    const spans = cells.eq( 0 ).find( 'span' )

    if( cells.length === 4 && spans.length >= 2 )
    {
      const [sku, ...variants] = brLines( $, spans.eq( 1 ) )

      lines.push( {
        sku: sku ?? null,
        description: [clean( spans.eq( 0 ).text() ), ...variants.filter( v => v !== 'None' )].join( ', ' ),
        unitPrice: money( cells.eq( 2 ).text() ),
        quantity: money( cells.eq( 1 ).text() ),
      } )
    }
    else if( cells.length === 3 && /TOTAL/.test( cells.eq( 1 ).text() ) )
    {
      // Totals: a column of labels beside a column of amounts.
      const labels = brLines( $, cells.eq( 1 ).find( 'div' ).first() )
      const amounts = brLines( $, cells.eq( 2 ).find( 'div' ).first() )

      labels.forEach( (label, j) => { totals[label] = money( amounts[j] ) } )
    }
  } )

  const sum = labels => {
    const found = Object.keys( totals ).filter( labels )

    return found.length ? Math.round( found.reduce( (s, k) => s + (totals[k] ?? 0), 0 ) * 100 ) / 100 : null
  }

  const placed = $( 'td, div' ).map( (i, el) => clean( $( el ).text() ).match( /Placed on (.+?) at / )?.[1] ).get()[0]
  const discount = sum( k => /discount/i.test( k ) )
  const note = $( 'div' ).filter( (i, el) => clean( $( el ).text() ) === 'Note / Additional Info:' ).last().next().text()

  return {
    channel: 'squarespace',
    externalOrderId,
    orderedOn: dateOnly( placed ),
    requestedShipDate: null,
    paymentType: billing?.payment ?? null,
    buyer: {company: null, name: billing?.name ?? null, email: billing?.email ?? null, phone: billing?.phone ?? null, externalId: null},
    shipTo: shipping ? {...shipping.address, phone: billing?.phone ?? null, email: billing?.email ?? null} : null,
    lines,
    linesComplete: true,
    expectedLineCount: lines.length,
    subtotal: totals['Item Subtotal'] ?? null,
    shipping: sum( k => /^Shipping/.test( k ) ),
    discount: discount === null ? null : Math.abs( discount ),
    tax: sum( k => /Tax\b/.test( k ) ),
    commission: null,
    total: totals['TOTAL'] ?? null,
    notes: clean( note ) || null,
  }
}

// The text of an element split at its <br>s, cleaned, empties dropped.
function brLines( $, el )
{
  const copy = $( el ).clone()

  copy.find( 'br' ).replaceWith( '\n' )

  return copy.text().split( '\n' ).map( clean ).filter( Boolean )
}

// "Name / street... / City, ST, ZIP / Country" then, for billing, the
// payment method ("CC: XXXX-4378", "Link", ...), email and phone; for
// shipping, a nested <div> with the shipping method (dropped).
function parseAddressCell( $, cell )
{
  if( !cell?.length )
    return null

  const block = cell.children( 'div' ).first().clone()

  block.children( 'div' ).remove()

  const lines = brLines( $, block )
  const cityIndex = lines.findIndex( line => cityStateZip( line ) )
  const [name, ...street] = cityIndex >= 0 ? lines.slice( 0, cityIndex ) : lines
  const after = cityIndex >= 0 ? lines.slice( cityIndex + 1 ) : []
  const [country, ...rest] = after
  const email = rest.find( l => /@/.test( l ) ) ?? null
  const phoneNumber = rest.map( l => /@/.test( l ) ? null : phone( l ) ).find( Boolean ) ?? null
  const payment = rest.find( l => l !== email && phone( l ) === null ) ?? null

  return {
    name: name ?? null,
    email,
    phone: phoneNumber,
    payment,
    address: {
      name: name ?? null,
      company: null,
      street1: street[0] ?? null,
      street2: street[1] ?? null,
      ...(cityIndex >= 0 ? cityStateZip( lines[cityIndex] ) : {city: null, state: null, postalCode: null}),
      country: country ?? null,
    },
  }
}
