'use server'

import { unauthorized } from 'next/navigation'

import Product from '@/db/models/Product'
import StockItem from '@/db/models/StockItem'
import sequelize from '@/db/sequelize'
import { makesPieces } from '@/libs/channelOrders/accept'
import { auth } from '@/lib/auth'

// Inventory > Stock: which Products are tracked, and how many of each are
// on hand. Each write returns {success} or {error} a person can read.

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

const what = product => product?.sku || product?.name || `Product #${product?.id}`

// A stock quantity, checked: zero or more, and whole for a production item
// (one counted per unit, like an order line - see makesPieces()).
function checkQuantity( product, quantity )
{
  const n = Number( quantity )

  if( quantity === '' || quantity == null || !Number.isFinite( n ) || n < 0 )
    throw new Error( `${what( product )}: quantity must be 0 or more` )

  if( makesPieces( product ) && !Number.isInteger( n ) )
    throw new Error( `${what( product )}: a production item needs a whole-number quantity` )

  return n
}

// Every tracked Product with its quantity on hand.
export async function readStock()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const items = await StockItem.findAll( {
    include: {model: Product, attributes: ['id', 'sku', 'name', 'description', 'status', 'type', 'units']},
  } )

  return items.map( item => {
    const json = item.toJSON()

    return {...json, quantity: Number( json.quantity ), makesPieces: makesPieces( json.Product )}
  } )
}

export async function addStockItem( productId, quantity )
{
  return run( async () => {
    const product = await Product.findByPk( productId )

    if( !product )
      throw new Error( 'No such product' )

    const n = checkQuantity( product, quantity )

    if( await StockItem.count( {where: {productId}} ) )
      throw new Error( `${what( product )} is already tracked - change its quantity instead` )

    const item = await StockItem.create( {productId, quantity: n, updatedAt: new Date()} )

    return {id: item.id}
  } )
}

export async function setStockQuantity( id, quantity )
{
  return run( async () => {
    const item = await StockItem.findByPk( id, {include: Product} )

    if( !item )
      throw new Error( 'That stock item no longer exists' )

    await item.update( {quantity: checkQuantity( item.Product, quantity ), updatedAt: new Date()} )
  } )
}

// Stops tracking these Products' stock (the Products themselves stay).
export async function removeStockItems( ids )
{
  return run( async () => ({removed: await StockItem.destroy( {where: {id: ids}} )}) )
}
