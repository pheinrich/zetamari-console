import { parseIndieMeOrder } from './indieme.js'
import { FAIRE_NEW_ORDER_SUBJECT, parseFaireOrder } from './faire.js'
import { clean } from './text.js'

// Which sales channel an inbound email came from, and whether it's a new
// order (vs. the many other notices those channels send - payouts, ship
// reminders, retailer messages, newsletters). Keyed on the original
// sender and subject, which a Gmail filter's auto-forward preserves.
//
// `kind` is one of:
//   'new-order'    - parse it into a Channel Order
//   'other'        - a known channel's non-order mail; stored, not parsed
//   'unrecognized' - not from any known channel (e.g. Gmail's forwarding
//                    confirmation, which needs a human to click through)
const CHANNELS = [
  {
    channel: 'indieme',
    from: /@indieme\.com$/i,
    newOrder: /^New IndieMe Marketplace Store Order$/,
    parse: ({html}) => parseIndieMeOrder( html ),
  },
  {
    channel: 'faire',
    from: /@(?:[a-z]+\.)?faire\.com$/i,
    newOrder: FAIRE_NEW_ORDER_SUBJECT,
    parse: ({html, subject}) => parseFaireOrder( html, subject ),
  },
  {
    // No parser yet - Houzz's last order notification was 2022-05. New
    // ones are still classified so they land as failed (visible, and
    // reprocessable once a parser exists) rather than silently ignored.
    channel: 'houzz',
    from: /@houzz\.com$/i,
    newOrder: /^New Houzz Order #[\d-]+$/,
    parse: null,
  },
]

export function classifyOrderEmail( {from, subject} )
{
  const sender = clean( from )
  const entry = CHANNELS.find( c => c.from.test( sender ) )

  if( !entry )
    return {channel: null, kind: 'unrecognized'}

  return {channel: entry.channel, kind: entry.newOrder.test( clean( subject ) ) ? 'new-order' : 'other'}
}

// -> {channel, kind, order} where `order` is the channel-neutral shape
// the parsers return (see parseIndieMeOrder()), present only for
// 'new-order'. Throws if a new-order email can't be parsed.
export function parseOrderEmail( {from, subject, html} )
{
  const {channel, kind} = classifyOrderEmail( {from, subject} )

  if( kind !== 'new-order' )
    return {channel, kind, order: null}

  const entry = CHANNELS.find( c => c.channel === channel )

  if( !entry.parse )
    throw new Error( `No ${channel} order email parser yet` )

  if( !html )
    throw new Error( `${channel} order email has no HTML body` )

  return {channel, kind, order: entry.parse( {html, subject: clean( subject )} )}
}
