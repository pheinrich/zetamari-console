'use server'

import Contour from '@/db/models/Contour'
import ShapeType from '@/db/models/ShapeType'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Resolves the shapeTypeId to save: for a parametric ("no svgData")
// contour, the form already submits an existing ShapeType's id directly
// (shapeTypeId). For a custom (svgData) contour, the form instead submits
// a free-typed family name (shapeName) - findOrCreate reuses an existing
// ShapeType with that name (e.g. adding "Willow Leaf, Inside" to join an
// existing "Willow Leaf, Outside") or creates a new one on the fly.
async function resolveShapeTypeId( data )
{
  if( !data.svgData )
    return data.shapeTypeId

  const [shapeType] = await ShapeType.findOrCreate({
    where: {name: data.shapeName},
    defaults: {name: data.shapeName},
  })
  return shapeType.id
}

// Takes a single `data` object ({name, svgData}) rather than positional
// args, matching product.js/supplier.js - safe to change since nothing
// called this yet (no create/edit UI existed before this pass).
export async function createContour( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  if( !data.svgData && !data.shapeTypeId )
    throw new Error( 'A basic shape (no path data) requires a shape type', {cause: 400} )
  if( data.svgData && !data.shapeName )
    throw new Error( 'A custom shape requires a shape family name', {cause: 400} )

  await sequelize.sync()

  const shapeTypeId = await resolveShapeTypeId( data )
  const contour = await Contour.create({
    name: data.name,
    svgData: data.svgData || null,
    shapeTypeId,
  })
  return contour.toJSON()
}

export async function readContour( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contour = await Contour.findByPk( id, {include: [{association: 'shape'}]} )

  // Plain object, not a Sequelize instance - this crosses the server/client
  // boundary into 'use client' form/table components, which can't
  // serialize a model instance (same reasoning as readProduct/readSupplier).
  return contour?.toJSON()
}

export async function readContours()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contours = await Contour.findAll( {include: [{association: 'shape'}]} )
  return contours.map( c => c.toJSON() )
}

export async function updateContour( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contour = await Contour.findByPk( data.id )

  if( !contour )
    throw new Error( 'Contour not found', {cause: 404} )

  if( !data.svgData && !data.shapeTypeId )
    throw new Error( 'A basic shape (no path data) requires a shape type', {cause: 400} )
  if( data.svgData && !data.shapeName )
    throw new Error( 'A custom shape requires a shape family name', {cause: 400} )

  const shapeTypeId = await resolveShapeTypeId( data )
  await contour.update({
    name: data.name,
    svgData: data.svgData || null,
    shapeTypeId,
  })
  return contour.toJSON()
}

export async function deleteContour( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contour = await Contour.findByPk( id )

  if( !contour )
    throw new Error( 'Contour not found', {cause: 404} )

  return await contour.destroy()
}

export async function reverse( id )
{
}
