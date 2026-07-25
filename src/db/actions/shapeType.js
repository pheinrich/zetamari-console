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

// Sets (or, with productId null, clears) the Wooden Base product that
// seeds a brand-new shape's dimensions when this family is picked from
// the Visualizer's "New" dropdown - see ShapeType.js's
// prototypeWoodenBase association. Called from a "Set as Prototype"
// button on that product's own page (WoodenBaseInfoView.jsx); unlike the
// productCost.js set/revert pairs, this isn't a sparse per-product
// override of a shop-wide default - it's a single shop-wide choice per
// shape family, so one function handles both setting and clearing.
export async function setShapeTypePrototype( shapeTypeId, productId )
{
  const session = await auth()
  if( !session )
    throw new Error( 'Unauthorized', {cause: 401} )

  await sequelize.sync()
  await ShapeType.update(
    {prototypeWoodenBaseId: productId ?? null},
    {where: {id: shapeTypeId}}
  )
}
