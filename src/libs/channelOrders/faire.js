import * as cheerio from 'cheerio'

import { cityStateZip, clean, dateOnly, money } from './text.js'

export const FAIRE_NEW_ORDER_SUBJECT = /^New (?:wholesale )?order from (.+) \(#([A-Z0-9]+)\)$/

// Faire's "New wholesale order from {retailer} (#{id})" email is a
// teaser, not the order: it shows at most the first four lines and then
// "+N more items", and never includes the retailer's email/phone. So
// this captures what's there and flags the order `linesComplete: false`
// when lines are missing - the full line list has to come from Faire's
// API (or by hand) before the order can be trusted.
//
// The markup is deeply nested generic divs with inline styles, so rather
// than CSS selectors this walks the visible text in document order and
// anchors on its labels ("Shipping Address", "Order Date", "Qty", ...).
export function parseFaireOrder( html, subject )
{
  const subjectMatch = clean( subject ).match( FAIRE_NEW_ORDER_SUBJECT )

  if( !subjectMatch )
    throw new Error( `Not a Faire new-order subject: "${subject}"` )

  const [, retailer, externalOrderId] = subjectMatch
  const tokens = textTokens( html )
  const at = label => tokens.findIndex( t => t === label )
  const after = label => at( label ) >= 0 ? tokens[at( label ) + 1] ?? null : null

  // A template change should fail loudly (the InboundEmail is kept as
  // 'failed' for replay) rather than yield a plausible-looking order
  // read from the wrong tokens.
  const detailsEnd = tokens.findIndex( t => /^Item subtotal \(/.test( t ) )

  for( const label of ['Shipping Address', 'Order Date', 'Order Details'] )
    if( at( label ) < 0 )
      throw new Error( `Faire order email has no "${label}" - template may have changed` )

  if( detailsEnd < 0 )
    throw new Error( 'Faire order email has no "Item subtotal" - template may have changed' )

  // Shipping address: the tokens between its heading and "Order Date".
  const addressLines = tokens.slice( at( 'Shipping Address' ) + 1, at( 'Order Date' ) )
  const cityIndex = addressLines.findIndex( line => cityStateZip( line ) )
  const beforeCity = cityIndex >= 0 ? addressLines.slice( 0, cityIndex ) : addressLines
  const [name, ...rest] = beforeCity
  const company = rest[0] === retailer ? rest.shift() : null

  const shipTo = {
    name: name ?? null,
    company,
    street1: rest[0] ?? null,
    street2: rest[1] ?? null,
    ...(cityIndex >= 0 ? cityStateZip( addressLines[cityIndex] ) : {city: null, state: null, postalCode: null}),
    country: cityIndex >= 0 ? addressLines[cityIndex + 1] ?? null : null,
    phone: null,
    email: null,
  }

  // Line items: each is a run of descriptive tokens (title, variant
  // lines, usually a SKU) followed by Qty/Price/Subtotal headers and
  // their three values.
  const lines = []
  let block = []

  for( let i = at( 'Order Details' ) + 1; i < detailsEnd; i++ )
  {
    if( tokens[i] === 'Qty' && tokens[i + 1] === 'Price' && tokens[i + 2] === 'Subtotal' )
    {
      lines.push( faireLine( block, tokens[i + 3], tokens[i + 4] ) )
      block = []
      i += 5
    }
    else if( !/^\+\d+ more items?$/.test( tokens[i] ) )
      block.push( tokens[i] )
  }

  const moreItems = tokens.map( t => t.match( /^\+(\d+) more items?$/ ) ).find( Boolean )
  const itemCount = Number( tokens[detailsEnd].match( /\((\d+) Items?\)/ )?.[1] ) || null
  const hasCommission = /Commission/.test( tokens[detailsEnd + 1] ?? '' )
  const totalsAt = detailsEnd + (hasCommission ? 2 : 1)

  // Faire's "Total" is the payout after commission - the retailer's
  // wholesale order value is the item subtotal.
  const subtotal = money( tokens[totalsAt] )
  const commission = hasCommission ? Math.abs( money( tokens[totalsAt + 1] ) ?? 0 ) : null

  return {
    channel: 'faire',
    externalOrderId,
    orderedOn: dateOnly( after( 'Order Date' ) ),
    requestedShipDate: after( 'Ship Date' ),
    paymentType: null,
    buyer: {company: retailer, name: shipTo.name, email: null, phone: null, externalId: null},
    shipTo,
    lines,
    linesComplete: !moreItems && (!itemCount || itemCount === lines.length),
    expectedLineCount: itemCount || (moreItems ? lines.length + Number( moreItems[1] ) : lines.length),
    subtotal,
    shipping: null,
    discount: null,
    commission,
    commissionLabel: hasCommission ? tokens[detailsEnd + 1] : null,
    total: money( after( 'Total' ) ),
    notes: null,
  }
}

// A SKU is a single hyphenated token like "ZMRe2428-FrenchDenim" - Faire
// omits the SKU line entirely for products listed without one.
const SKU = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+$/

function faireLine( block, quantity, price )
{
  const sku = block.length > 1 && SKU.test( block[block.length - 1] ) ? block.pop() : null

  return {
    sku,
    description: block.join( ', ' ) || null,
    unitPrice: money( price ),
    quantity: money( quantity ),
  }
}

// Every element's own (direct) text, in document order, cleaned and
// with empties dropped - a flat reading of what a person sees.
function textTokens( html )
{
  const $ = cheerio.load( html )

  $( 'head, style, script' ).remove()

  const tokens = []

  $( 'body *' ).each( (i, el) => {
    const own = clean( $( el ).contents().filter( (j, node) => node.type === 'text' ).text() )

    if( own )
      tokens.push( own )
  } )

  return tokens
}
