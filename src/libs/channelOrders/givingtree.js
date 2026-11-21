import { cityStateZip, clean, pacificDate, phone } from './text.js'

// "Drop Ship Order for Margot Gold PO187571", also seen as "Drop Ship
// order for …" and "… PO#182613".
export const GIVING_TREE_NEW_ORDER_SUBJECT = /^Drop Ship order for (.+?)\s+PO\s*#?\s*(\d+)$/i

// The Giving Tree Gallery (Sarasota, FL) drop-ships: it buys at
// wholesale and has us ship straight to its customer. Its order emails
// are written by hand in Gmail (by Alma, from info@thegivingtreegallery.com),
// so there's no template - just a habit that's held across every one
// seen so far (2026-01 to 2026-11):
//
//   Hello Angie,
//   Here is one new drop ship order for the mirror below.
//   [image: …]
//   ______________________________
//
//   *1 Mosaic Round Mirror - Seafoam Drop - 30"*      <- one line per item:
//                                                         quantity, then name
//   Margot Gold                                        <- ship-to: name,
//   16108 Fortezza Drive                                  street line(s),
//   Bradenton, FL 34211                                   city/state/ZIP,
//   914-584-5632                                          phone
//   ______________________________
//
// Items are named the way the gallery's own site lists them, with no
// SKU or price, so every line arrives unmatched for a person to match
// (suggestions rank on the description). The PO number comes from the
// subject; the order date is when the email was sent.
export function parseGivingTreeOrder( text, subject, date )
{
  const subjectMatch = clean( subject ).match( GIVING_TREE_NEW_ORDER_SUBJECT )

  if( !subjectMatch )
    throw new Error( `Not a Giving Tree Gallery new-order subject: "${subject}"` )

  // The order sits between the first two rules of underscores. Gmail's
  // plain-text part marks bold as *…*, which is all the stars are.
  const sections = (text ?? '').replace( /\r\n/g, '\n' ).split( /^\s*_{5,}\s*$/m )

  if( sections.length < 3 )
    throw new Error( 'Giving Tree Gallery email has no ____ ruled order block - wording may have changed' )

  const rows = sections[1].split( '\n' ).map( l => clean( l.replace( /\*/g, '' ) ) ).filter( Boolean )

  const lines = []
  const address = []

  for( const row of rows )
  {
    const item = !address.length && row.match( /^(\d+)\s*[x×]?\s+(.+)$/i )

    if( item )
      lines.push( {sku: null, description: item[2], unitPrice: null, quantity: Number( item[1] )} )
    else
      address.push( row )
  }

  if( !lines.length )
    throw new Error( 'Giving Tree Gallery email lists no "<quantity> <item>" lines - wording may have changed' )

  return {
    channel: 'givingtree',
    externalOrderId: subjectMatch[2],
    orderedOn: pacificDate( date ),
    requestedShipDate: null,
    paymentType: null,
    buyer: {company: 'The Giving Tree Gallery', name: null, email: null, phone: null, externalId: null},
    shipTo: parseShipTo( address, subjectMatch[1] ),
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

// ["Margot Gold", "16108 Fortezza Drive", "Bradenton, FL 34211",
// "914-584-5632"] -> a ship-to block. The name defaults to the one in
// the subject; street lines are whatever sits between it and the
// city/state/ZIP line.
function parseShipTo( rows, subjectName )
{
  const block = {company: null, name: clean( subjectName ) || null, street1: null, street2: null, city: null, state: null, postalCode: null, country: null, phone: null, email: null}
  const streets = []

  rows.forEach( (row, i) => {
    const place = cityStateZip( row )

    if( place )
      Object.assign( block, place, {country: 'US'} )
    else if( !block.postalCode && 0 === i )
      block.name = row
    else if( block.postalCode && phone( row ) && !/[a-z]{3}/i.test( row ) )
      block.phone ??= phone( row )
    else if( !block.postalCode )
      streets.push( row )
  } )

  block.street1 = streets[0] ?? null
  block.street2 = streets.slice( 1 ).join( ', ' ) || null

  return block
}
