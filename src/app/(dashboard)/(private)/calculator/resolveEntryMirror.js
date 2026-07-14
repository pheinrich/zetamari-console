import { build } from '@/libs/mirror'

// Resolves one lightbox entry's (or the working panel's) geometry
// straight from its own stored outsideId/insideId/rabbetId/width/height/
// border - independent of whatever anything else currently shows, and
// independent of any product (entries carry their own contour ids and
// label directly, set once by "Copy From" or a fresh blank shape, rather
// than staying live-linked to a product) - so a thumbnail or a
// comparison row keeps rendering correctly no matter what the working
// panel moves on to, or what happens to the product it was copied from.
// Returns undefined for an incomplete/degenerate shape rather than
// throwing (mirrors MirrorCalculator's own build() guard).
export function resolveEntryMirror( entry, contours )
{
  const outsideContour = contours.find( c => c.id === entry.outsideId )
  const insideContour = contours.find( c => c.id === entry.insideId )
  const rabbetContour = contours.find( c => c.id === entry.rabbetId )

  if( !outsideContour || (!outsideContour.svgData && !outsideContour.shape?.key) )
    return undefined
  if( !entry.width || !entry.height )
    return undefined

  try
  {
    return build(
      Number( entry.width ),
      Number( entry.height ),
      Number( entry.border ) || 0,
      outsideContour.shape?.key,
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
// (comparison table rows, lightbox hover tooltips, etc) - each entry
// carries its own editable label directly now, set from the product name
// at "Copy From" time (or "Blank Shape" if never set).
export function labelForEntry( entry )
{
  return entry.label || 'Blank Shape'
}
