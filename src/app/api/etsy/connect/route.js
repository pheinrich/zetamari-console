import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { startEtsyAuthorization } from '@/libs/channelOrders/etsyApi'

// "Connect Etsy": sends a logged-in console user to Etsy to approve
// read access to the shop's orders (see libs/channelOrders/etsyApi.js).
// The OAuth state and PKCE verifier ride along in a short-lived,
// httpOnly cookie scoped to /api/etsy for the callback to check.
export const runtime = 'nodejs'

const COOKIE = 'etsy_oauth'

export async function GET( request )
{
  if( !await auth() )
    return NextResponse.redirect( new URL( '/login', request.url ) )

  let start

  try
  {
    start = startEtsyAuthorization( new URL( '/api/etsy/callback', request.url ).toString() )
  }
  catch( error )
  {
    return NextResponse.redirect( new URL( `/channel-orders?etsy=${encodeURIComponent( error.message )}`, request.url ) )
  }

  const response = NextResponse.redirect( start.url )

  response.cookies.set( COOKIE, `${start.state}.${start.verifier}`, {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/api/etsy',
    maxAge: 600,
  } )

  return response
}
