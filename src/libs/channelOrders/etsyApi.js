import { createHash, randomBytes } from 'crypto'

import ApiCredential from '@/db/models/ApiCredential'

// Etsy's Open API v3, for the one thing its order email lacks: each
// line's SKU. The email's order number is Etsy's receipt id, and
// GET /shops/{shop_id}/receipts/{receipt_id} lists the receipt's
// transactions with their SKUs and variations.
//
// Every request carries the app's credentials, "keystring:shared secret"
// (ETSY_API_KEY, ETSY_SHARED_SECRET), as x-api-key. Shop data also needs
// the shop owner's OAuth 2.0 grant (authorization code + PKCE), made once
// through /api/etsy/connect; its tokens live in ApiCredentials. Access
// tokens last an hour, refresh tokens 90 days and rotate on every use, so
// a refresh always saves the new pair.

const API_URL = 'https://api.etsy.com/v3'
const AUTHORIZE_URL = 'https://www.etsy.com/oauth/connect'
const TOKEN_URL = `${API_URL}/public/oauth/token`
const SCOPES = 'transactions_r shops_r'

function apiKey()
{
  const {ETSY_API_KEY, ETSY_SHARED_SECRET} = process.env

  if( !ETSY_API_KEY || !ETSY_SHARED_SECRET )
    throw new Error( 'ETSY_API_KEY and ETSY_SHARED_SECRET must both be set' )

  return `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`
}

export function etsyConfigured()
{
  return !!(process.env.ETSY_API_KEY && process.env.ETSY_SHARED_SECRET)
}

// Start of the grant: a URL to send the shop owner to, plus the state and
// PKCE verifier to keep (in a short-lived cookie) for the callback.
export function startEtsyAuthorization( redirectUri )
{
  apiKey()

  const state = randomBytes( 16 ).toString( 'base64url' )
  const verifier = randomBytes( 32 ).toString( 'base64url' )
  const challenge = createHash( 'sha256' ).update( verifier ).digest( 'base64url' )

  const url = new URL( AUTHORIZE_URL )

  url.search = new URLSearchParams( {
    response_type: 'code',
    client_id: process.env.ETSY_API_KEY,
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  } )

  return {url: url.toString(), state, verifier}
}

// End of the grant: trades the callback's code for tokens, looks up whose
// shop it is, and stores the connection.
export async function completeEtsyAuthorization( {code, verifier, redirectUri} )
{
  const tokens = await tokenRequest( {
    grant_type: 'authorization_code',
    client_id: process.env.ETSY_API_KEY,
    redirect_uri: redirectUri,
    code,
    code_verifier: verifier,
  } )

  const me = await etsyGet( '/application/users/me', tokens.access_token )

  if( !me.shop_id )
    throw new Error( 'The Etsy account that approved access has no shop' )

  const shop = await etsyGet( `/application/shops/${me.shop_id}`, tokens.access_token )

  await ApiCredential.upsert( {
    provider: 'etsy',
    ...tokenFields( tokens ),
    accountId: String( me.shop_id ),
    accountName: shop.shop_name ?? null,
    updatedAt: new Date(),
  } )

  return {shopName: shop.shop_name}
}

// {connected, shopName} for display - never the tokens.
export async function etsyConnection()
{
  const credential = await ApiCredential.findByPk( 'etsy' )

  return {configured: etsyConfigured(), connected: !!credential?.refreshToken, shopName: credential?.accountName ?? null}
}

// -> {lines, linesComplete, expectedLineCount} for one receipt (the
// email's order number). Only lines: the email's amounts already
// reconcile, so they're kept as the email reported them.
export async function fetchEtsyReceipt( receiptId )
{
  const credential = await ApiCredential.findByPk( 'etsy' )

  if( !credential?.refreshToken )
    throw new Error( 'Etsy isn\'t connected - use "Connect Etsy" on the Channel Orders page' )

  const receipt = await etsyGet( `/application/shops/${credential.accountId}/receipts/${receiptId}`, await accessToken( credential ) )

  const lines = (receipt.transactions ?? []).map( t => ({
    sku: t.sku || null,
    description: [t.title, ...(t.variations ?? []).map( v => `${v.formatted_name}: ${v.formatted_value}` )].filter( Boolean ).join( ', ' ) || null,
    unitPrice: t.price ? t.price.amount / t.price.divisor : null,
    quantity: t.quantity,
  }) )

  return {lines, linesComplete: true, expectedLineCount: lines.length}
}

export function withEtsyReceipt( order, receipt )
{
  return {...order, ...receipt}
}

async function accessToken( credential )
{
  if( credential.accessToken && credential.accessTokenExpiresAt > new Date( Date.now() + 60_000 ) )
    return credential.accessToken

  let tokens

  try
  {
    tokens = await tokenRequest( {grant_type: 'refresh_token', client_id: process.env.ETSY_API_KEY, refresh_token: credential.refreshToken} )
  }
  catch( error )
  {
    throw new Error( `${error.message} - Etsy may need reconnecting` )
  }

  await credential.update( {...tokenFields( tokens ), updatedAt: new Date()} )

  return tokens.access_token
}

function tokenFields( tokens )
{
  return {
    accessToken: tokens.access_token,
    accessTokenExpiresAt: new Date( Date.now() + (tokens.expires_in ?? 3600) * 1000 ),
    refreshToken: tokens.refresh_token,
  }
}

async function tokenRequest( params )
{
  const response = await fetch( TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-api-key': apiKey()},
    body: new URLSearchParams( params ),
    cache: 'no-store',
  } )

  const body = await response.json().catch( () => ({}) )

  if( !response.ok )
    throw new Error( `token request failed (${response.status}${body.error ? `: ${body.error_description ?? body.error}` : ''})` )

  return body
}

async function etsyGet( path, token )
{
  const response = await fetch( `${API_URL}${path}`, {
    headers: {'x-api-key': apiKey(), Authorization: `Bearer ${token}`},
    cache: 'no-store',
  } )

  const body = await response.json().catch( () => ({}) )

  if( !response.ok )
    throw new Error( `GET ${path.replace( /\/\d+/g, '/…' )} returned ${response.status}${body.error ? ` (${body.error})` : ''}` )

  return body
}
