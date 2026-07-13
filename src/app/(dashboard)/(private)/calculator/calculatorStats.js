// Area/weight/retail-cost formulas, extracted from the old CollapseArea/
// CollapseWeight/CollapseCost so ComparisonTable (and anything else that
// wants these numbers) has one shared implementation instead of duplicating
// the constants and math per component. Values are returned in their raw
// unit (in^2 for area, lb for weight, $ for cost) - formatting/unit
// conversion for display lives in the format* helpers below.

const SUBSTRATE_WEIGHT_LBIN2 = 0.008
const TESSERAE_WEIGHT_LBIN2 = 0.022
const GLASS_WEIGHT_LBIN2 = 0.0103125

const SUBSTRATE_RETAIL_DFT2 = 12
const TESSERAE_RETAIL_DFT2 = 87
const GLASS_RETAIL_DFT2 = 22

export function computeAreaStats( mirror )
{
  const totalArea = (mirror.outside?.dims?.area ?? 0) - (mirror.inside?.dims?.area ?? 0)
  const visibleGlassArea = mirror.inside?.dims?.area ?? 0
  const substrateOBBArea = mirror.outside?.obb?.area ?? 0
  const glassOBBArea = mirror.glass?.obb?.area ?? 0

  return {
    // headline is in the same raw unit (in^2) as every row's value below -
    // it happens to equal the "Mosaic Surface" row - so callers can format
    // it with the same formatAreaFt2() helper rather than special-casing it.
    headline: totalArea,
    rows: [
      { label: 'Mosaic Surface', value: totalArea },
      { label: 'Visible Glass', value: visibleGlassArea },
      { label: 'Minimum Rect: Frame', value: substrateOBBArea },
      { label: 'Minimum Rect: Glass', value: glassOBBArea },
    ],
  }
}

export function computeWeightStats( mirror )
{
  const totalArea = (mirror.outside?.dims?.area ?? 0) - (mirror.inside?.dims?.area ?? 0)
  const glassArea = mirror.glass?.dims?.area ?? 0

  const frameWeight = totalArea * SUBSTRATE_WEIGHT_LBIN2
  const glassWeight = glassArea * GLASS_WEIGHT_LBIN2
  const tesseraeWeight = totalArea * TESSERAE_WEIGHT_LBIN2
  const substrateWeight = frameWeight + glassWeight
  const kitWeight = substrateWeight + tesseraeWeight

  return {
    headline: substrateWeight,
    rows: [
      { label: 'Frame', value: frameWeight },
      { label: 'Glass', value: glassWeight },
      { label: 'Tesserae', value: tesseraeWeight },
      { label: 'Substrate (Frame + Glass)', value: substrateWeight },
      { label: 'Kit (Frame + Glass + Tesserae)', value: kitWeight },
    ],
  }
}

export function computeCostStats( mirror )
{
  const totalArea = (mirror.outside?.dims?.area ?? 0) - (mirror.inside?.dims?.area ?? 0)
  const substrateOBBArea = mirror.outside?.obb?.area ?? 0
  const glassOBBArea = mirror.glass?.obb?.area ?? 0

  const frameRetail = (substrateOBBArea * SUBSTRATE_RETAIL_DFT2) / 144
  const glassRetail = (glassOBBArea * GLASS_RETAIL_DFT2) / 144
  const tesseraeRetail = (totalArea * TESSERAE_RETAIL_DFT2) / 144
  const substrateRetail = frameRetail + glassRetail
  const kitRetail = substrateRetail + tesseraeRetail

  return {
    headline: substrateRetail,
    rows: [
      { label: 'Frame', value: frameRetail },
      { label: 'Glass', value: glassRetail },
      { label: 'Tesserae', value: tesseraeRetail },
      { label: 'Substrate (Frame + Glass)', value: substrateRetail },
      { label: 'Kit (Frame + Glass + Tesserae)', value: kitRetail },
    ],
  }
}

export function formatAreaIn2( value )
{
  return `${(value ?? 0).toFixed( 2 )} in²`
}

export function formatAreaFt2( value )
{
  return `${((value ?? 0) / 144).toFixed( 2 )} ft²`
}

export function formatWeightOz( value )
{
  return `${(16 * (value ?? 0)).toFixed( 2 )} oz`
}

export function formatWeightLb( value )
{
  return `${(value ?? 0).toFixed( 2 )} lb`
}

export function formatCost( value )
{
  return `$${(value ?? 0).toFixed( 2 )}`
}
