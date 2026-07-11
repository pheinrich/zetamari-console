import ProductForm from '../ProductForm'
import { readContours } from '@/db/actions/contour'

export default async function NewProductPage()
{
  const contours = await readContours()

  return <ProductForm contourList={contours.map( (c) => ({id: c.id, name: c.name}) )} />
}
