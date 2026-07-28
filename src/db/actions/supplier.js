'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import BillOfMaterial from '@/db/models/BillOfMaterial'
import Product from '@/db/models/Product'
import Supplier from '@/db/models/Supplier'
import SupplierProduct from '@/db/models/SupplierProduct'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'
import { markProductsCostStale } from '@/db/actions/productCost'

// A material's price feeds the "bom" CostFactor (libs/costFactors.js's
// resolveSupplierCost()) for every product with a BOM line consuming
// that material - whether that line names this supplier specifically, or
// (the common case) just wants the cheapest available price, which this
// change could itself alter. Either way, every parent product with a BOM
// line for `materialProductId` needs its cache invalidated.
async function markProductsUsingMaterialStale( materialProductId )
{
  const lines = await BillOfMaterial.findAll({
    where: {materialProductId},
    attributes: ['parentProductId'],
  })

  await markProductsCostStale( lines.map( l => l.parentProductId ) )
}

export async function createSupplier( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}

  try
  {
    const supplier = await Supplier.create({
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      url: data.url,
      notes: data.notes,
    })

    return {success: true, id: supplier.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while creating the supplier'}
  }
}

export async function readSupplier( id, eager )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( eager )
  {
    const supplier = await Supplier.findByPk( id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: {attributes: ['id', 'partNumber', 'url', 'cost']},
        },
      ],
    })

    return supplier?.toJSON()
  }

  const supplier = await Supplier.findByPk( id )
  return supplier?.toJSON()
}

export async function readSuppliers()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const suppliers = await Supplier.findAll()

  // Product count per supplier, for the list view - a single grouped
  // query rather than eager-loading every SupplierProduct row.
  const counts = await SupplierProduct.findAll({
    attributes: ['supplierId', [Sequelize.fn( 'COUNT', Sequelize.col( 'id' ) ), 'count']],
    group: ['supplierId'],
  })
  const countBySupplierId = {}
  for( const c of counts )
    countBySupplierId[c.supplierId] = Number( c.get( 'count' ) )

  // Plain objects, not Sequelize instances - needed once this crosses into
  // a 'use client' table component (same reasoning as readProduct).
  return suppliers.map( s => ({...s.toJSON(), productCount: countBySupplierId[s.id] || 0}) )
}

export async function updateSupplier( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const supplier = await Supplier.findByPk( data.id )
  if( !supplier )
    notFound()

  await supplier.update({
    name: data.name,
    email: data.email,
    address: data.address,
    phone: data.phone,
    url: data.url,
    notes: data.notes,
  })
  return supplier.toJSON()
}

export async function deleteSupplier( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const supplier = await Supplier.findByPk( id )
  if( !supplier )
    notFound()

  // Fetched before destroy() cascades away this supplier's pricing rows
  // (SupplierProducts) - every material it priced could have BOM lines
  // pointing at it, so every one of those materials' cost needs
  // invalidating (see markProductsUsingMaterialStale() above, which
  // handles an array of material ids as readily as one).
  const priceLinks = await SupplierProduct.findAll( {where: {supplierId: id}, attributes: ['productId']} )

  const result = await supplier.destroy()

  await markProductsUsingMaterialStale( priceLinks.map( l => l.productId ) )

  return result
}

// --- Per-supplier product pricing --------------------------------------

export async function setSupplierProductPrice( supplierId, productId, partNumber, cost, url )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  try
  {
    const link = await SupplierProduct.create( {supplierId, productId, partNumber, cost, url} )

    await markProductsUsingMaterialStale( productId )

    return {success: true, id: link.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError || error instanceof Sequelize.UniqueConstraintError )
      return {error: error.errors?.map( (e) => e.message ).join( '; ' ) || error.message}

    return {error: error.message || 'An unexpected error occurred while setting the supplier price'}
  }
}

// `updates` should only contain the fields being changed (e.g. {cost: 4.5})
// - passed straight to Sequelize's update() so omitted fields are left
// alone, rather than accidentally nulled out.
export async function updateSupplierProductPrice( id, updates )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const link = await SupplierProduct.findByPk( id )
  if( !link )
    notFound()

  await link.update( updates )
  await markProductsUsingMaterialStale( link.productId )

  return link.toJSON()
}

export async function removeSupplierProductPrice( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const link = await SupplierProduct.findByPk( id )
  if( !link )
    notFound()

  const result = await link.destroy()

  await markProductsUsingMaterialStale( link.productId )

  return result
}
