'use server'

import Material from '@/db/models/Material'
import BeadInfo from '@/db/models/BeadInfo'
import SubstrateInfo from '@/db/models/SubstrateInfo'
import TileInfo from '@/db/models/TileInfo'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createMaterial( name, svgData )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await Material.create( {name, svgData} )
}

export async function readMaterial( id, eager )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  if( eager )
    return await Material.findOne({
      where: { id: id },
      include: { all: true, nested: true },
    })
  else
    return await Material.findByPk( id )
}

export async function readMaterials()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await Material.findAll()
}

export async function updateMaterial( id, name, svgData )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const material = await Material.findByPk( id )

  if( !material )
    throw new Error( 'Material not found', {cause: 404} )

  return await Material.update( {name, svgData} )
}

export async function deleteMaterial( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const material = await Material.findByPk( id )

  if( !material )
    throw new Error( 'Material not found', {cause: 404} )

  return await material.destroy()
}
