import { notFound } from 'next/navigation'
import { readContour } from '@/db/actions/contour'
import ContourView from '../ContourView'
import ContourViewWithBead from '../ContourViewWithBead'
import ReverseContourForm from '@/components/ReverseContourForm'

export default async function ContourPage( {params} )
{
  const {id} = await params
  const contour = await readContour( id )

  if( !contour )
    return notFound()

  return (
    <>
      <ContourViewWithBead contour={contour} />
      <ReverseContourForm id={id} />
    </>
  )
}
