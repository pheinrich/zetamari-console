import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'
import { readContours } from '@/db/actions/contour'
import { readProduct } from '@/db/actions/product'

export default async function EditProductPage( {params} )
{
  const {id} = await params
  const product = await readProduct( id, true )
  if( !product )
    return notFound()

  const contours = await readContours()

  return (
    <ProductForm
      contourList={contours.map( (c) => ({id: c.id, name: c.name}) )}
      initialData={product}
    />
  )
}
