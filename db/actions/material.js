'use server'

import { Sequelize } from 'sequelize'
import BeadInfo from '@/db/models/BeadInfo'
import Contour from '@/db/models/Contour'
import FrameInfo from '@/db/models/FrameInfo'
import Material from '@/db/models/Material'
import MillefioriInfo from '@/db/models/MillefioriInfo'
import MirrorInfo from '@/db/models/MirrorInfo'
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

  const data = {}, info = {};
  ['name', 'type', 'sku', 'units', 'weight', 'description'].forEach( f => {
    data[f] = formData.get( f )
  })

  if( !data.name || !data.type || !data.sku )
    return {error: 'Name, type, and sku are required'}

  try
  {
    const result = await sequelize.transaction( async t => {
      const material = await Material.create( data )

      switch( data.type )
      {
        case 'bead':
          ['type', 'finish', 'shape', 'color', 'length', 'height', 'thickness'].forEach( f => {
            info[f] = formData.get( f )
          })
          await BeadInfo.create( {...info, materialId: material.id} )
          break

        case 'frame':
          ['width', 'height', 'thickness', 'channel', 'border', 'photoWidth', 'photoHeight'].forEach( f => {
            info[f] = formData.get( f )
          })
          await FrameInfo.create( {...info, materialId: material.id} )
          break

        case 'millefiori':
          ['shape', 'color', 'length', 'width', 'height'].forEach( f => {
            info[f] = formData.get( f )
          })
          await MillefioriInfo.create( {...info, materialId: material.id} )
          break

        case 'mirror':
          ['shape', 'width', 'height', 'thickness', 'bevel'].forEach( f => {
            info[f] = formData.get( f )
          })
          await MirrorInfo.create( {...info, materialId: material.id} )
          break

        case 'substrate':
          ['outsideId', 'insideId', 'rabbetId', 'width', 'height', 'thickness', 'border'].forEach( f => {
            info[f] = formData.get( f )
          })
          await SubstrateInfo.create( {...info, materialId: material.id} )
          break

        case 'tile':
          ['color', 'width', 'height', 'thickness'].forEach( f => {
            info[f] = formData.get( f )
          })
          await TileInfo.create( {...info, materialId: material.id} )
          break
      }
    })
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
