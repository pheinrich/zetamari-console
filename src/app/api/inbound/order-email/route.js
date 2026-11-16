import { createHash, timingSafeEqual } from 'crypto'

import { NextResponse } from 'next/server'

import { ingestRawEmail } from '@/libs/channelOrders/ingest'
import { readSnsEnvelope } from '@/libs/channelOrders/sns'

// Receives sales-channel notification emails (IndieMe, Faire, Houzz)
// forwarded by an inbound-email service, and stages any orders in them
// as Channel Orders - see CONTEXT.md's Inbound Email entry.
//
// This route sits outside the session-based AuthGuard (the sender is a
// service, not a logged-in person), so it authenticates with the shared
// INBOUND_EMAIL_SECRET instead, accepted either as a Bearer token or as
// the password of HTTP Basic auth (which is how SNS and Postmark pass
// credentials embedded in a subscription/webhook URL - SNS only sends
// them after a 401 carrying `WWW-Authenticate: Basic`). With no secret
// configured it refuses everything rather than running open.
//
// Body: an Amazon SNS envelope for SES inbound mail (recognized by its
// x-amz-sns-message-type header - see libs/channelOrders/sns.js), the
// raw RFC 5322 message (Content-Type message/rfc822 or
// application/octet-stream), or JSON carrying it as `RawEmail`
// (Postmark's field, with "include raw email content" enabled) or `raw`.
//
// Responds 200 once the email is stored, even when it couldn't be
// parsed: the raw message is kept with status 'failed' for replay, and a
// non-2xx would only make the sender retry an email that will fail the
// same way.
export const runtime = 'nodejs'

export async function POST( request )
{
  const secret = process.env.INBOUND_EMAIL_SECRET

  if( !secret )
    return NextResponse.json( {error: 'Inbound email is not configured'}, {status: 503} )

  if( !matchesSecret( presentedSecret( request ), secret ) )
    return NextResponse.json( {error: 'Unauthorized'}, {status: 401, headers: {'WWW-Authenticate': 'Basic realm="inbound-email"'}} )

  let raw

  if( request.headers.get( 'x-amz-sns-message-type' ) )
  {
    let sns

    try
    {
      sns = await readSnsEnvelope( JSON.parse( await request.text() ) )
    }
    catch( error )
    {
      return NextResponse.json( {error: error.message}, {status: error.status ?? 400} )
    }

    if( !sns.raw )
      return NextResponse.json( sns )

    raw = sns.raw
  }
  else if( (request.headers.get( 'content-type' ) ?? '').includes( 'application/json' ) )
  {
    const body = await request.json().catch( () => null )

    raw = body?.RawEmail ?? body?.raw
  }
  else
    raw = Buffer.from( await request.arrayBuffer() )

  if( !raw?.length )
    return NextResponse.json( {error: 'No raw email in request body'}, {status: 400} )

  const result = await ingestRawEmail( raw )

  return NextResponse.json( result )
}

function presentedSecret( request )
{
  const header = request.headers.get( 'authorization' ) ?? ''
  const [scheme, value = ''] = header.split( ' ' )

  if( scheme?.toLowerCase() === 'bearer' )
    return value

  if( scheme?.toLowerCase() === 'basic' )
  {
    const decoded = Buffer.from( value, 'base64' ).toString( 'utf8' )

    return decoded.slice( decoded.indexOf( ':' ) + 1 )
  }

  return ''
}

// Constant-time comparison - hashing first gives both sides the same
// length, which timingSafeEqual requires.
function matchesSecret( presented, secret )
{
  const digest = s => createHash( 'sha256' ).update( s ).digest()

  return !!presented && timingSafeEqual( digest( presented ), digest( secret ) )
}
