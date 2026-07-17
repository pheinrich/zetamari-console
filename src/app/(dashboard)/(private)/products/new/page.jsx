import ProductForm from '../ProductForm'
import { readContours } from '@/db/actions/contour'
import { readProduct } from '@/db/actions/product'
import { readProductCosts } from '@/db/actions/productCost'

// Plain "New Product" unless a `from` id is given (the Duplicate action on
// the list page's kebab menu / the detail page's Duplicate button both
// link here as `?from=<id>`) - then the form is pre-populated from that
// product: every field ProductForm already knows how to prefill from
// initialData (name/type/etc + its type-specific Info), plus a snapshot
// of its cost-breakdown Included checkboxes/quantities and bill-of-
// materials lines (ProductForm's duplicateCostRows/initialData.bomLines),
// which createProduct persists alongside the new row once submitted -
// see product.js. Nothing is written until Save is clicked; `id` is
// stripped and `sku` cleared so the create path (and its uniqueness
// checks) runs exactly as it would for a from-scratch product.
export default async function NewProductPage( {searchParams} )
{
  const {from} = await searchParams
  const [contours, source, costs] = await Promise.all([
    readContours(),
    from ? readProduct( from, true ) : null,
    from ? readProductCosts( from ) : null,
  ])

  const contourList = contours.map( (c) => ({id: c.id, name: c.name}) )

  if( !source )
    return <ProductForm contourList={contourList} />

  const initialData = {
    ...source,
    id: undefined,
    sku: '',
    name: `${source.name} (Copy)`,
  }

  const duplicateCostRows = costs.rows.map( row => ({
    costFactorId: row.factor.id,
    label: row.factor.label,
    category: row.factor.category,
    unit: row.factor.unit,
    enabled: row.effectiveEnabled,
    quantity: row.effectiveQuantity,
  }) )

  return (
    <ProductForm
      contourList={contourList}
      initialData={initialData}
      costs={costs}
      duplicateCostRows={duplicateCostRows}
      duplicateFromName={source.name}
    />
  )
}
