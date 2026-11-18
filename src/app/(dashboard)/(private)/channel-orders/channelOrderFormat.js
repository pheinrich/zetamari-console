// Display helpers shared by the Channel Order and Inbound Email pages.

const CHANNEL_LABELS = {
  artfulhome: 'Artful Home',
  etsy: 'Etsy',
  faire: 'Faire',
  houzz: 'Houzz',
  indieme: 'IndieMe',
  squarespace: 'Squarespace',
}

export function channelLabel( channel )
{
  return CHANNEL_LABELS[channel] ?? channel ?? '—'
}

// DECIMAL columns arrive as strings ("4315.00"); null stays a dash.
export function money( value )
{
  if( value === null || value === undefined || value === '' )
    return '—'

  return Number( value ).toLocaleString( 'en-US', {style: 'currency', currency: 'USD'} )
}

export function buyerLabel( order )
{
  return [order.buyerCompany, order.buyerName].filter( Boolean ).join( ' — ' ) || '—'
}

export function dateTime( value )
{
  return value ? new Date( value ).toLocaleString( 'en-US', {dateStyle: 'medium', timeStyle: 'short'} ) : '—'
}

// What a Channel Order is worth to show in a list: the channel's total
// (for Faire, the payout after commission), else the item subtotal.
// Artful Home reports neither.
export function orderAmount( order )
{
  return order.total ?? order.subtotal ?? null
}

export const ORDER_STATUS_COLORS = {new: 'info', accepted: 'success', dismissed: 'secondary'}

export const EMAIL_STATUS_COLORS = {received: 'warning', parsed: 'success', ignored: 'secondary', failed: 'error'}

export const EMAIL_KIND_LABELS = {'new-order': 'New order', other: 'Other notice', unrecognized: 'Unrecognized', forward: 'Forward'}
