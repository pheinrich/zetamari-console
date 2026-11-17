import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { completeEtsyAuthorization } from '@/libs/channelOrders/etsyApi'

// Etsy's redirect back after the shop owner approves (or declines) access
// - the app's registered callback URL. Checks the state against the
// cookie /api/etsy/connect set, then stores the connection. Either way it
// returns to Channel Orders with ?etsy=connected or ?etsy=<what failed>.
export const runtime = 'nodejs'

const COOKIE = 'etsy_oauth'

export async function GET( request )
{
  if( !await auth() )
    return NextResponse.redirect( new URL( '/login', request.url ) )

  const params = request.nextUrl.searchParams
  const [state, verifier] = (request.cookies.get( COOKIE )?.value ?? '').split( '.' )
  let outcome

  if( params.get( 'error' ) )
    outcome = params.get( 'error_description' ) || params.get( 'error' )
  else if( !state || !verifier || params.get( 'state' ) !== state )
    outcome = 'The Etsy sign-in expired or didn\'t match - please try again'
  else
  {
    try
    {
      await completeEtsyAuthorization( {
        code: params.get( 'code' ),
        verifier,
        redirectUri: new URL( '/api/etsy/callback', request.url ).toString(),
      } )
      outcome = 'connected'
    }
    catch( error )
    {
      outcome = error.message
    }
  }

  const response = NextResponse.redirect( new URL( `/channel-orders?etsy=${encodeURIComponent( outcome )}`, request.url ) )

  response.cookies.delete( {name: COOKIE, path: '/api/etsy'} )

  return response
}
