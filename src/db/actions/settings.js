'use server'

import Settings from '@/db/models/Settings'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Settings is a singleton table - readSettings/updateSettings always
// operate on the first (and only) row, creating it on first write if it
// doesn't exist yet. Currently just backs the company name/logo used on
// printed calculator reports (see calculator/report/ReportOptionsPanel.jsx).
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

  await settings.update({
    companyName: data.companyName || null,
    logoUrl: data.logoUrl || null,
  })

  return settings.toJSON()
}
