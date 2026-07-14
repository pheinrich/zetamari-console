import { notFound } from 'next/navigation'
import ContourForm from '../../ContourForm'
import { readContour } from '@/db/actions/contour'
import { readShapeTypes } from '@/db/actions/shapeType'

export default async function EditContourPage( {params} )
{
  const {id} = await params
  const [contour, shapeTypes] = await Promise.all([
    readContour( id ),
    readShapeTypes(),
  ])
  if( !contour )
    return notFound()

  return <ContourForm initialData={contour} shapeTypes={shapeTypes} />
}
