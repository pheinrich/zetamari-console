'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import Role from '@/db/models/Role'
import Permission from '@/db/models/Permission'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createRole( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}

  try
  {
    const role = await Role.create( {
      name: data.name,
      description: data.description || null,
    } )

    return {success: true, id: role.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
      return {error: error.errors.map( (e) => e.message ).join( '; ' )}

    return {error: error.message || 'An unexpected error occurred while creating the role'}
  }
}

export async function readRole( id, eager )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const role = await Role.findByPk( id, eager ? {include: [Permission]} : undefined )

  return role?.toJSON()
}

export async function readRoles()
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const roles = await Role.findAll( {include: [Permission], order: [['name', 'ASC']]} )

  return roles.map( r => r.toJSON() )
}

export async function updateRole( data )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const role = await Role.findByPk( data.id )

  if( !role )
    notFound()

  await role.update( {
    name: data.name,
    description: data.description || null,
  } )

  return role.toJSON()
}

export async function deleteRole( id )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const role = await Role.findByPk( id )

  if( !role )
    notFound()

  await role.destroy()
}

// Replaces a Role's full set of granted Permissions in one call - the
// Role form's Permissions multi-select always submits the complete
// desired set rather than individual add/remove deltas.
export async function setRolePermissions( roleId, permissionIds )
{
  const session = await auth()

  if( !session )
    unauthorized()

  await sequelize.sync()
  const role = await Role.findByPk( roleId )

  if( !role )
    notFound()

  await role.setPermissions( permissionIds || [] )

  return {success: true}
}
