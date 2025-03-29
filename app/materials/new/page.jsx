import MaterialForm from '../MaterialForm'
import { readContours } from '@/db/actions/contour'
import { createMaterial } from '@/db/actions/material'

export default async function NewMaterialPage()
{
  const contours = await readContours()

  return <MaterialForm onSubmit={createMaterial} contourList={contours.map( (c) => ({id: c.id, name: c.name}) )} />
}