'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import BeadInfo from '@/db/models/BeadInfo'
import BillOfMaterial from '@/db/models/BillOfMaterial'
import Contour from '@/db/models/Contour'
import FrameInfo from '@/db/models/FrameInfo'
import MillefioriInfo from '@/db/models/MillefioriInfo'
import MirrorInfo from '@/db/models/MirrorInfo'
import Product from '@/db/models/Product'
import SubstrateInfo from '@/db/models/SubstrateInfo'
import Supplier from '@/db/models/Supplier'
// Imported for its side effect: this is where Product<->Supplier
// (belongsToMany, as 'suppliers'/'products') gets registered. Without it,
// readProduct()'s eager include below throws "Supplier is not associated
// to Product!" whenever this module loads before supplier.js does.
import '@/db/models/SupplierProduct'
import TileInfo from '@/db/models/TileInfo'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createProduct( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name || !data.sku )
    return {error: 'Name and sku are required'}

  try
  {
    const result = await sequelize.transaction( async t => {
      const product = await Product.create({
        name: data.name,
        type: data.type || null,
        sku: data.sku,
        sellable: data.sellable ?? true,
        units: data.units,
        weight: data.weight,
        description: data.description,
        priceWholesale: data.priceWholesale || null,
        priceRetail: data.priceRetail || null,
      }, {transaction: t})

      if( data.type )
        await setProductInfo( {...data, id: product.id}, t )

      return product
    })

    return {success: true, id: result.id}
  }
  catch( error )
  {
    console.log( '---------------------- ROLLBACK ----------------------' )
    console.log( error )

    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    if( error instanceof Sequelize.DatabaseError )
      return {error: `Database error: ${error.message}`}

    return {error: error.message || 'An unexpected error occurred while creating the product'}
  }
}

export async function readProduct( id, eager )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  let product

  if( eager )
  {
    product = await Product.findByPk( id, {
      include: [
        {
          model: Supplier,
          as: 'suppliers',
          through: {
            attributes: ['partNumber', 'url', 'cost']
          }
        },
        {
          model: SubstrateInfo,
          as: 'substrateInfo',
          include: [
            { association: 'outside' },
            { association: 'inside' },
            { association: 'rabbet' },
          ]
        },
        { model: BeadInfo, as: 'beadInfo' },
        { model: FrameInfo, as: 'frameInfo' },
        { model: MillefioriInfo, as: 'millefioriInfo' },
        { model: MirrorInfo, as: 'mirrorInfo' },
        { model: TileInfo, as: 'tileInfo' },
        {
          model: BillOfMaterial,
          as: 'bomLines',
          include: [{ model: Product, as: 'material' }],
        },
        {
          model: BillOfMaterial,
          as: 'usedInLines',
          include: [{ model: Product, as: 'parent' }],
        },
      ]
    })
  }
  else
    product = await Product.findByPk( id )

  return product?.toJSON()
}

export async function readProducts()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  return await Product.findAll()
}

export async function updateProduct( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await Product.findByPk( data.id )
  if( !product )
    notFound()

  try
  {
    await sequelize.transaction( async t => {
      await product.update({
        name: data.name,
        type: data.type || null,
        sku: data.sku,
        sellable: data.sellable ?? true,
        units: data.units,
        weight: data.weight,
        description: data.description,
        priceWholesale: data.priceWholesale || null,
        priceRetail: data.priceRetail || null,
      }, {transaction: t})

      if( data.type )
        await setProductInfo( data, t )
      else
        await clearProductInfo( data.id, t )
    })

    return {success: true}
  }
  catch( error )
  {
    console.log( '---------------------- ROLLBACK ----------------------' )
    console.log( error )

    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    if( error instanceof Sequelize.DatabaseError )
      return {error: `Database error: ${error.message}`}

    return {error: error.message || 'An unexpected error occurred while updating the product'}
  }
}

export async function deleteProduct( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await Product.findByPk( id )
  if( !product )
    notFound()

  // If this product is still used as a material in another product's bill
  // of materials, the FK (RESTRICT) will raise a ForeignKeyConstraintError
  // here rather than silently orphaning the BOM line.
  await product.destroy()
}

// --- Bill of materials -------------------------------------------------

export async function addBomLine( parentProductId, materialProductId, quantity )
{
  const session = await auth()
  if( !session )
    unauthorized()

  if( Number( parentProductId ) === Number( materialProductId ) )
    return {error: 'A product cannot list itself as a material.'}

  await sequelize.sync()

  try
  {
    const line = await BillOfMaterial.create( {parentProductId, materialProductId, quantity} )
    return {success: true, id: line.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError || error instanceof Sequelize.UniqueConstraintError )
      return {error: error.errors?.map( (e) => e.message ).join( '; ' ) || error.message}

    return {error: error.message || 'An unexpected error occurred while adding the bill of materials line'}
  }
}

export async function updateBomLine( id, quantity )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const line = await BillOfMaterial.findByPk( id )
  if( !line )
    notFound()

  return await line.update( {quantity} )
}

export async function removeBomLine( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const line = await BillOfMaterial.findByPk( id )
  if( !line )
    notFound()

  return await line.destroy()
}

// Create or update the extra info row associated with a product. This may
// involve deleting an old entry if the type has changed (e.g. Bead ->
// Tile). Pass the active transaction so its effects are unwound with the
// rest of the create/update if something fails.
async function setProductInfo( data, t )
{
  await clearProductInfo( data.id, t )

  switch( data.type )
  {
    case 'bead':
      await BeadInfo.create({
        productId: data.id,
        category: data.beadInfo.category,
        finish: data.beadInfo.finish,
        shape: data.beadInfo.shape,
        color: data.beadInfo.color,
        length: data.beadInfo.length,
        height: data.beadInfo.height,
        thickness: data.beadInfo.thickness,
      }, {transaction: t})
      break

    case 'frame':
      await FrameInfo.create({
        productId: data.id,
        width: data.frameInfo.width,
        height: data.frameInfo.height,
        thickness: data.frameInfo.thickness,
        channel: data.frameInfo.channel,
        border: data.frameInfo.border,
        photoWidth: data.frameInfo.photoWidth,
        photoHeight: data.frameInfo.photoHeight,
      }, {transaction: t})
      break

    case 'millefiori':
      await MillefioriInfo.create({
        productId: data.id,
        shape: data.millefioriInfo.shape,
        color: data.millefioriInfo.color,
        length: data.millefioriInfo.length,
        width: data.millefioriInfo.width,
        height: data.millefioriInfo.height,
      }, {transaction: t})
      break

    case 'mirror':
      await MirrorInfo.create({
        productId: data.id,
        shape: data.mirrorInfo.shape,
        width: data.mirrorInfo.width,
        height: data.mirrorInfo.height,
        thickness: data.mirrorInfo.thickness,
        bevel: data.mirrorInfo.bevel,
      }, {transaction: t})
      break

    case 'substrate':
      await SubstrateInfo.create({
        productId: data.id,
        outsideId: data.substrateInfo.outsideId,
        insideId: data.substrateInfo.insideId,
        rabbetId: data.substrateInfo.rabbetId,
        width: data.substrateInfo.width,
        height: data.substrateInfo.height,
        thickness: data.substrateInfo.thickness,
        border: data.substrateInfo.border,
      }, {transaction: t})
      break

    case 'tile':
      await TileInfo.create({
        productId: data.id,
        color: data.tileInfo.color,
        width: data.tileInfo.width,
        height: data.tileInfo.height,
        thickness: data.tileInfo.thickness,
      }, {transaction: t})
      break

    // 'birdhouse', 'grout', and 'other' have no type-specific Info table.
  }
}

async function clearProductInfo( productId, t )
{
  await Promise.all([
    BeadInfo.destroy({ where: {productId}, transaction: t }),
    FrameInfo.destroy({ where: {productId}, transaction: t }),
    MillefioriInfo.destroy({ where: {productId}, transaction: t }),
    MirrorInfo.destroy({ where: {productId}, transaction: t }),
    SubstrateInfo.destroy({ where: {productId}, transaction: t }),
    TileInfo.destroy({ where: {productId}, transaction: t }),
  ])
}
