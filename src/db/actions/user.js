'use server'

import bcrypt from 'bcryptjs'
import User from '@/db/models/User'
import sequelize from '@/db/sequelize'
import { getServerSession } from 'next-auth/next'

export async function createUser( name, email, password )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  const hashedPassword = await bcrypt.hash( password, 10 )
  await sequelize.sync()
  return await User.create( {name, email, password: hashedPassword} )
}

export async function readUser( id )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await User.findByPk( id )
}

export async function readUsers()
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  return await User.findAll()
}

export async function updateUser( id, name, email, password )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( id )

  if( !user )
    throw new Error( 'User not found', {cause: 404} )

  const hashedPassword = password ? await bcrypt.hash( password, 10 ) : user.password
  return await User.update( {name, email, password: hashedPassword} )
}

export async function deleteUser( id )
{
  const session = await getServerSession()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const user = await User.findByPk( id )

  if( !user )
    throw new Error( 'User not found', {cause: 404} )

  return await user.destroy()
}
