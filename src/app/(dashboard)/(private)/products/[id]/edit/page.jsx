import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'
import { readContours } from '@/db/actions/contour'
import { readProduct } from '@/db/actions/product'
import { readProductCosts } from '@/db/actions/productCost'

export default async function EditProductPage( {params} )
{
  const {id} = await params
  const product = await readProduct( id, true )
  if( !product )
    return notFound()

  const [contours, costs] = await Promise.all([
    readContours(),
    readProductCosts( product.id ),
  ])

  return (
    <ProductForm
      contourList={contours.map( (c) => ({id: c.id, name: c.name}) )}
      initialData={product}
      costs={costs}
    />
  )
}
