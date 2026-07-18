import AffineTransformation from 'jsts/org/locationtech/jts/geom/util/AffineTransformation'
import ArrayList from 'jsts/java/util/ArrayList'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp'
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters'
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate'
import DiscreteHausdorffDistance from 'jsts/org/locationtech/jts/algorithm/distance/DiscreteHausdorffDistance'
import DistanceOp from 'jsts/org/locationtech/jts/operation/distance/DistanceOp'
import GeometricShapeFactory from 'jsts/org/locationtech/jts/util/GeometricShapeFactory'
import Geometry from 'jsts/org/locationtech/jts/geom/Geometry'
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory'
import MinimumDiameter from 'jsts/org/locationtech/jts/algorithm/MinimumDiameter'
import UnaryUnionOp from 'jsts/org/locationtech/jts/operation/union/UnaryUnionOp'
import Vector2D from 'jsts/org/locationtech/jts/math/Vector2D'

const GA_ADJ = 1.0 - Math.sqrt( 3 )/2
const MIRROR_BUFFER = 0.0625
const RABBET_BUFFER = 0.3125
const POCKET_DIAMETER = 0.6
const SHARP_ANGLE = Math.PI / 6

export function buildFromPoints( points )
{
  let coords = [];

  for( let i = 0; i < points.length; i += 2 )
    coords.push( new Coordinate( points[i], points[i+1] ) )

  return new GeometryFactory().createPolygon( coords )
}

export function buildFromSVGData( data )
{
  let coords = []

  // Assumes line path commands only (i.e. no circular/bezier arcs).
  data.split( ' ' ).filter( val => -1 < val.indexOf( ',' ) ).forEach( val => {
    let pt = val.split( ',' )
    coords.push( new Coordinate( parseFloat( pt[0] ), parseFloat( pt[1] ) ) )
  })

  return new GeometryFactory().createPolygon( coords )
}

// `shapeType` is a ShapeType.key value ('circle', 'oval', etc - see
// src/db/models/ShapeType.js, joined onto a Contour via its `shape`
// association) rather than the numeric codes this used before shapeType
// existed; those only ever "worked" by coincidence of contour insertion
// order.
export function buildFromType( shapeType, width, height )
{
  let coords, geometry
  let gf = new GeometryFactory()
  let gsf = new GeometricShapeFactory()

  gsf.setWidth( width )
  gsf.setHeight( height )
  gsf.setNumPoints( 100 )
  gsf.setBase( new Coordinate( 0, 0 ) )

  switch( shapeType )
  {
    case 'chapel arch':
      gsf.setSize( width )
      coords = gsf.createArc( Math.PI, Math.PI ).getCoordinates()

      coords.push( new Coordinate( width, height ) )
      coords.push( new Coordinate( 0, height ) )
      coords.push( coords[0] )
      geometry = gf.createPolygon( coords )
      break

    case 'circle':
      gsf.setHeight( width )
      geometry = gsf.createCircle()
      break

    case 'gothic arch':
      gsf.setSize( 2*width )
      gsf.setBase( new Coordinate( 0, -width * GA_ADJ ) )
      coords = gsf.createArc( Math.PI, Math.PI/3 ).getCoordinates()

      for( let i = coords.length - 2; i >= 0; i-- )
        coords.push( new Coordinate( width - coords[i].x, coords[i].y ) )

      coords.push( new Coordinate( width, height ) )
      coords.push( new Coordinate( 0, height ) )
      coords.push( coords[0] )
      geometry = gf.createPolygon( coords )
      break

    case 'oval':
      geometry = gsf.createEllipse()
      break

    case 'square':
      gsf.setHeight( width )
    case 'rectangle':
      geometry = gsf.createRectangle()
      break

    case 'vesica piscis':
      gsf.setSize( 2*width )
      gsf.setBase( new Coordinate( 0, -width * GA_ADJ ) )
      coords = gsf.createArc( 2*Math.PI/3, 2*Math.PI/3 ).getCoordinates()

      for( let i = coords.length - 2; i > 0; i-- )
        coords.push( new Coordinate( width - coords[i].x, coords[i].y ) )

      coords.push( coords[0] )
      geometry = gf.createPolygon( coords )
      break
  }

  return geometry
}

export function getDims( geometry )
{
  const coords = geometry.getCoordinates()
  if( 0 === coords.length )
    return undefined

  let top = { x: coords[0].x, y: coords[0].y }
  let right = { ...top }
  let bottom = { ...top }
  let left = { ...top }

  // Find the local min/max along each side. Prefer the left-most and bottom-
  // most points if there is more than one.
  coords.forEach( pt => {
    if( pt.x < left.x || (pt.x === left.x && pt.y > left.y) )
      left = { x: pt.x, y: pt.y }
    if( pt.x > right.x || (pt.x === right.x && pt.y > right.y) )
      right = { x: pt.x, y: pt.y }
    if( pt.y < top.y || (pt.y === top.y && pt.x < top.x) )
      top = { x: pt.x, y: pt.y }
    if( pt.y > bottom.y || (pt.y === bottom.y && pt.x < bottom.x) )
      bottom = { x: pt.x, y: pt.y }
  })

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    width: right.x - left.x,
    height: bottom.y - top.y,
    center: { x: (left.x + right.x) / 2, y: (top.y + bottom.y) / 2 },
    area: geometry.getArea(),
    perimeter: geometry.getLength()
  }
}

export function getMinBoundRect( geometry )
{
  let area = 0, coords = [], theta = 0

  try
  {
    let obb = MinimumDiameter.getMinimumRectangle( geometry )

    area = obb.getArea()
    // Plain {x, y} objects, not the JSTS Coordinate instances
    // getCoordinates() returns - build()'s result (this is nested inside
    // it, under outside.obb/glass.obb) needs to stay serializable so it
    // can cross the server/client boundary (see the printable calculator
    // reports, which resolve geometry in a Server Component).
    coords = obb.getCoordinates().map( c => ({x: c.x, y: c.y}) )
    theta = 180*Math.atan( (coords[1].x - coords[0].x) / (coords[1].y - coords[0].y) ) / Math.PI

    while( -90 > theta )
      theta += 90
    while( 90 < theta )
      theta -= 90
  }
  catch {}

  return {
    area: area,
    coords: [...coords],
    theta: theta
  }
}

export function getSVGData( geometry )
{
  const coords = geometry.getCoordinates()
  let data = 0 < coords.length ? `M ${coords[0].x},${coords[0].y}` : ''

  for( let i = 1; i < coords.length; i++ )
    data += ` L ${coords[i].x},${coords[i].y}`

  // if( false )
  // {
  //  coords.reverse()
  //  let str = 0 < coords.length ? `M ${coords[0].x},${coords[0].y}` : ''
  //  for( let i = 1; i < coords.length; i++ )
  //    str += ` L ${coords[i].x},${coords[i].y}`
  //   console.log( str )
  // }

  return data;
}

function buffer( geometry, delta )
{
  let parms = new BufferParameters()
  parms.setJoinStyle( BufferParameters.JOIN_MITRE )

  return BufferOp.bufferOp( geometry, delta, parms )
}

function scale( geometry, sx, sy )
{
  const origin = geometry.getEnvelopeInternal().centre()
  let af = AffineTransformation.translationInstance( -origin.x, -origin.y )

  af.scale( sx, sy )
  af.translate( origin.x, origin.y )

  return af.transform( geometry )
}

function addPockets( geometry, diameter, offset, maxAngle )
{
  let coll = new ArrayList()
  let gsf = new GeometricShapeFactory()

  gsf.setWidth( diameter )
  gsf.setHeight( diameter )
  gsf.setNumPoints( 24 )

  getCorners( geometry, offset, maxAngle ).forEach( corner => {
    gsf.setCentre( new Coordinate( corner.x, corner.y ) )
    coll.add( gsf.createCircle() )
  })
  coll.add( geometry )

  return UnaryUnionOp.union( coll )
}

function isSharpAngle( u, v, maxCos )
{
    const cosine = u.dot( v ) / (u.length() * v.length())
    const term = 2 + 2*cosine

    return [Math.abs( cosine ) <= maxCos, Math.sqrt( term )/term ]
}

function getCorners( geometry, offset, maxAngle )
{
  const coords = geometry.getCoordinates()
  const size = coords.length - 1

  const maxCos = Math.cos( maxAngle )
  let result = []

  for( let i = 0; i < size; i++ )
  {
    const curr = coords[i]
    const prev = coords[(i + size - 1) % size]
    const next = coords[(i + 1) % size]

    const u = new Vector2D( prev, curr )
    const v = new Vector2D( curr, next )
    const [isSharp, mag] = isSharpAngle( u, v, maxCos )

    if( isSharp )
    {
      const delta = new Vector2D( u.toCoordinate(), v.toCoordinate() ).normalize().multiply( offset*mag )
      result.push( { x: curr.x + delta.getX(), y: curr.y + delta.getY() } )
    }
  }

  return result
}

function getMaxBorder( outside, inside )
{
  const oBoundary = outside.getBoundary()
  const iBoundary = inside.getBoundary()
  const hausdorff = new DiscreteHausdorffDistance( iBoundary, oBoundary )

  hausdorff.setDensifyFraction( 0.02 )

  const maxDist = hausdorff.distance()
  const [p, q] = hausdorff.getCoordinates()

  return {
    distance: maxDist,
    outside: { x: p.x, y: p.y },
    inside: { x: q.x, y: q.y }
  }
}

function getMinBorder( outside, inside )
{
  const b1 = outside.getBoundary()
  const b2 = inside.getBoundary()

  let op = new DistanceOp( b1, b2 )
  let minDist = op.distance()
  let pts = op.nearestPoints()

  return {
    distance: minDist,
    outside: { x: pts[0].x, y: pts[0].y },
    inside: { x: pts[1].x, y: pts[1].y }
  }
}

export function build( width, height, border, shapeType, outsideSVG, insideSVG, rabbetSVG )
{
  let op, ip, rp, gp
  let outsideDims, insideDims

  if( !outsideSVG )
  {
    op = buildFromType( shapeType, width, height )
    // buildFromType()'s switch has no default case - it only handles
    // the 7 shapes it can draw parametrically (see PARAMETRIC_SHAPES in
    // the 20260715000000-shape-types.js migration) and silently returns
    // undefined for anything else, including a custom/svgData-only
    // shape family (shapeType null) whose outside Contour just hasn't
    // had its svgData filled in yet. Throwing here with the actual key
    // turns that into an immediately diagnosable error instead of a
    // bare "Cannot read properties of undefined (reading
    // 'getCoordinates')" three calls later in getDims().
    if( !op )
      throw new Error( `mirror.build(): no parametric geometry for shapeType '${shapeType}' - either it's not one of the 7 buildFromType() shapes, or this is a custom shape whose outside Contour is missing svgData` )
  }
  else
    op = buildFromSVGData( outsideSVG )
  outsideDims = getDims( op )

  let sx = (0 === width || width === outsideDims.width) ? 1 : width / outsideDims.width
  let sy = (0 === height || height === outsideDims.height) ? 1 : height / outsideDims.height

  if( 1 !== sx || 1 !== sy )
  {
    op = scale( op, sx, sy )
    outsideDims = getDims( op )
  }

  if( !insideSVG )
    ip = buffer( op, -border )
  else
  {
    ip = scale( buildFromSVGData( insideSVG ), sx, sy )
    insideDims = getDims( ip )

    const dx = (1 - border)*(outsideDims.width / insideDims.width) + border
    const dy = (1 - border)*(outsideDims.height / insideDims.height) + border

    ip = scale( ip, dx, dy )
    sx *= dx
    sy *= dy
  }
  insideDims = getDims( ip )

  if( !rabbetSVG )
    rp = buffer( ip, RABBET_BUFFER );
  else
    rp = scale( buildFromSVGData( rabbetSVG ), sx, sy )

  gp = buffer( rp, -MIRROR_BUFFER )
  rp = addPockets( rp, POCKET_DIAMETER, RABBET_BUFFER, SHARP_ANGLE )

  return {
    outside: {
      dims: outsideDims,
      obb: getMinBoundRect( op ),
      data: getSVGData( op )
    },
    inside: {
      dims: insideDims,
      data: getSVGData( ip )
    },
    rabbet: {
      dims: getDims( rp ),
      data: getSVGData( rp )
    },
    glass: {
      dims: getDims( gp ),
      obb: getMinBoundRect( gp ),
      data: getSVGData( gp )
    },
    border: {
      fixed: !insideSVG ? border : null,
      max: getMaxBorder( op, ip ),
      min: getMinBorder( op, ip )
    }
  }
}
