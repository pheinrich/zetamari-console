'use server'

import { Sequelize } from 'sequelize'
import BeadInfo from '@/db/models/BeadInfo'
import Contour from '@/db/models/Contour'
import Material from '@/db/models/Material'
import SubstrateInfo from '@/db/models/SubstrateInfo'
import TileInfo from '@/db/models/TileInfo'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createMaterial( prevState, formData )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()

  const name = formData.get( 'name' )
  const type = formData.get( 'type' )
  const sku = formData.get( 'sku' )
  const units = formData.get( 'units' )
  const weight = formData.get( 'weight' )
  const description = formData.get( 'description' )

  if( !name || !type || !sku )
    return {error: 'Name, type, and sku are required'}

  try
  {
    await Material.create( {name, type, sku, units, weight, description} )
    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    if( error instanceof Sequelize.DatabaseError )
      return {error: `Database error: ${error.message}`}

    return {error: error.message || 'An unexpected error occurred while creating the material'}
  }
}

export async function readMaterial( id, eager )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  if( eager )
  {
    const parent = await Material.findOne({
      where: { id: id },
      include: [ {all: true, nested: true} ],
    })
    return parent
  }
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

export async function deleteMaterial( formData )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const id = Number( formData.get( 'id' ) )
  const material = await Material.findByPk( id )

  if( !material )
    throw new Error( 'Material not found', {cause: 404} )

  await material.destroy()
}
