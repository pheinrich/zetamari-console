'use server'

import bcrypt from 'bcryptjs'
import { Sequelize } from 'sequelize'
import User from '@/db/models/User'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Never select the hashed password out to the client - these two are the
// only reads used by the admin User CRUD UI.
const PUBLIC_ATTRIBUTES = ['id', 'name', 'email']

export async function createUser( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()

  try
  {
    // NB: password is intentionally passed through unhashed - User's
    // beforeCreate hook hashes it. Hashing here too would double-hash it
    // and make the account impossible to log into.
    const user = await User.create( {name: data.name, email: data.email, password: data.password} )
    return {success: true, id: user.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while creating the user'}
  }
}

export async function readUser( id )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( id, {attributes: PUBLIC_ATTRIBUTES} )
  return user?.toJSON()
}

export async function readUsers()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const users = await User.findAll( {attributes: PUBLIC_ATTRIBUTES} )
  return users.map( u => u.toJSON() )
}

export async function updateUser( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( data.id )

  if( !user )
    throw new Error( 'User not found', {cause: 404} )

  try
  {
    // User has no beforeUpdate hook (only beforeCreate), so this path has
    // to hash the password itself when one is supplied. An empty/omitted
    // password leaves the existing one unchanged.
    const hashedPassword = data.password ? await bcrypt.hash( data.password, 10 ) : user.password
    await user.update( {name: data.name, email: data.email, password: hashedPassword} )
    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError )
    {
      const message = error.errors.map( (e) => e.message ).join( '; ' )
      return {error: `Validation failed: ${message}`}
    }

    return {error: error.message || 'An unexpected error occurred while updating the user'}
  }
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
