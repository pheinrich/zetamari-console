'use server'

import bcrypt from 'bcryptjs'
import User from '@/db/models/User'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

export async function createUser( name, email, password )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()

  // NB: password is intentionally passed through unhashed - User's
  // beforeCreate hook hashes it. Hashing here too would double-hash it and
  // make the account impossible to log into.
  return await User.create( {name, email, password} )
}

export async function readUser( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await User.findByPk( id )
}

export async function readUsers()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await User.findAll()
}

export async function updateUser( id, name, email, password )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( id )

  if( !user )
    throw new Error( 'User not found', {cause: 404} )

  // User has no beforeUpdate hook (only beforeCreate), so this path has to
  // hash the password itself when one is supplied.
  const hashedPassword = password ? await bcrypt.hash( password, 10 ) : user.password
  return await user.update( {name, email, password: hashedPassword} )
}

export async function deleteUser( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( id )

  if( !user )
    throw new Error( 'User not found', {cause: 404} )

  return await user.destroy()
}
