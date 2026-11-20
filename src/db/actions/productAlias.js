'use server'

import { unauthorized } from 'next/navigation'

import ProductAlias from '@/db/models/ProductAlias'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Product Aliases - channel SKUs known to mean a Product (see
// ProductAlias.js). Created by matching a Channel Order Line by hand;
// listed and removed on the product's page.

async function requireSession()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
}

export async function readProductAliases( productId )
{
  await requireSession()

  const aliases = await ProductAlias.findAll( {where: {productId}, order: [['sku', 'ASC']]} )

  return aliases.map( a => a.toJSON() )
}

// Removing an alias doesn't unmatch lines it already matched.
export async function deleteProductAlias( id )
{
  await requireSession()

  await ProductAlias.destroy( {where: {id}} )

  return {success: true}
}
