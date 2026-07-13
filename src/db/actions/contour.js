'use server'

import Contour from '@/db/models/Contour'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Takes a single `data` object ({name, svgData}) rather than positional
// args, matching product.js/supplier.js - safe to change since nothing
// called this yet (no create/edit UI existed before this pass).
export async function createContour( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  if( !data.svgData && !data.shapeType )
    throw new Error( 'A basic shape (no path data) requires a shape type', {cause: 400} )

  await sequelize.sync()
  const contour = await Contour.create({
    name: data.name,
    svgData: data.svgData || null,
    shapeType: data.svgData ? null : data.shapeType,
  })
  return contour.toJSON()
}

export async function readContour( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contour = await Contour.findByPk( id )

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
  const contours = await Contour.findAll()
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

  if( !data.svgData && !data.shapeType )
    throw new Error( 'A basic shape (no path data) requires a shape type', {cause: 400} )

  await contour.update({
    name: data.name,
    svgData: data.svgData || null,
    shapeType: data.svgData ? null : data.shapeType,
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