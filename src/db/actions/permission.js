'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Permission from '@/db/models/Permission'
import Role from '@/db/models/Role'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createPermission( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}

  try
  {
    const permission = await Permission.create( {
      name: data.name,
      description: data.description || null,
    } )

    return {success: true, id: permission.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the permission'}
  }
}

export async function readPermission( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const permission = await Permission.findByPk( id )

  return permission?.toJSON()
}

// Includes each Permission's granting Roles (rendered as chips on the
// list page), mirroring the demo Permissions page's assignedTo column.
export async function readPermissions()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const permissions = await Permission.findAll( {include: [Role], order: [['name', 'ASC']]} )

  return permissions.map( p => p.toJSON() )
}

export async function updatePermission( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const permission = await Permission.findByPk( data.id )

  if( !permission )
    notFound()

  await permission.update( {
    name: data.name,
    description: data.description || null,
  } )

  return permission.toJSON()
}

export async function deletePermission( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const permission = await Permission.findByPk( id )

  if( !permission )
    notFound()

  return permission.destroy()
}
