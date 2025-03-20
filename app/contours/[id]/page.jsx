import { notFound } from 'next/navigation'
import { readContour } from '@/db/actions/contour'
import ContourView from '@/app/Contours/ContourView'
import ContourViewWithBead from '@/app/Contours/ContourViewWithBead'

export default async function ContourPage( {params} )
{
  const {id} = await params
  const contour = await readContour( id )

  if( !contour )
    return notFound()

  return (
    <>
      <ContourView contour={contour} />
      <ContourViewWithBead contour={contour} />
    </>
  )
}
