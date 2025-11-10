'use server'

import { notFound, unauthorized } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Sequelize } from 'sequelize'
import BeadInfo from '@/db/models/BeadInfo'
import Contour from '@/db/models/Contour'
import FrameInfo from '@/db/models/FrameInfo'
import Material from '@/db/models/Material'
import MillefioriInfo from '@/db/models/MillefioriInfo'
import MirrorInfo from '@/db/models/MirrorInfo'
import SubstrateInfo from '@/db/models/SubstrateInfo'
import Supplier from '@/db/models/Supplier'
import TileInfo from '@/db/models/TileInfo'
import sequelize from '@/db/sequelize'

export async function createMaterial( data )
{
  const session = await getServerSession()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name || !data.type || !data.sku )
    return {error: 'Name, type, and sku are required'}

  try
  {
    const result = await sequelize.transaction( async t => {
      const material = await Material.create({
        name: data.name,
        type: data.type,
        sku: data.sku,
        units: data.units,
        weight: data.weight,
        description: data.description,
      })

      setMaterialInfo( {...data, id: material.id} )
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

    return {error: error.message || 'An unexpected error occurred while creating the material'}
  }
}

export async function readMaterial( id, eager )
{
  const session = await getServerSession()
  if( !session )
    unauthorized()

  await sequelize.sync()
  let material

  if( eager )
  {
    // material = await Material.findOne({
    //   where: { id: id },
    //   include: [ {all: true, nested: true, through: {attributes: ['*']}} ],
    // })
    material = await Material.findByPk( id, {
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
        { model: TileInfo, as: 'tileInfo' }
      ]
    })
  }
  else
    material = await Material.findByPk( id )

  return material?.toJSON()
}

export async function readMaterials()
{
  const session = await getServerSession()
  if( !session )
    unauthorized()

  await sequelize.sync()
  return await Material.findAll()
}

export async function updateMaterial( data )
{
  const session = await getServerSession()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const material = await Material.findByPk( data.id )
  if( !material )
    notFound()

  try
  {
    const result = await sequelize.transaction( async t => {
      const material = await Material.update(
      {
        name: data.name,
        type: data.type,
        sku: data.sku,
        units: data.units,
        weight: data.weight,
        description: data.description,
      },
      {
        where: {id: data.id}
      })

      setMaterialInfo( data )
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

    return {error: error.message || 'An unexpected error occurred while updating the material'}
  }
}

export async function deleteMaterial( id )
{
  const session = await getServerSession()
  if( !session )
    unauthorized()

  await sequelize.sync()

  const material = await Material.findByPk( id )
  if( !material )
    notFound()

  await material.destroy()
}

// Create or update the extra info row associated with a material. This may in-
// volve deleting an old entry if the type has changed (e.g. Bead -> Tile).
// This method should be called inside a transaction block, to ensure its
// side effects can be unwound if an error occurs.
async function setMaterialInfo( data )
{
  await Promise.all([
    BeadInfo.destroy({ where: {materialId: data.id} }),
    FrameInfo.destroy({ where: {materialId: data.id} }),
    MillefioriInfo.destroy({ where: {materialId: data.id} }),
    MirrorInfo.destroy({ where: {materialId: data.id} }),
    SubstrateInfo.destroy({ where: {materialId: data.id} }),
    TileInfo.destroy({ where: {materialId: data.id} }),
  ])

  switch( data.type )
  {
    case 'bead':
      await BeadInfo.create({
        materialId: data.id,
        category: data.beadInfo.category,
        finish: data.beadInfo.finish,
        shape: data.beadInfo.shape,
        color: data.beadInfo.color,
        length: data.beadInfo.length,
        height: data.beadInfo.height,
        thickness: data.beadInfo.thickness,
      })
      break

    case 'frame':
      await FrameInfo.create({
        materialId: data.id,
        width: data.frameInfo.width,
        height: data.frameInfo.height,
        thickness: data.frameInfo.thickness,
        channel: data.frameInfo.channel,
        border: data.frameInfo.border,
        photoWidth: data.frameInfo.photoWidth,
        photoHeight: data.frameInfo.photoHeight,
      })
      break

    case 'millefiori':
      await MillefioriInfo.create({
        materialId: data.id,
        shape: data.millefioriInfo.shape,
        color: data.millefioriInfo.color,
        length: data.millefioriInfo.length,
        width: data.millefioriInfo.width,
        height: data.millefioriInfo.height,
      })
      break

    case 'mirror':
      await MirrorInfo.create({
        materialId: data.id,
        shape: data.mirrorInfo.shape,
        width: data.mirrorInfo.width,
        height: data.mirrorInfo.height,
        thickness: data.mirrorInfo.thickness,
        bevel: data.mirrorInfo.bevel,
      })
      break

    case 'substrate':
      await SubstrateInfo.create({
        materialId: data.id,
        outsideId: data.substrateInfo.outsideId,
        insideId: data.substrateInfo.insideId,
        rabbetId: data.substrateInfo.rabbetId,
        width: data.substrateInfo.width,
        height: data.substrateInfo.height,
        thickness: data.substrateInfo.thickness,
        border: data.substrateInfo.border,
      })
      break

    case 'tile':
      await TileInfo.create({
        materialId: data.id,
        color: data.tileInfo.color,
        width: data.tileInfo.width,
        height: data.tileInfo.height,
        thickness: data.tileInfo.thickness,
      })
      break
  }
}
