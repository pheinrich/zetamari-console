// Computes each CostFactor's default quantity for a product, live from its
// geometry/attributes rather than a cached value - see the
// ProductCostOverride model for why (an override is the only thing
// persisted; the computed default is always freshly derived so it never
// goes stale). Only products with a substrateInfo (the "complex shape"
// mirror case - see SubstrateInfo.js) have any geometry to derive area/
// cut-distance from; everything else defaults to 0 and relies entirely on
// overrides.
import { build } from './mirror'

// Flat defaults for labor stages that don't correlate with geometry at
// all - design and finishing time are roughly constant regardless of a
// mirror's size, so there's no heuristic to derive them from. In
// minutes, like every other Labor CostFactor (see the
// 20260718000000-labor-quantities-to-minutes.js migration) - these
// quantities are typically well under an hour, so decimal-hour values
// were awkward to read/edit.
const LABOR_DESIGN_MIN = 30
const LABOR_FINISHING_MIN = 5

// Which area-based material CostFactor a BOM component type stands in
// for, once it's actually in the bill of materials - a mirror component
// is glass, a bead/millefiori/tile component is tesserae, a substrate
// component is substrate. Frame/grout/birdhouse/other/assembled (null
// type) components don't correspond to any of the three estimated
// factors, so they don't supersede anything.
const TYPE_TO_FACTOR = {
  mirror: 'glass',
  bead: 'tesserae',
  millefiori: 'tesserae',
  tile: 'tesserae',
  substrate: 'substrate',
}

// Rebuilds the same JSTS geometry the calculator itself uses (see
// libs/mirror.js's build(), also called from SubstrateInfoView.jsx on the
// product detail page) - null if this product has no substrateInfo (not
// a mirror/complex-shape product) to build from.
function buildGeometry( product )
{
  const si = product?.substrateInfo
  if( !si )
    return null

  return build(
    si.width,
    si.height,
    si.border,
    si.outside?.shape?.key,
    si.outside?.svgData,
    si.inside?.svgData,
    si.rabbet?.svgData,
  )
}

// A BOM line's per-unit cost: whichever supplier it explicitly names
// (`line.supplierId`), or the cheapest available SupplierProduct.cost
// for that material if it doesn't name one. `material.suppliers` is
// expected to be eager-loaded with the join's `cost` attribute (see
// productCost.js's loadProductForCosting) - each entry is a Supplier row
// with its SupplierProduct join data nested under `.SupplierProduct`,
// matching the same shape already used on the product detail page's
// SupplierProductView.jsx.
export function resolveSupplierCost( material, supplierId )
{
  const priced = (material?.suppliers ?? [])
    .map( s => ({id: s.id, cost: s.SupplierProduct?.cost}) )
    .filter( s => null != s.cost )

  if( supplierId )
    return priced.find( s => s.id === supplierId )?.cost ?? 0

  return priced.length ? Math.min( ...priced.map( s => s.cost ) ) : 0
}

// Which area-based CostFactors are superseded by a real BOM line, and so
// should default to excluded from this product's cost (still
// overridable - see ProductCostOverride.enabledOverride). A factor is
// superseded as soon as any BOM line's material has a type that maps to
// it, regardless of how many such lines there are.
export function computeSupersededFactors( product )
{
  const superseded = new Set()

  for( const line of product?.bomLines ?? [] )
  {
    const factorKey = TYPE_TO_FACTOR[line.material?.type]
    if( factorKey )
      superseded.add( factorKey )
  }

  return superseded
}

// `settings` is the Settings row (see db/models/Settings.js) holding the
// shop's process constants - feed rate/power draw convert cut distance
// into machine run-time, and the sq-in/hr throughput constants seed the
// sanding/glueing/grouting heuristics. Any of these can be null/unset
// (not yet configured), in which case the dependent quantities default
// to 0 rather than a misleading guess. Machine-category CostFactors
// (machineWear, utilities) are in their physical units (in, hr); Labor-
// category ones are all in minutes (see CostFactors.unit and the
// 20260718000000-labor-quantities-to-minutes.js migration), regardless
// of the units the shop enters these constants in - feedRateInPerMin is
// in/min, so cutDistance/feedRate yields minutes directly for
// laborCnc, but utilities still wants hours so that's divided by 60; the
// *RateSqInPerHr constants are a throughput (sq-in of coverage per hour,
// bigger = faster), so hours is area/rate, and the labor quantities
// multiply that back out to minutes.
export function computeDefaultQuantities( product, settings )
{
  const mirror = buildGeometry( product )

  // Mosaic surface (outside minus inside), matching calculatorStats.js's
  // computeAreaStats() totalArea - the same "how much tesserae/glass
  // actually covers this piece" figure already shown on the calculator's
  // Pricing tab.
  const mosaicArea = mirror ? (mirror.outside.dims.area - (mirror.inside?.dims?.area ?? 0)) : 0
  const glassArea = mirror?.inside?.dims?.area ?? 0
  const substrateArea = mirror?.outside?.obb?.area ?? 0

  let cutDistance = 2*mirror?.outside?.dims?.perimeter ?? 0
  cutDistance += 2*mirror?.inside?.dims?.perimeter ?? 0
  cutDistance += mirror?.rabbet?.dims?.perimeter ?? 0

  const feedRate = settings?.feedRateInPerMin || 0
  const runTimeMin = feedRate > 0 ? cutDistance / feedRate : 0

  const sandingRate = settings?.sandingRateSqInPerHr || 0
  const glueingRate = settings?.glueingRateSqInPerHr || 0
  const groutingRate = settings?.groutingRateSqInPerHr || 0

  // Already a dollar figure, not a physical quantity - see the "bom"
  // CostFactor's unit ('$') and its rate profiles (seeded at 1, a
  // pass-through) in the 20260717000000-add-bom-cost-factor.js migration.
  const bomCost = (product?.bomLines ?? []).reduce(
    (sum, line) => sum + (line.quantity || 0) * resolveSupplierCost( line.material, line.supplierId ),
    0
  )

  return {
    tesserae: mosaicArea,
    glass: glassArea,
    substrate: substrateArea,
    bom: bomCost,
    machineWear: cutDistance,
    // Utilities (machine-category, hours) and CNC labor (labor-category,
    // minutes) both derive from the same machine run-time - an operator
    // is occupied for as long as the machine is cutting.
    utilities: runTimeMin / 60,
    laborCnc: runTimeMin,
    laborDesign: LABOR_DESIGN_MIN,
    laborSanding: sandingRate > 0 ? (mosaicArea / sandingRate) * 60 : 0,
    laborGlueing: glueingRate > 0 ? (mosaicArea / glueingRate) * 60 : 0,
    laborGrouting: groutingRate > 0 ? (mosaicArea / groutingRate) * 60 : 0,
    laborFinishing: LABOR_FINISHING_MIN,
  }
}
