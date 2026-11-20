import { Op } from 'sequelize'

import ChannelOrder from '@/db/models/ChannelOrder'
import ChannelOrderLine from '@/db/models/ChannelOrderLine'
import Product from '@/db/models/Product'
import ProductAlias from '@/db/models/ProductAlias'

// Matching Channel Order Lines to Products. Automatic matching is exact
// only: a line's SKU is a Product's SKU, or a Product Alias a person
// confirmed earlier. Anything fuzzier (suggestions - see suggest.js) is
// only ever offered to a person, never applied.
//
// SKU comparisons ignore case and surrounding whitespace: the columns'
// utf8mb3_unicode_ci collation already compares case-insensitively, and
// the Map keys mirror that.

const key = sku => sku.trim().toLowerCase()

// Map key(sku) -> productId for each SKU that matches a Product, else an alias.
export async function matchSkus( skus, transaction )
{
  const wanted = [...new Set( skus.filter( s => s?.trim() ).map( s => s.trim() ) )]

  if( !wanted.length )
    return new Map()

  const [products, aliases] = await Promise.all( [
    Product.findAll( {where: {sku: wanted}, attributes: ['id', 'sku'], transaction} ),
    ProductAlias.findAll( {where: {sku: wanted}, attributes: ['productId', 'sku'], transaction} ),
  ] )

  return new Map( [
    ...aliases.map( a => [key( a.sku ), a.productId] ),
    ...products.map( p => [key( p.sku ), p.id] ),   // a Product's own SKU wins
  ] )
}

// Records that channel SKU `sku` means `productId` (re-pointing an alias
// that meant something else). Not when `sku` is some Product's own SKU -
// that always matches that Product. Returns whether an alias was kept.
export async function rememberAlias( sku, productId, channel, transaction )
{
  sku = sku?.trim()

  if( !sku || await Product.count( {where: {sku}, transaction} ) )
    return false

  const existing = await ProductAlias.findOne( {where: {sku}, transaction} )

  if( existing )
    await existing.update( {productId}, {transaction} )
  else
    await ProductAlias.create( {sku, productId, channel}, {transaction} )

  return true
}

// Matches every unmatched line with SKU `sku` on an order still under
// review ('new') to `productId`; returns how many lines it matched.
export async function matchOpenLinesWithSku( sku, productId, transaction )
{
  const lines = await ChannelOrderLine.findAll( {
    where: {sku: {[Op.ne]: null}, productId: null},
    include: [{model: ChannelOrder, attributes: [], where: {status: 'new'}}],
    attributes: ['id', 'sku'],
    transaction,
  } )

  const ids = lines.filter( l => key( l.sku ) === key( sku ) ).map( l => l.id )

  if( ids.length )
    await ChannelOrderLine.update( {productId}, {where: {id: ids}, transaction} )

  return ids.length
}
