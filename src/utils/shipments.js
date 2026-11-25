// Shipment facts shared by server and browser - see CONTEXT.md's
// Shipment entry. The database rules are in libs/shipments.js.

export const TRANSPORT_MODES = ['carrier pickup', 'drop-off', 'will call', 'delivery']

// The modes a carrier moves - only these take a carrier, service and
// tracking number.
export const CARRIER_MODES = new Set( ['carrier pickup', 'drop-off'] )

export const TRANSPORT_MODE_LABELS = {
  'carrier pickup': 'Carrier pickup',
  'drop-off': 'Drop-off',
  'will call': 'Will call',
  delivery: 'Delivery',
}

// A Shipment's steps, in order, each with the column recording when it
// was done. Its current step is the first not yet done; after the last
// it's 'Done'.
export const SHIPMENT_STEPS = [
  {step: 'Picking', doneAt: 'pickedAt', action: 'Picked'},
  {step: 'Packing', doneAt: 'packedAt', action: 'Packed'},
  {step: 'Paperwork', doneAt: 'documentedAt', action: 'Paperwork done'},
  {step: 'Hand-off', doneAt: 'handedOffAt', action: 'Handed off'},
]

export const STEP_COLORS = {Picking: 'warning', Packing: 'info', Paperwork: 'primary', 'Hand-off': 'secondary', Done: 'success'}

export function shipmentStep( shipment )
{
  return SHIPMENT_STEPS.find( s => !shipment[s.doneAt] )?.step ?? 'Done'
}

const day = at => at ? new Date( at ).toISOString().slice( 0, 10 ) : null

// An Order's fulfillment, from its lines ([{productId, quantity}]) and
// Shipments (each with its Lines): how much of each product is already
// on a Shipment (`allocated`, productId -> quantity), and when the whole
// Order was packed and shipped - the latest such Shipment's date, once
// every line is covered by Shipments that far along; null until then.
// `status` is 'shipped', 'partly shipped' (some Shipment handed off),
// 'in fulfillment' (Shipments, none handed off yet) or null.
export function orderFulfillment( lines, shipments )
{
  const allocated = {}

  for( const s of shipments )
    for( const l of s.Lines ?? [] )
      allocated[l.productId] = (allocated[l.productId] ?? 0) + Number( l.quantity )

  const dateWhenAll = doneAt => {
    const done = shipments.filter( s => s[doneAt] )
    const covered = {}

    for( const s of done )
      for( const l of s.Lines ?? [] )
        covered[l.productId] = (covered[l.productId] ?? 0) + Number( l.quantity )

    const all = lines.length > 0 && lines.every( l => (covered[l.productId] ?? 0) >= Number( l.quantity ) )

    return all ? day( Math.max( ...done.map( s => new Date( s[doneAt] ).getTime() ) ) ) : null
  }

  const packedOn = dateWhenAll( 'packedAt' )
  const completedOn = dateWhenAll( 'handedOffAt' )

  const status = completedOn ? 'shipped'
    : shipments.some( s => s.handedOffAt ) ? 'partly shipped'
      : shipments.length ? 'in fulfillment'
        : null

  return {allocated, packedOn, completedOn, status}
}

// A ship-to (ChannelOrder.shipTo's shape) as display lines.
export function addressLines( a )
{
  if( !a )
    return []

  return [
    a.company,
    a.name,
    a.street1,
    a.street2,
    [[a.city, a.state].filter( Boolean ).join( ', ' ), a.postalCode].filter( Boolean ).join( ' ' ),
    a.country,
  ].filter( Boolean )
}
