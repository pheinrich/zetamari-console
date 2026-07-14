import ContourForm from '../ContourForm'
import { readShapeTypes } from '@/db/actions/shapeType'

export default async function NewContourPage()
{
  const shapeTypes = await readShapeTypes()

  return <ContourForm shapeTypes={shapeTypes} />
}
