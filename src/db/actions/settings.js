'use server'

import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Settings is a singleton table - readSettings/updateSettings always
// operate on the first (and only) row, creating it on first write if it
// doesn't exist yet. Backs the company name/logo used on printed
// calculator reports (see calculator/report/ReportOptionsPanel.jsx), plus
// the shop process constants the cost-profile system's computed default
// quantities are derived from (see libs/costFactors.js) - feed rate/power
// draw/electricity rate and the sanding/glueing/grouting per-sq-in time
// constants.
const NUMERIC_FIELDS = [
  'feedRateInPerHr',
  'powerDrawKwh',
  'electricityRatePerKwh',
  'sandingTimePerSqIn',
  'glueingTimePerSqIn',
  'groutingTimePerSqIn',
]

export async function readSettings()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const settings = await Settings.findOne()

  return settings?.toJSON() ?? {companyName: '', logoUrl: ''}
}

export async function updateSettings( data )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const [settings] = await Settings.findOrCreate( {where: {}, defaults: {}} )

  const update = {
    companyName: data.companyName || null,
    logoUrl: data.logoUrl || null,
  }

  // Only touch a numeric field if the caller actually included it - lets
  // ReportOptionsPanel's branding-only save keep calling this with just
  // {companyName, logoUrl} without wiping out the process constants.
  for( const field of NUMERIC_FIELDS )
    if( field in data )
      update[field] = (null == data[field] || '' === data[field]) ? null : Number( data[field] )

  await settings.update( update )

  return settings.toJSON()
}
