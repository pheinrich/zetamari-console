import { notFound } from 'next/navigation'
import { readMaterial } from '@/db/actions/material'

export default async function MaterialPage( {params} )
{
  const {id} = await params
  const material = await readMaterial( id, true )

  if( !material )
    return notFound()

/*
  const beadInfo = await material.getBeadInfo()
  const substrateInfo = await material.getSubstrateInfo()
  const tileInfo = await material.getTileInfo()
*/
  const substrateInfo = await material.getSubstrateInfo()
  console.log( substrateInfo )
  return (
    <div>
      <h1>Material: {material.name}</h1>
      { substrateInfo && <>
        Outside Contour: {substrateInfo.outsideId}<br/>
        Inside Contour: {substrateInfo.insideId}<br/>
        Rabbet Contour: {substrateInfo.rabbetId}<br/>
        Dimensions: {substrateInfo.width} x {substrateInfo.height}<br/>
        Border: {substrateInfo.border}
      </>}
    </div>
  )
}
