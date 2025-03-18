import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readMaterial } from '@/db/actions/material'

export default async function MaterialPage( {params} )
{
  const {id} = await params
  const material = await readMaterial( id, true )

  if( !material )
    return notFound()

  const beadInfo = await material.getBeadInfo()
  const substrateInfo = await material.getSubstrateInfo()
  const tileInfo = await material.getTileInfo()

  console.log( await substrateInfo.getRabbet() )

  return (
    <div>
      <h1>Material: {material.name}</h1>
      { substrateInfo && <>
        Outside Contour: <Link href={`/contours/${substrateInfo.outsideId}`}>{substrateInfo.outsideId}</Link><br/>
        Inside Contour: <Link href={`/contours/${substrateInfo.insideId}`}>{substrateInfo.insideId}</Link><br/>
        Rabbet Contour: <Link href={`/contours/${substrateInfo.rabbetId}`}>{substrateInfo.rabbetId}</Link><br/>
        Dimensions: {substrateInfo.width} x {substrateInfo.height}<br/>
        Border: {substrateInfo.border}
      </>}
    </div>
  )
}
