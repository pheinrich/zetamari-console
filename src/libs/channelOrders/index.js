import { ARTFUL_HOME_NEW_ORDER_SUBJECT, parseArtfulHomeOrder } from './artfulhome.js'
import { ETSY_NEW_ORDER_SUBJECT, parseEtsyOrder } from './etsy.js'
import { FAIRE_NEW_ORDER_SUBJECT, parseFaireOrder } from './faire.js'
import { GIVING_TREE_NEW_ORDER_SUBJECT, parseGivingTreeOrder } from './givingtree.js'
import { parseIndieMeOrder } from './indieme.js'
import { PLUM_BOTTOM_NEW_ORDER_SUBJECT, parsePlumBottomOrder } from './plumbottom.js'
import { SQUARESPACE_NEW_ORDER_SUBJECT, parseSquarespaceOrder } from './squarespace.js'
import { clean } from './text.js'

// Which sales channel an inbound email came from, and whether it's a new
// order (vs. the many other notices those channels send - payouts, ship
// reminders, retailer messages, newsletters). Keyed on the original
// sender and subject, which a Gmail filter's auto-forward preserves.
//
// The channel comes from the sender's domain alone (any subdomain of
// it): mail only reaches the intake address from the channels, so every
// email from one of these domains is that channel's. Whether it's a new
// order is the subject, plus - where a channel sends lookalike subjects
// from other addresses - the exact sender (`orderFrom`).
//
// `kind` is one of:
//   'new-order'    - parse it into a Channel Order
//   'other'        - a known channel's non-order mail; stored, not parsed
//   'unrecognized' - not from any known channel's domain
const CHANNELS = [
  {
    channel: 'indieme',
    domains: ['indieme.com'],
    newOrder: /^New IndieMe Marketplace Store Order$/,
    parse: ({html}) => parseIndieMeOrder( needs( html, 'HTML' ) ),
  },
  {
    channel: 'faire',
    domains: ['faire.com'],
    newOrder: FAIRE_NEW_ORDER_SUBJECT,
    parse: ({html, subject}) => parseFaireOrder( needs( html, 'HTML' ), subject ),
  },
  {
    channel: 'etsy',
    domains: ['etsy.com'],
    orderFrom: /^transaction@etsy\.com$/i,
    newOrder: ETSY_NEW_ORDER_SUBJECT,
    parse: ({text, subject, date}) => parseEtsyOrder( needs( text, 'plain-text' ), subject, date ),
  },
  {
    // Only no-reply@squarespace.com's shop-owner notifications are
    // orders. Other Squarespace shops' receipts to Angie as a customer
    // come from squarespace.info, and Squarespace's own marketing from
    // mail.squarespace.com - both still Squarespace's, as 'other'.
    channel: 'squarespace',
    domains: ['squarespace.com', 'squarespace.info'],
    orderFrom: /^no-reply@squarespace\.com$/i,
    newOrder: SQUARESPACE_NEW_ORDER_SUBJECT,
    parse: ({html, subject}) => parseSquarespaceOrder( needs( html, 'HTML' ), subject ),
  },
  {
    channel: 'artfulhome',
    domains: ['artfulhome.com'],
    newOrder: ARTFUL_HOME_NEW_ORDER_SUBJECT,
    parse: ({text, subject}) => parseArtfulHomeOrder( needs( text, 'plain-text' ), subject ),
  },
  {
    // Hand-written in Gmail by the gallery's staff, so only the
    // "Drop Ship order for … PO…" subjects are orders - replies and other
    // correspondence from the same address are 'other'.
    channel: 'givingtree',
    domains: ['thegivingtreegallery.com', 'givingtreegallery.com'],
    newOrder: GIVING_TREE_NEW_ORDER_SUBJECT,
    parse: ({text, subject, date}) => parseGivingTreeOrder( needs( text, 'plain-text' ), subject, date ),
  },
  {
    // Hand-written notes with no fixed form - parsed best-effort and
    // always staged as incomplete (see plumbottom.js).
    channel: 'plumbottom',
    domains: ['plumbottomgallery.com'],
    newOrder: PLUM_BOTTOM_NEW_ORDER_SUBJECT,
    parse: ({text, subject, date}) => parsePlumBottomOrder( needs( text, 'plain-text' ), subject, date ),
  },
  {
    // No parser yet - Houzz's last order notification was 2022-05. New
    // ones are still classified so they land as failed (visible, and
    // reprocessable once a parser exists) rather than silently ignored.
    channel: 'houzz',
    domains: ['houzz.com'],
    newOrder: /^New Houzz Order #[\d-]+$/,
    parse: null,
  },
]

// "mail.faire.com" -> "faire.com": the host's last two labels, which is
// the registered domain for every channel above.
function registeredDomain( host )
{
  return host.toLowerCase().split( '.' ).slice( -2 ).join( '.' )
}

function channelFor( host )
{
  return CHANNELS.find( c => c.domains.includes( registeredDomain( host ) ) )
}

// -> {entry, address} for the channel that sent `sender`, where `address`
// is the channel's own address (for `orderFrom`), or null when it can't
// be recovered. Usually that's just the sender's domain, but a forwarder
// that rewrites the sender moves the channel's domain into the local-
// part, '='-separated:
//   SRS (envelope rewriting):    SRS0=hash=tt=etsy.com=transaction@fwd.example
//                                SRS1=hash=fwd.example==hash=tt=etsy.com=transaction@…
//   DMARC rewriting (Groups,     transaction=etsy.com@list.example
//   Mailman):
//   Constant Contact:            service-indieme.com@shared1.ccsend.com
// Otherwise any '='/'+'-separated piece of the local-part naming a
// channel's domain (e.g. etsy.com@relay.example) still identifies the
// channel, just not its original address.
function senderChannel( sender )
{
  const at = sender.lastIndexOf( '@' )

  if( at < 0 )
    return null

  const local = sender.slice( 0, at )
  const entry = channelFor( sender.slice( at + 1 ) )

  if( entry )
    return {entry, address: sender}

  const parts = local.split( '=' )
  const srs = /^SRS[01]$/i.test( parts[0] ) && parts.length >= 5

  if( srs && channelFor( parts.at( -2 ) ) )
    return {entry: channelFor( parts.at( -2 ) ), address: `${parts.at( -1 )}@${parts.at( -2 )}`}

  if( !srs && parts.length >= 2 && channelFor( parts.at( -1 ) ) )
    return {entry: channelFor( parts.at( -1 ) ), address: `${parts.slice( 0, -1 ).join( '=' )}@${parts.at( -1 )}`}

  for( const piece of local.split( /[=+]/ ) )
  {
    // "service-indieme.com" -> service @ indieme.com; "etsy.com" -> no
    // user. The host is everything after the last '-', which holds for
    // every channel domain above (none has a hyphen).
    const [, user, host] = piece.match( /^(?:(.+)-)?([^-]+\.[^-.]+)$/ ) ?? []
    const named = host && channelFor( host )

    if( named )
      return {entry: named, address: user ? `${user}@${host}` : null}
  }

  return null
}

export function classifyOrderEmail( {from, subject} )
{
  const found = senderChannel( clean( from ) )

  if( !found )
    return {channel: null, kind: 'unrecognized'}

  const {entry, address} = found
  const isOrder = (!entry.orderFrom || (address != null && entry.orderFrom.test( address ))) && entry.newOrder.test( clean( subject ) )

  return {channel: entry.channel, kind: isOrder ? 'new-order' : 'other'}
}

// -> {channel, kind, order} where `order` is the channel-neutral shape
// the parsers return (see parseIndieMeOrder()), present only for
// 'new-order'. Throws if a new-order email can't be parsed. `html` and
// `text` are the email's two bodies (each parser reads whichever is
// cleaner for its channel), `date` its Date header.
export function parseOrderEmail( {from, subject, html, text, date} )
{
  const {channel, kind} = classifyOrderEmail( {from, subject} )

  if( kind !== 'new-order' )
    return {channel, kind, order: null}

  const entry = CHANNELS.find( c => c.channel === channel )

  if( !entry.parse )
    throw new Error( `No ${channel} order email parser yet` )

  return {channel, kind, order: entry.parse( {html, text, date, subject: clean( subject )} )}
}

function needs( body, what )
{
  if( !body )
    throw new Error( `Order email has no ${what} body` )

  return body
}
