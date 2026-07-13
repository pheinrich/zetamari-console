import { buildFromSVGData, buildFromType, getDims, getSVGData } from '@/libs/mirror'

// Precomputes a small inline-SVG preview (just the path `d` + a matching
// viewBox) for a contour. This is called server-side only (from page.jsx,
// a Server Component) and the plain string result is what gets passed down
// to the client-side list table - keeps the jsts-based geometry library
// (@/libs/mirror) out of the client bundle entirely, since the table only
// ever needs to render <path d={...}>, not compute geometry itself.
export function computeContourThumbnail( contour )
{
  try
  {
    const geometry = contour.svgData ? buildFromSVGData( contour.svgData ) : buildFromType( contour.shapeType, 20, 32.4 )
    const svgData = contour.svgData || getSVGData( geometry )
    const dims = getDims( geometry )

    if( !dims )
      return null

    const center = dims.center
    const zoom = Math.max( dims.width, dims.height ) * 1.2 || 20
    const viewBox = `${center.x - zoom / 2} ${center.y - zoom / 2} ${zoom} ${zoom}`
    const strokeWidth = zoom / 80

    return {svgData, viewBox, strokeWidth}
  }
  catch( err )
  {
    return null
  }
}
