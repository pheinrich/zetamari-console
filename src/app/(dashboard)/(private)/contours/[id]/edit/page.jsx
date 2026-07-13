import { notFound } from 'next/navigation'
import ContourForm from '../../ContourForm'
import { readContour } from '@/db/actions/contour'

export default async function EditContourPage( {params} )
{
  const {id} = await params
  const contour = await readContour( id )
  if( !contour )
    return notFound()

  return <ContourForm initialData={contour} />
}
