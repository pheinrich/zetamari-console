import { build } from '@/libs/mirror'

import { resolveSubstrateInfo } from './resolveSubstrateInfo'

// Resolves one lightbox entry's (or the working panel's) geometry from
// its stored productId/width/height/border, independent of whatever
// anything else currently shows - so a thumbnail or a comparison row
// keeps rendering correctly no matter what the working panel moves on
// to. Returns undefined for an incomplete/degenerate shape rather than
// throwing (mirrors CalculatorPanel/MirrorCalculator's own build() guard).
export function resolveEntryMirror( entry, contours, substrateProducts )
{
  const product = substrateProducts.find( p => p.id === entry.productId ) ?? null
  const substrateInfo = resolveSubstrateInfo( {width: entry.width, height: entry.height, border: entry.border}, product, contours )

  const outsideContour = contours.find( c => c.id === substrateInfo.outsideId )
  const insideContour = contours.find( c => c.id === substrateInfo.insideId )
  const rabbetContour = contours.find( c => c.id === substrateInfo.rabbetId )

  if( !outsideContour || (!outsideContour.svgData && !outsideContour.shapeType) )
    return undefined
  if( !substrateInfo.width || !substrateInfo.height )
    return undefined

  try
  {
    return build(
      Number( substrateInfo.width ),
      Number( substrateInfo.height ),
      Number( substrateInfo.border ) || 0,
      outsideContour.shapeType,
      outsideContour.svgData,
      insideContour?.svgData,
      rabbetContour?.svgData,
    )
  }
  catch( err )
  {
    return undefined
  }
}

// The label used for an entry wherever it needs a human-readable name
// (comparison table rows, etc) - the tied product's name, or "Blank
// Shape" for an entry with no product.
export function labelForEntry( entry, substrateProducts )
{
  return substrateProducts.find( p => p.id === entry.productId )?.name || 'Blank Shape'
}
