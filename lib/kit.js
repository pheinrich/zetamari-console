import Geometry from 'jsts/org/locationtech/jts/geom/Geometry'
import LengthIndexedLine from 'jsts/org/locationtech/jts/linearref/LengthIndexedLine'
import Polygon from 'jsts/org/locationtech/jts/geom/Polygon'

// SVG draw oriented marker along a path
// https://blog.tentaclelabs.com/posts/2022/04/draw-a-pattern-along-a-path-using-svg

export function subdividePath( geometry, steps = 100 )
{
  if( geometry instanceof Polygon )
    geometry = geometry.getExteriorRing()

  const length = geometry.getLength()
  const delta = length / steps
  const lr = new LengthIndexedLine( geometry )
  const points = Array.from( {length: steps + 1}, (_, i) => lr.extractPoint( i*delta ) )

  return `M ${points[0].x} ${points[0].y} ${points.slice( 1 ).map( ({x, y}) => `L ${x} ${y}` ).join( ' ' )}`
}
