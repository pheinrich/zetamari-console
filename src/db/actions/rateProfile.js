'use server'

import { notFound, unauthorized } from 'next/navigation'
import { Sequelize } from 'sequelize'
import CostFactor from '@/db/models/CostFactor'
import RateProfile from '@/db/models/RateProfile'
import ProfileRate from '@/db/models/ProfileRate'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// --- Cost factors (read-only lookup - seeded by migration) -------------

export async function readCostFactors()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const factors = await CostFactor.findAll( {order: [['id', 'ASC']]} )
  return factors.map( f => f.toJSON() )
}

// --- Rate profiles -------------------------------------------------------

export async function readRateProfiles()
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const profiles = await RateProfile.findAll( {order: [['kind', 'ASC'], ['name', 'ASC']]} )
  return profiles.map( p => p.toJSON() )
}

export async function readRateProfile( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const profile = await RateProfile.findByPk( id, {
    include: [{model: ProfileRate, as: 'rates', include: [{model: CostFactor, as: 'factor'}]}],
  } )

  if( !profile )
    return undefined

  const plain = profile.toJSON()
  plain.rates.sort( (a, b) => a.factor.id - b.factor.id )
  return plain
}

// New custom profiles start with an explicit (0) rate for every existing
// cost factor, same as the two system defaults seeded by the
// 20260716000000-cost-profiles.js migration - unlike ProductCostOverride,
// a rate profile's rates are never "computed," so every factor always
// needs an explicit row.
export async function createRateProfile( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()

  if( !data.name )
    return {error: 'Name is required'}

  try
  {
    const profile = await RateProfile.create( {name: data.name, kind: 'custom'} )
    const factors = await CostFactor.findAll()

    await ProfileRate.bulkCreate(
      factors.map( f => ({rateProfileId: profile.id, costFactorId: f.id, rate: 0}) )
    )

    return {success: true, id: profile.id}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError || error instanceof Sequelize.UniqueConstraintError )
      return {error: error.errors?.map( (e) => e.message ).join( '; ' ) || error.message}

    return {error: error.message || 'An unexpected error occurred while creating the rate profile'}
  }
}

// `rates` is an array of {costFactorId, rate} - every factor's rate gets
// updated in one call, matching how the profile detail page edits the
// whole rate table at once rather than one factor at a time.
export async function updateRateProfile( data )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const profile = await RateProfile.findByPk( data.id )
  if( !profile )
    notFound()

  if( !data.name )
    return {error: 'Name is required'}

  try
  {
    await profile.update( {name: data.name} )

    for( const {costFactorId, rate} of data.rates || [] )
    {
      const [row] = await ProfileRate.findOrCreate({
        where: {rateProfileId: profile.id, costFactorId},
        defaults: {rate: rate || 0},
      })
      await row.update( {rate: rate || 0} )
    }

    return {success: true}
  }
  catch( error )
  {
    if( error instanceof Sequelize.ValidationError || error instanceof Sequelize.UniqueConstraintError )
      return {error: error.errors?.map( (e) => e.message ).join( '; ' ) || error.message}

    return {error: error.message || 'An unexpected error occurred while updating the rate profile'}
  }
}

// The two system defaults (kind='wholesale'/'retail') aren't deletable -
// every product implicitly relies on them existing. Custom profiles that
// are still assigned to products fall back to the standard profile for
// that tier automatically (Product.wholesaleRateProfileId/
// retailRateProfileId are onDelete:'SET NULL'), so no extra "still in
// use" check is needed here beyond that.
export async function deleteRateProfile( id )
{
  const session = await auth()
  if( !session )
    unauthorized()

  await sequelize.sync()
  const profile = await RateProfile.findByPk( id )
  if( !profile )
    notFound()

  if( 'custom' !== profile.kind )
    return {error: 'The standard Wholesale and Retail profiles can’t be deleted.'}

  await profile.destroy()
  return {success: true}
}
