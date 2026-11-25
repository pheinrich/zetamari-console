'use server'

import { unauthorized } from 'next/navigation'

import Order from '@/db/models/Order'
import Person from '@/db/models/Person'
import Product from '@/db/models/Product'
import Shipment, { ShipmentLine } from '@/db/models/Shipment'
import sequelize from '@/db/sequelize'
import * as shipments from '@/libs/shipments'
import { auth } from '@/lib/auth'
import { shipmentStep } from '@/utils/shipments'

// Shipments - see CONTEXT.md's Shipment entry; the rules are in
// libs/shipments.js. Each write returns {success, ...} or {error} a
// person can read.

async function run( work )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    return {success: true, ...await work()}
  }
  catch( error )
  {
    return {error: error.message || 'Something went wrong'}
  }
}

// `fields`: {lines: [{productId, quantity}], transportMode, carrier,
// service, tracking, shipTo, notes}
export async function createShipment( orderId, fields )
{
  return run( async () => ({shipmentId: await shipments.createShipment( orderId, fields )}) )
}

export async function updateShipment( id, fields )
{
  return run( () => shipments.updateShipment( id, fields ) )
}

export async function deleteShipment( id )
{
  return run( () => shipments.deleteShipment( id ) )
}

export async function advanceShipment( id )
{
  return run( async () => ({step: await shipments.advanceShipment( id )}) )
}

export async function revertShipment( id )
{
  return run( async () => ({step: await shipments.revertShipment( id )}) )
}

// Every Shipment with its Order's customer and its products, for the
// Shipments list - each with its current `step`.
export async function readShipments()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const rows = await Shipment.findAll( {
    include: [
      {model: Order, attributes: ['id', 'createdOn', 'promisedDate'], include: {model: Person, as: 'Customer'}},
      {model: ShipmentLine, as: 'Lines', include: {model: Product, attributes: ['id', 'sku', 'name', 'units']}},
    ],
    order: [['id', 'DESC']],
  } )

  return rows.map( s => ({
    ...s.toJSON(),
    step: shipmentStep( s ),
    Lines: s.Lines.map( l => ({...l.toJSON(), quantity: Number( l.quantity )}) ),
  }) )
}
