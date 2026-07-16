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
// mirror's size, so there's no heuristic to derive them from.
const LABOR_DESIGN_HR = 0.5     // 30 minutes
const LABOR_FINISHING_HR = 5 / 60  // 5 minutes

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

// `settings` is the Settings row (see db/models/Settings.js) holding the
// shop's process constants - feed rate/power draw convert cut distance
// into machine run-time, and the sq-in/hr throughput constants seed the
// sanding/glueing/grouting heuristics. Any of these can be null/unset
// (not yet configured), in which case the dependent quantities default
// to 0 rather than a misleading guess. All the labor/machine CostFactors
// this feeds are in hours (see CostFactors.unit), regardless of the
// units the shop enters these constants in - feedRateInPerMin is in/min,
// so cutDistance/feedRate yields minutes and needs an extra /60; the
// *RateSqInPerHr constants are a throughput (sq-in of coverage per hour,
// bigger = faster), so time is area/rate rather than area*rate.
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
  const cutDistance = mirror?.outside?.dims?.perimeter ?? 0

  const feedRate = settings?.feedRateInPerMin || 0
  const runTimeHr = feedRate > 0 ? (cutDistance / feedRate) / 60 : 0

  const sandingRate = settings?.sandingRateSqInPerHr || 0
  const glueingRate = settings?.glueingRateSqInPerHr || 0
  const groutingRate = settings?.groutingRateSqInPerHr || 0

  return {
    tesserae: mosaicArea,
    glass: glassArea,
    substrate: substrateArea,
    machineWear: cutDistance,
    // Utilities and CNC labor both derive from the same machine run-time -
    // an operator is occupied for as long as the machine is cutting.
    utilities: runTimeHr,
    laborCnc: runTimeHr,
    laborDesign: LABOR_DESIGN_HR,
    laborSanding: sandingRate > 0 ? mosaicArea / sandingRate : 0,
    laborGlueing: glueingRate > 0 ? mosaicArea / glueingRate : 0,
    laborGrouting: groutingRate > 0 ? mosaicArea / groutingRate : 0,
    laborFinishing: LABOR_FINISHING_HR,
  }
}
