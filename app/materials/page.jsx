import { readMaterials } from '@/db/actions/material'

export default async function MaterialsPage()
{
  const materials = await readMaterials()

  return (
    <div>
      <h1>Materials List</h1>
      <ul>
        {materials.map( material => (
          <li key={material.id}>[{material.id}] {material.name} ({material.sku}): {material.type}</li>
        ))}
      </ul>
    </div>
  )
}
