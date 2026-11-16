import * as cheerio from 'cheerio'

import { cityStateZip, clean, dateOnly, money, phone } from './text.js'

// IndieMe ("New IndieMe Marketplace Store Order", from service@indieme.com)
// sends the complete order in the email: header fields, bill-to and
// ship-to blocks, every line with its SKU, and totals. The markup is a
// plain table layout that's been stable since at least 2021, so fields
// are found by their visible labels rather than by position.
export function parseIndieMeOrder( html )
{
  const $ = cheerio.load( html )

  const labelled = label => {
    const td = $( 'td' ).filter( (i, el) => clean( $( el ).text() ).replace( /:$/, '' ) === label ).first()


    return td.length ? clean( td.next( 'td' ).text() ) : null
  }

  const externalOrderId = labelled( 'ORDER #' )

  if( !externalOrderId )
    throw new Error( 'IndieMe email has no ORDER # - template may have changed' )

  // Both address blocks are the innermost cells carrying a "Buyer #" line
  // - the first is INVOICE TO, the second SHIP TO.
  const addressCells = $( 'td' ).filter( (i, el) => !$( el ).find( 'td' ).length && /Buyer #\d+/.test( $( el ).text() ) )
  const billTo = parseAddressBlock( $, addressCells.eq( 0 ) )
  const {externalId, ...shipTo} = addressCells.length > 1 ? parseAddressBlock( $, addressCells.eq( 1 ) ) : billTo

  const lines = []

  $( 'tr' ).each( (i, tr) => {
    const cells = $( tr ).children( 'td' )
    const product = cells.filter( (j, td) => $( td ).children( 'i' ).first().text().trim() === 'sku' ).first()

    if( !product.length )
      return

    const description = clean( product.find( 'span' ).first().text() )
    const sku = clean( product.clone().children( 'i, span' ).remove().end().text() )
    const rest = product.nextAll( 'td' )

    lines.push( {
      sku: sku || null,
      description: description || null,
      unitPrice: money( rest.eq( 0 ).text() ),
      quantity: money( rest.eq( 1 ).text() ),
    } )
  } )

  const shipDate = $( 'td' ).filter( (i, el) => /^REQUESTED SHIP DATE/.test( clean( $( el ).text() ) ) ).first()
  const notesRow = $( 'h3' ).filter( (i, el) => /Notes\/Comments/i.test( $( el ).text() ) ).closest( 'tr' ).next( 'tr' )

  return {
    channel: 'indieme',
    externalOrderId,
    orderedOn: dateOnly( labelled( 'ORDER DATE' ) ),
    requestedShipDate: clean( shipDate.text() ).replace( /^REQUESTED SHIP DATE\s*/, '' ) || null,
    paymentType: labelled( 'PAYMENT TYPE' ) || null,
    buyer: {
      company: billTo.company,
      name: billTo.name,
      email: billTo.email,
      phone: billTo.phone,
      externalId: billTo.externalId,
    },
    shipTo,
    lines,
    linesComplete: true,
    expectedLineCount: lines.length,
    subtotal: money( labelled( 'SubTotal' ) ),
    shipping: money( labelled( 'Shipping' ) ),
    discount: money( labelled( 'Discount' ) ),
    commission: null,
    total: money( labelled( 'Total' ) ),
    notes: clean( notesRow.text() ) || null,
  }
}

// One <br>-separated address cell: company, contact name, "Buyer #NNN",
// street line(s), "City, ST 12345", country, "(Work)"/"(cell)" phones,
// a mailto link, and on the bill-to block a trailing "Payment Type:".
function parseAddressBlock( $, cell )
{
  const block = {company: null, name: null, externalId: null, street1: null, street2: null, city: null, state: null, postalCode: null, country: null, phone: null, email: null}

  if( !cell.length )
    return block

  block.email = clean( cell.find( 'a[href^="mailto:"]' ).first().text() ) || null

  const plain = []
  const parts = (cell.html() ?? '').split( /<br\s*\/?>/i ).map( h => clean( cheerio.load( h ).text() ) ).filter( Boolean )

  for( const part of parts )
  {
    let match

    if( (match = part.match( /^Buyer #(\d+)/ )) )
      block.externalId = match[1]
    else if( (match = part.match( /^\((?:work|cell|ph)\)\s*(.*)$/i )) )
      block.phone ??= phone( match[1] )
    else if( /^Payment Type:/i.test( part ) || part === block.email )
      continue
    else if( cityStateZip( part ) )
      Object.assign( block, cityStateZip( part ) )
    else if( block.postalCode && /^[A-Za-z .]{2,}$/.test( part ) )
      block.country = part
    else
      plain.push( part )
  }

  // Whatever's left, in order: company, contact name, then street lines.
  block.company = plain[0] ?? null
  block.name = plain[1] ?? null
  block.street1 = plain[2] ?? null
  block.street2 = plain[3] ?? null

  return block
}
