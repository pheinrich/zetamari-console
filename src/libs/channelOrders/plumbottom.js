import { clean, pacificDate, phone } from './text.js'

// "Drop Ship" or "Special Order" - the only subjects Plum Bottom's order
// emails have used. Anything else from the gallery (replies, invoices,
// questions) is just correspondence.
export const PLUM_BOTTOM_NEW_ORDER_SUBJECT = /^(?:Drop Ship|Special Order)\b/i

// Plum Bottom Gallery (Hannah, from plumbottomgallery.com) orders by
// writing a short note by hand, and no two read alike:
//
//   "I have a drop shipping order for you for 2x sapphire mirrors 10”.
//    Please ship to the address below. … Peggy Wooten, 329 Standing
//    Stone Drive, Waukesha Wisconsin 53189, United States, (414) 840-6242"
//
//   "The customer would like a golden leaf oval mirror in a 12” x 15”. …
//    SHIP TO:
//    Judith Bergquist, 3445 MUIRWOOD DR, Brookfield Wisconsin 53045, …"
//
//   "The customer would like 1x 16 x 18 Cinnamon Sage leaf mirror.
//    Please ship to the gallery when ready!"
//
// There's no order number, no SKU, no price, and the item and address
// sit wherever the sentence puts them. So this is best-effort and never
// trusted: it pulls out what it can - the requested item as one line
// (quantity from "2x", or 1 for "a …"), and a ship-to address - always
// flags the order incomplete, and keeps the message itself as the
// order's notes for the reviewer to check against. Since there's no
// order number, the email's send time stands in for one, so reparsing
// the same email updates the same Channel Order.
export function parsePlumBottomOrder( text, subject, date )
{
  if( !PLUM_BOTTOM_NEW_ORDER_SUBJECT.test( clean( subject ) ) )
    throw new Error( `Not a Plum Bottom Gallery order subject: "${subject}"` )

  const sent = date ? new Date( date ) : null

  if( !sent || Number.isNaN( sent.getTime() ) )
    throw new Error( 'Plum Bottom Gallery email has no Date - needed in place of an order number' )

  const message = messageBody( text )

  if( !message )
    throw new Error( 'Plum Bottom Gallery email has no message text' )

  const prose = clean( message )
  const shipsToGallery = /ship (?:it )?to the gallery/i.test( prose )

  return {
    channel: 'plumbottom',
    externalOrderId: sent.toISOString().replace( /\.\d+Z$/, 'Z' ),   // "2026-07-09T21:16:38Z"
    orderedOn: pacificDate( sent ),
    requestedShipDate: null,
    paymentType: null,
    buyer: {company: 'Plum Bottom Gallery', name: null, email: null, phone: null, externalId: null},
    shipTo: shipsToGallery ? null : findShipTo( message ),
    lines: [requestedItem( prose )],
    linesComplete: false,
    expectedLineCount: null,
    subtotal: null,
    shipping: null,
    discount: null,
    tax: null,
    commission: null,
    total: null,
    notes: [shipsToGallery && 'Ship to the gallery.', message].filter( Boolean ).join( '\n\n' ),
  }
}

// The note itself: past the greeting, up to the signature ("—" / "--"
// on its own line) or the closing "Thanks!"/"Hannah" sign-off.
function messageBody( text )
{
  const lines = (text ?? '').replace( /\r\n/g, '\n' ).split( '\n' )
  const end = lines.findIndex( l => /^\s*(?:—|--)\s*$/.test( l ) )

  const kept = (end === -1 ? lines : lines.slice( 0, end ))
    .map( l => l.trimEnd() )
    .filter( (l, i) => !(0 === i && /^\s*(?:hi|hello|hey)\b.*,\s*$/i.test( l )) )

  while( kept.length && /^\s*(?:thanks!?|thank you!?|hannah|)\s*$/i.test( kept.at( -1 ) ) )
    kept.pop()

  return kept.join( '\n' ).replace( /\n{3,}/g, '\n\n' ).trim()
}

// "… would like 1x 19” Teal Gray Bodhi Mirror. …" -> {quantity: 1,
// description: "19” Teal Gray Bodhi Mirror"}. Falls back to "would like
// a/an …" (one of it), and failing both, the whole note as the line's
// description with no quantity, for the reviewer to enter.
function requestedItem( prose )
{
  const line = (quantity, description) => ({sku: null, description: clean( description ), unitPrice: null, quantity})
  const sentenceEnd = '(?=[.!?](?:\\s|$)|\\s+Please\\b|$)'

  let match = prose.match( new RegExp( `\\b(\\d+)\\s*x\\s+(.+?)${sentenceEnd}`, 'i' ) )

  if( match )
    return line( Number( match[1] ), match[2] )

  match = prose.match( new RegExp( `\\b(?:would like|wants|ordered|order for)\\s+(?:an?|one)\\s+(.+?)${sentenceEnd}`, 'i' ) )

  if( match )
    return line( 1, match[1] )

  return line( null, prose )
}

// The address follows "SHIP TO:" or "…ship to the address …:", either on
// one line ("Name, Street, City State ZIP, United States, phone") or one
// part per line. Failing a lead-in, it's whichever line has a ZIP code.
function findShipTo( message )
{
  const lead = message.match( /(?:SHIP TO|ship to (?:the|this|their) (?:address|home)[^:\n]*):[ \t]*\n*/i )
  let rows

  if( lead )
  {
    const rest = message.slice( lead.index + lead[0].length )

    rows = rest.split( /\n\s*\n/ )[0].split( '\n' )
  }
  else
  {
    const zipLine = message.split( '\n' ).find( l => /\b\d{5}(?:-\d{4})?\b/.test( l ) )

    rows = zipLine ? [zipLine] : []
  }

  rows = rows.flatMap( r => r.split( ',' ) ).map( clean ).filter( Boolean )

  if( !rows.some( r => cityStateZip( r ) ) )
    return null

  const block = {company: null, name: null, street1: null, street2: null, city: null, state: null, postalCode: null, country: 'US', phone: null, email: null}
  const streets = []

  rows.forEach( (row, i) => {
    const place = cityStateZip( row )

    if( place )
      Object.assign( block, place )
    else if( 0 === i )
      block.name = row
    else if( block.postalCode && phone( row ) && !/[a-z]{3}/i.test( row ) )
      block.phone ??= phone( row )
    else if( !block.postalCode )
      streets.push( row )   // (anything else is a country line after the ZIP)
  } )

  block.street1 = streets[0] ?? null
  block.street2 = streets.slice( 1 ).join( ', ' ) || null

  return block
}

const STATES = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO', connecticut: 'CT', delaware: 'DE',
  'district of columbia': 'DC', florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK', oregon: 'OR',
  pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
}

const STATE_NAMES = Object.keys( STATES ).sort( (a, b) => b.length - a.length ).join( '|' )
const CITY_STATE_ZIP = new RegExp( `^(.+?),?\\s+(${STATE_NAMES}|[A-Z]{2})\\.?,?\\s+(\\d{5}(?:-\\d{4})?)$`, 'i' )

// "Green Bay WI 54313" or "Waukesha Wisconsin 53189" (no comma, state
// spelled out - text.js's cityStateZip() wants "City, ST 12345").
function cityStateZip( text )
{
  const match = clean( text ).match( CITY_STATE_ZIP )

  if( !match )
    return null

  const state = STATES[match[2].toLowerCase()] ?? match[2].toUpperCase()

  return {city: match[1], state, postalCode: match[3]}
}
