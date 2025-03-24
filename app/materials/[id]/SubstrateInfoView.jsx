import Link from 'next/link'
import { build } from '@/lib/mirror'

export default async function SubstrateInfoView( {substrateInfo} )
{
  substrateInfo.outside = await substrateInfo.getOutside()
  
  const mirror = build(
    substrateInfo.width,
    substrateInfo.height,
    substrateInfo.border,
    substrateInfo.outsideId,
    substrateInfo.outside.svgData,
    substrateInfo.inside?.svgData,
    substrateInfo.rabbet?.svgData,    
  )

  return (
    <>
      Outside Contour: <Link href={`/contours/${substrateInfo.outsideId}`}>{substrateInfo.outsideId}</Link><br/>
      Inside Contour: <Link href={`/contours/${substrateInfo.insideId}`}>{substrateInfo.insideId}</Link><br/>
      Rabbet Contour: <Link href={`/contours/${substrateInfo.rabbetId}`}>{substrateInfo.rabbetId}</Link><br/>
      Dimensions: {substrateInfo.width}" x {substrateInfo.height}"<br/>
      Thickness: {substrateInfo.thickness}"<br/>
      Border: {substrateInfo.border}
    </>
  )
}
