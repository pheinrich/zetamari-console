import Contour from '@/db/models/Contour'
import NewMaterialForm from './NewMaterialForm'
import { readContours } from '@/db/actions/contour'

export default async function NewMaterialPage()
{
  const contours = await readContours()
  return <NewMaterialForm contourList={contours.map( (c) => ({id: c.id, name: c.name}) )} />
}