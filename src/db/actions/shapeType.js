'use server'

import ShapeType from '@/db/models/ShapeType'
import sequelize from '@/db/sequelize'
import { auth } from '@/lib/auth'

// Every shape family a Contour can belong to (see ShapeType.js and
// Contour.js's `shape` association) - used by ContourForm to populate
// both the parametric-shape Select (filtered to key-bearing rows only)
// and the custom-shape "Shape Family" autocomplete's suggestions.
export async function readShapeTypes()
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  const shapeTypes = await ShapeType.findAll( {order: [['name', 'ASC']]} )
  return shapeTypes.map( s => s.toJSON() )
}
