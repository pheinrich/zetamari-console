import * as cheerio from 'cheerio'
import PostalMime from 'postal-mime'

import { clean } from './text.js'

// Order emails forwarded by hand - e.g. to bring in historical orders -
// rather than by the Gmail filter's auto-forward (which keeps the
// channel's own From, so it needs nothing here). Only the shop's own
// people may do this, and only from their zetamari.com addresses.
//
// Forwarding *as an attachment* is best: the attached message is the
// channel's email byte for byte (its own Message-ID, Date and both
// bodies), so it's ingested exactly as if it had arrived directly, and
// one forward can carry many. An inline forward is best-effort: the mail
// client rewrites the original into its own HTML and plain text, which
// the channel parsers weren't written against.
const FORWARDERS = /^(?:angie|peter)@zetamari\.com$/i

// A From header is easy to forge, so a forward is only trusted when
// Amazon SES (which receives the mail) found it really came from
// zetamari.com: SES records its DMARC verdict in an Authentication-
// Results header it adds, which zetamari.com's DreamHost DKIM signature
// passes.
const SES_DMARC_PASS = /^amazonses\.com;[\s\S]*\bdmarc=pass\b[^;]*header\.from=zetamari\.com\b/i

// -> null for anything that isn't a forward by one of us (process it as
// usual); {messages: [Buffer]} for emails forwarded as attachments;
// {inline: {from, subject, date, html, text}} for an inline forward; or
// {error} when it can't be trusted or nothing forwarded was found in it.
export async function readForward( raw, email )
{
  const forwarder = clean( email.from?.address )

  if( !FORWARDERS.test( forwarder ) )
    return null

  const authResults = (email.headers ?? []).filter( h => h.key === 'authentication-results' ).map( h => h.value )

  if( !authResults.some( v => SES_DMARC_PASS.test( v ) ) )
    return {error: `Forwarded by ${forwarder}, but SES couldn't verify it came from zetamari.com (no DMARC pass), so it isn't trusted`}

  const messages = await attachedMessages( raw )

  if( messages.length )
    return {messages}

  const inline = inlineForward( email )

  return inline
    ? {inline}
    : {error: `Forwarded by ${forwarder}, but no forwarded email was found in it - forward the order email as an attachment, or inline`}
}

async function attachedMessages( raw )
{
  const {attachments} = await PostalMime.parse( raw, {forceRfc822Attachments: true} )

  return attachments
    .filter( a => a.mimeType === 'message/rfc822' )
    .map( a => Buffer.from( typeof a.content === 'string' ? a.content : new Uint8Array( a.content ) ) )
}

// Gmail's ("---------- Forwarded message ---------") and Apple Mail's
// ("Begin forwarded message:") inline forwards: a block of the original's
// headers, then its body.
const FORWARD_MARKER = /^[ \t>]*(?:-{2,}\s*Forwarded message\s*-{2,}|Begin forwarded message:)[ \t]*$/im
const HEADER_LINE = /^[ \t>]*(From|Date|Sent|Subject|To|Cc|Reply-To):[ \t]*(.*)$/i

function inlineForward( {text, html} )
{
  const marker = text?.match( FORWARD_MARKER )

  if( !marker )
    return null

  const lines = text.slice( marker.index + marker[0].length ).split( /\r?\n/ )
  const headers = {}
  let i = 0

  while( i < lines.length && !clean( lines[i] ) )
    i++

  for( let match; i < lines.length && (match = lines[i].match( HEADER_LINE )); i++ )
    headers[match[1].toLowerCase()] = clean( match[2] )

  const from = headers.from?.match( /<([^>]+)>/ )?.[1] ?? headers.from?.match( /\S+@\S+/ )?.[0]

  if( !from || !headers.subject )
    return null

  return {
    from,
    subject: headers.subject,
    date: forwardedDate( headers.date ?? headers.sent ),
    text: lines.slice( i ).join( '\n' ).trim(),
    html: forwardedHtml( html ),
  }
}

// The original's HTML from Gmail's quote block (its attribution - the
// header block - removed), or Apple Mail's cited blockquote.
function forwardedHtml( html )
{
  if( !html )
    return null

  const $ = cheerio.load( html )
  const gmail = $( '.gmail_quote' ).first()

  if( gmail.length )
  {
    gmail.find( '.gmail_attr' ).first().remove()

    return gmail.html()
  }

  const cited = $( 'blockquote[type="cite"]' ).first()

  return cited.length ? cited.html() : html
}

// "Mon, Nov 10, 2025 at 3:04 PM" (Gmail) or "November 10, 2025 at
// 3:04:05 PM PST" (Apple Mail) -> a Date. Without a zone it's the
// forwarder's clock, which is Pacific.
export function forwardedDate( text )
{
  const s = clean( text )?.replace( /^[A-Za-z]+,\s*/, '' ).replace( /\s+at\s+/i, ' ' )

  if( !s )
    return null

  if( /\b(?:[A-Z]{2,4}T|UTC|GMT|[+-]\d{4})$/.test( s ) )
  {
    const zoned = new Date( s )

    return Number.isNaN( zoned.getTime() ) ? null : zoned
  }

  const asUtc = Date.parse( `${s} UTC` )

  if( Number.isNaN( asUtc ) )
    return null

  return new Date( asUtc - pacificOffset( asUtc ) )
}

// Pacific's offset from UTC (ms, negative) at about that instant.
function pacificOffset( instant )
{
  const parts = Object.fromEntries( new Intl.DateTimeFormat( 'en-US', {
    timeZone: 'America/Los_Angeles', hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
  } ).formatToParts( new Date( instant ) ).map( p => [p.type, p.value] ) )

  const wall = Date.UTC( parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second )

  return wall - Math.floor( instant / 1000 ) * 1000
}
