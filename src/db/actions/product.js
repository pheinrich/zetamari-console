'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import BeadInfo from '@/db/models/BeadInfo'
import BillOfMaterial from '@/db/models/BillOfMaterial'
import BirdhouseBaseInfo from '@/db/models/BirdhouseBaseInfo'
import Contour from '@/db/models/Contour'
import PictureFrameInfo from '@/db/models/PictureFrameInfo'
import Image from '@/db/models/Image'
import MillefioriInfo from '@/db/models/MillefioriInfo'
import MirrorGlassInfo from '@/db/models/MirrorGlassInfo'
import Product from '@/db/models/Product'
import ProductCostOverride from '@/db/models/ProductCostOverride'
import ProductImage from '@/db/models/ProductImage'
import WoodenBaseInfo from '@/db/models/WoodenBaseInfo'
import Supplier from '@/db/models/Supplier'
// Imported for its side effect: this is where Product<->Supplier
// (belongsToMany, as 'suppliers'/'products') gets registered. Without it,
// readProduct()'s eager include below throws "Supplier is not associated
// to Product!" whenever this module loads before supplier.js does.
import '@/db/models/SupplierProduct'
import TileInfo from '@/db/models/TileInfo'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markProductsCostStale } from '@/db/actions/productCost'
import { INFO_KEY, infoSchemas } from '@/libs/productInfo'

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
        status: data.status || 'visible',
        units: data.units,
        weight: data.weight,
        shippingWeight: data.shippingWeight,
        description: data.description,
        priceWholesale: data.priceWholesale || null,
        priceRetail: data.priceRetail || null,
      }, {transaction: t})

      if( data.type )
        await setProductInfo( {...data, id: product.id}, t )

      // Only ever populated by the "Duplicate" flow (ProductForm.jsx's
      // duplicateCostRows/dupBomLines) - a snapshot of another product's
      // cost-breakdown Included checkboxes/quantities and bill-of-
      // materials lines, carried over onto this brand-new product in the
      // same transaction as its creation. Everything else about a plain
      // Create Product submission leaves these undefined.
      if( data.costOverrides?.length )
        await ProductCostOverride.bulkCreate(
          data.costOverrides.map( o => ({
            productId: product.id,
            costFactorId: o.costFactorId,
            quantityOverride: o.quantityOverride,
            enabledOverride: o.enabledOverride,
          }) ),
          {transaction: t}
        )

      if( data.bomLines?.length )
        await BillOfMaterial.bulkCreate(
          data.bomLines.map( l => ({
            parentProductId: product.id,
            materialProductId: l.materialProductId,
            quantity: l.quantity,
            supplierId: l.supplierId || null,
          }) ),
          {transaction: t}
        )

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
          model: Image,
          as: 'images',
          through: { attributes: ['id', 'sortOrder'] },
        },
        {
          model: Supplier,
          as: 'suppliers',
          through: {
            attributes: ['id', 'partNumber', 'url', 'cost', 'preferred']
          }
        },
        {
          model: WoodenBaseInfo,
          as: 'woodenBaseInfo',
          include: [
            { association: 'outside', include: [{association: 'shape'}] },
            { association: 'inside', include: [{association: 'shape'}] },
            { association: 'rabbet', include: [{association: 'shape'}] },
          ]
        },
        { model: BeadInfo, as: 'beadInfo' },
        { model: BirdhouseBaseInfo, as: 'birdhouseBaseInfo' },
        { model: PictureFrameInfo, as: 'pictureFrameInfo' },
        { model: MillefioriInfo, as: 'millefioriInfo' },
        { model: MirrorGlassInfo, as: 'mirrorGlassInfo' },
        { model: TileInfo, as: 'tileInfo' },
        {
          model: BillOfMaterial,
          as: 'bomLines',
          include: [
            {
              model: Product,
              as: 'material',
              include: [{ model: Supplier, as: 'suppliers', through: {attributes: ['cost', 'preferred']} }],
            },
            { model: Supplier, as: 'supplier' },
          ],
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

  const plain = product?.toJSON()

  // Sequelize doesn't support ordering a belongsToMany's `include` by the
  // through table's own column, so sort the gallery here instead - lowest
  // ProductImage.sortOrder (the primary/thumbnail image) first.
  if( plain?.images )
    plain.images.sort( (a, b) => (a.ProductImage?.sortOrder ?? 0) - (b.ProductImage?.sortOrder ?? 0) )

  return plain
}

export async function readProducts()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const products = await Product.findAll({
    // Just enough to filter/label by in the list view (ProductTableFilters'
    // Supplier select) - the full through-table cost/partNumber/url detail
    // is only loaded on the product detail page (readProduct's eager
    // include above).
    include: [{ model: Supplier, as: 'suppliers', attributes: ['id', 'name'], through: { attributes: [] } }],
  })

  // Attach each product's primary (lowest sortOrder) image, if any, as
  // `primaryImage` for list-view thumbnails. Done as a single follow-up
  // query rather than a nested `include` with a per-row limit, which
  // Sequelize doesn't support cleanly for a belongsToMany.
  const primaryImageByProductId = {}

  if( products.length )
  {
    const links = await ProductImage.findAll({
      where: { productId: products.map( p => p.id ) },
      include: [{ model: Image, as: 'image' }],
      order: [['sortOrder', 'ASC']],
    })

    // Plain object, not the Sequelize instance: this result goes to a
    // Client Component, which only accepts plain values.
    for( const link of links )
      if( !(link.productId in primaryImageByProductId) )
        primaryImageByProductId[link.productId] = link.image?.toJSON() ?? null
  }

  return products.map( product => {
    const plain = product.toJSON()
    plain.primaryImage = primaryImageByProductId[product.id] ?? null
    return plain
  })
}

// Wooden base products (type: 'wooden base'; renamed from 'substrate' -
// see 20260723000000-rename-product-types.js), with their WoodenBaseInfo
// and outside/inside/rabbet Contours (each with its shape family - see
// Contour.js's `shape` association) eagerly loaded - used by the mirror
// calculator's "load an existing wooden base" picker, which needs the
// dimensions/contours/shape family up front rather than a per-row
// follow-up fetch (the "Copy From..." menu groups by shape family).
export async function readWoodenBaseProducts()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const products = await Product.findAll({
    where: {type: 'wooden base'},
    include: [
      {
        model: WoodenBaseInfo,
        as: 'woodenBaseInfo',
        include: [
          { association: 'outside', include: [{association: 'shape'}] },
          { association: 'inside', include: [{association: 'shape'}] },
          { association: 'rabbet', include: [{association: 'shape'}] },
        ]
      },
    ],
  })

  return products.map( p => p.toJSON() )
}

// Toggle just the `sellable` flag, for the list page's inline switch -
// avoids sending a full update() payload (and re-running setProductInfo)
// for what's a single boolean flip.
export async function toggleProductSellable( id, sellable )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const product = await Product.findByPk( id )
  if( !product )
    notFound()

  await product.update( {sellable} )
  return product.toJSON()
}

// Toggle just the `status` flag, for the list page's inline switch - same
// shape as toggleProductSellable above. Status only ever has the two
// values this maps to/from, so the list UI treats it as a boolean
// ("visible") rather than exposing the raw enum.
export async function toggleProductStatus( id, visible )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const product = await Product.findByPk( id )
  if( !product )
    notFound()

  await product.update( {status: visible ? 'visible' : 'hidden'} )
  return product.toJSON()
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
        status: data.status || 'visible',
        units: data.units,
        weight: data.weight,
        shippingWeight: data.shippingWeight,
        description: data.description,
        priceWholesale: data.priceWholesale || null,
        priceRetail: data.priceRetail || null,
      }, {transaction: t})

      if( data.type )
        await setProductInfo( data, t )
      else
        await clearProductInfo( data.id, t )
    })

    // Almost anything in this update could change this product's computed
    // cost (its type-specific Info fields feed geometry, weight/pricing
    // fields don't but there's no cheap way to tell in advance) - see
    // productCost.js's "Cost cache invalidation" section.
    await markProductsCostStale( [data.id] )

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

// Create or replace just a product's type-specific Info row (the Overview
// tab's "<Type> Details" popup), for whatever type the product currently
// has. `info` is validated against the same schema the full form uses.
export async function updateProductInfo( id, info )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await Product.findByPk( id )
  if( !product )
    notFound()

  const key = INFO_KEY[product.type]
  if( !key )
    return {error: 'This product type has no type-specific details'}

  const parse = infoSchemas[key].safeParse( info )
  if( !parse.success )
    return {error: 'Some details are missing or invalid', fieldErrors: parse.error.flatten().fieldErrors}

  try
  {
    await sequelize.transaction( async t => {
      await setProductInfo( {id: product.id, type: product.type, [key]: parse.data}, t )
    })

    // Info fields feed geometry/weight, and so this product's cost.
    await markProductsCostStale( [product.id] )

    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: `Validation failed: ${error.errors.map( (e) => e.message ).join( '; ' )}`}

    if( error instanceof Sequelize.ForeignKeyConstraintError )
      return {error: 'One of the selected contours no longer exists'}

    return {error: error.message || 'An unexpected error occurred while saving the details'}
  }
}

// Update just the summary fields shown in the product page's hero pane
// (and its Edit popup) - unlike updateProduct, this doesn't need the full
// form payload. Changing the type drops the old type's Info row, since it
// no longer describes the product; the new type's details are filled in
// separately.
export async function updateProductSummary( {id, name, sku, type, status, sellable, description} )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const product = await Product.findByPk( id )
  if( !product )
    notFound()

  const newType = type || null
  const typeChanged = newType !== product.type

  try
  {
    await sequelize.transaction( async t => {
      await product.update( {name, sku, type: newType, status, sellable, description}, {transaction: t} )

      if( typeChanged )
        await clearProductInfo( id, t )
    })

    // The type-specific Info rows feed geometry/weight, so a type change
    // can change this product's computed cost.
    if( typeChanged )
      await markProductsCostStale( [id] )

    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.UniqueConstraintError )
      return {error: `Another product already uses that ${error.errors?.[0]?.path === 'name' ? 'name' : 'SKU'}`}

    if( error instanceof Sequelize.ValidationError )
      return {error: `Validation failed: ${error.errors.map( (e) => e.message ).join( '; ' )}`}

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

  const edges = await BillOfMaterial.findAll( {attributes: ['parentProductId', 'materialProductId'], raw: true} )

  if( bomDescendants( materialProductId, edges ).has( Number( parentProductId ) ) )
    return {error: 'That product is already made (directly or further down) from this one, so adding it as a material would form a cycle.'}

  try
  {
    const line = await BillOfMaterial.create( {parentProductId, materialProductId, quantity} )

    await markProductsCostStale( [parentProductId] )

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

  await line.update( {quantity} )
  await markProductsCostStale( [line.parentProductId] )

  return line.toJSON()
}

// Which of the material's suppliers this line's "bom" CostFactor cost
// should use - null (the default) means "the material's preferred
// supplier, else the cheapest one available," recomputed live rather than stored, so it tracks supplier price
// changes automatically until someone picks a specific supplier here
// (see libs/costFactors.js's resolveSupplierCost). Only meaningful, and
// only exposed as a picker in BomEditor.jsx, once a material has more
// than one supplier on file.
export async function setBomLineSupplier( id, supplierId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const line = await BillOfMaterial.findByPk( id )
  if( !line )
    notFound()

  await line.update( {supplierId: supplierId || null} )
  await markProductsCostStale( [line.parentProductId] )

  return line.toJSON()
}

// Every product id reachable from `productId` by following bill-of-
// materials lines downward (its materials, their materials, ...). Listing
// `productId` in the BOM of any of these would create a cycle.
function bomDescendants( productId, edges )
{
  const materialsByParent = {}
  for( const {parentProductId, materialProductId} of edges )
    (materialsByParent[parentProductId] ??= []).push( materialProductId )

  const seen = new Set()
  const stack = [Number( productId )]

  while( stack.length )
    for( const id of materialsByParent[stack.pop()] ?? [] )
      if( !seen.has( id ) )
      {
        seen.add( id )
        stack.push( id )
      }

  return seen
}

// For the Bill of Materials tab's material picker: every other product,
// flagged `wouldCycle` when it's made (at any depth) from `productId` -
// listing it as one of this product's materials would form a cycle.
export async function readBomMaterialChoices( productId )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  const id = Number( productId )
  const [products, edges] = await Promise.all([
    Product.findAll( {attributes: ['id', 'name', 'sku', 'type', 'units', 'status'], order: [['name', 'ASC']], raw: true} ),
    BillOfMaterial.findAll( {attributes: ['parentProductId', 'materialProductId'], raw: true} ),
  ])

  // Ancestors: follow the edges upward instead, by flipping them.
  const ancestors = bomDescendants( id, edges.map( e => ({parentProductId: e.materialProductId, materialProductId: e.parentProductId}) ) )

  return products
    .filter( (p) => p.id !== id )
    .map( (p) => ({...p, wouldCycle: ancestors.has( p.id )}) )
}

// For the Overview tab's "Used as a material" review popup: every other
// product, flagged with whether it currently lists `productId` in its
// bill of materials, and whether it can't (it's already one of this
// product's own materials, so listing this product would form a cycle).
export async function readUsedInChoices( productId )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const id = Number( productId )
  const [products, edges] = await Promise.all([
    Product.findAll( {attributes: ['id', 'name', 'sku'], order: [['name', 'ASC']], raw: true} ),
    BillOfMaterial.findAll( {attributes: ['parentProductId', 'materialProductId'], raw: true} ),
  ])

  const parents = new Set( edges.filter( (e) => e.materialProductId === id ).map( (e) => e.parentProductId ) )
  const descendants = bomDescendants( id, edges )

  return products
    .filter( (p) => p.id !== id )
    .map( (p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      usesThis: parents.has( p.id ),
      wouldCycle: descendants.has( p.id ),
    }) )
}

// Add `productId` (quantity 1) to the bills of materials of `addParentIds`,
// and drop every line for it from those of `removeParentIds`.
export async function updateProductUsedIn( productId, addParentIds, removeParentIds )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const id = Number( productId )
  const add = addParentIds.map( Number )
  const remove = removeParentIds.map( Number )

  if( add.includes( id ) )
    return {error: 'A product cannot list itself as a material.'}

  try
  {
    await sequelize.transaction( async t => {
      const edges = await BillOfMaterial.findAll( {attributes: ['parentProductId', 'materialProductId'], raw: true, transaction: t} )
      const descendants = bomDescendants( id, edges )

      if( add.some( (parentId) => descendants.has( parentId ) ) )
        throw new Error( 'One of those products is already a material of this one, so listing this product in its bill of materials would form a cycle.' )

      // Skip parents that already list this product (stale popup data).
      const existing = new Set( edges.filter( (e) => e.materialProductId === id ).map( (e) => e.parentProductId ) )

      await BillOfMaterial.bulkCreate(
        add.filter( (parentId) => !existing.has( parentId ) ).map( (parentId) => ({parentProductId: parentId, materialProductId: id, quantity: 1}) ),
        {transaction: t}
      )

      if( remove.length )
        await BillOfMaterial.destroy( {where: {materialProductId: id, parentProductId: remove}, transaction: t} )
    })

    await markProductsCostStale( [...add, ...remove] )

    return {success: true}
  }
  catch( error )
  {
    return {error: error.message || 'An unexpected error occurred while updating the bills of materials'}
  }
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

  await line.destroy()

  await markProductsCostStale( [line.parentProductId] )
}

// --- Images --------------------------------------------------------------
//
// Images live in S3 and are referenced by URL. The same Image row may be
// attached to more than one product, so attaching a URL reuses the
// existing Image row for that URL if one exists rather than duplicating it.

export async function addProductImage( productId, url, altText )
{
  const session = await auth()
  if( !session )
    unauthorized()

  if( !url )
    return {error: 'Image URL is required'}

  await sequelize.sync()

  try
  {
    return await sequelize.transaction( async t => {
      const [image] = await Image.findOrCreate({
        where: {url},
        defaults: {url, altText},
        transaction: t,
      })

      const maxSortOrder = await ProductImage.max( 'sortOrder', {where: {productId}, transaction: t} )
      const link = await ProductImage.create({
        productId,
        imageId: image.id,
        sortOrder: Number.isFinite( maxSortOrder ) ? maxSortOrder + 1 : 0,
      }, {transaction: t})

      return {success: true, id: link.id, image: image.toJSON()}
    })
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError || error instanceof Sequelize.UniqueConstraintError )
      return {error: 'That image is already attached to this product.'}

    return {error: error.message || 'An unexpected error occurred while adding the image'}
  }
}

// Unlinks the image from this product only - the shared Image row (and any
// other product it's attached to) is untouched.
export async function removeProductImage( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const link = await ProductImage.findByPk( id )
  if( !link )
    notFound()

  await link.destroy()
}

export async function reorderProductImage( id, sortOrder )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const link = await ProductImage.findByPk( id )
  if( !link )
    notFound()

  await link.update( {sortOrder} )
  return link.toJSON()
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

    case 'picture frame':
      await PictureFrameInfo.create({
        productId: data.id,
        width: data.pictureFrameInfo.width,
        height: data.pictureFrameInfo.height,
        thickness: data.pictureFrameInfo.thickness,
        channel: data.pictureFrameInfo.channel,
        border: data.pictureFrameInfo.border,
        photoWidth: data.pictureFrameInfo.photoWidth,
        photoHeight: data.pictureFrameInfo.photoHeight,
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

    case 'mirror glass':
      await MirrorGlassInfo.create({
        productId: data.id,
        shape: data.mirrorGlassInfo.shape,
        width: data.mirrorGlassInfo.width,
        height: data.mirrorGlassInfo.height,
        thickness: data.mirrorGlassInfo.thickness,
        bevel: data.mirrorGlassInfo.bevel,
        contourId: data.mirrorGlassInfo.contourId,
      }, {transaction: t})
      break

    case 'wooden base':
      await WoodenBaseInfo.create({
        productId: data.id,
        outsideId: data.woodenBaseInfo.outsideId,
        insideId: data.woodenBaseInfo.insideId,
        rabbetId: data.woodenBaseInfo.rabbetId,
        width: data.woodenBaseInfo.width,
        height: data.woodenBaseInfo.height,
        thickness: data.woodenBaseInfo.thickness,
        border: data.woodenBaseInfo.border,
        piecesPerSheet: data.woodenBaseInfo.piecesPerSheet,
        glassPiecesPerSheet: data.woodenBaseInfo.glassPiecesPerSheet,
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

    case 'birdhouse base':
      await BirdhouseBaseInfo.create({
        productId: data.id,
        width: data.birdhouseBaseInfo?.width,
        height: data.birdhouseBaseInfo?.height,
        depth: data.birdhouseBaseInfo?.depth,
      }, {transaction: t})
      break

    // 'grout', 'kit', and 'other' have no type-specific Info table.
  }
}

async function clearProductInfo( productId, t )
{
  await Promise.all([
    BeadInfo.destroy({ where: {productId}, transaction: t }),
    BirdhouseBaseInfo.destroy({ where: {productId}, transaction: t }),
    PictureFrameInfo.destroy({ where: {productId}, transaction: t }),
    MillefioriInfo.destroy({ where: {productId}, transaction: t }),
    MirrorGlassInfo.destroy({ where: {productId}, transaction: t }),
    WoodenBaseInfo.destroy({ where: {productId}, transaction: t }),
    TileInfo.destroy({ where: {productId}, transaction: t }),
  ])
}
