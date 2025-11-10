'use server'

import Contour from '@/db/models/Contour'
import sequelize from '@/db/sequelize'
import { getServerSession } from 'next-auth/next'

export async function createContour( name, svgData )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await Contour.create( {name, svgData} )
}

export async function readContour( id )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await Contour.findByPk( id )
}

export async function readContours()
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await Contour.findAll()
}

export async function updateContour( id, name, svgData )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const contour = await Contour.findByPk( id )

  if( !contour )
    throw new Error( 'Contour not found', {cause: 404} )

  return await contour.update( {name, svgData} )
}

export async function deleteContour( id )
{
  const session = await getServerSession()
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