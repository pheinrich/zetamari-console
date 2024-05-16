import AffineTransformation from 'jsts/org/locationtech/jts/geom/util/AffineTransformation'
import ArrayList from 'jsts/java/util/ArrayList'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp'
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters'
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate'
import GeometricShapeFactory from 'jsts/org/locationtech/jts/util/GeometricShapeFactory'
import Geometry from 'jsts/org/locationtech/jts/geom/Geometry'
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory'
import MinimumDiameter from 'jsts/org/locationtech/jts/algorithm/MinimumDiameter'
import UnaryUnionOp from 'jsts/org/locationtech/jts/operation/union/UnaryUnionOp'
import Vector2D from 'jsts/org/locationtech/jts/math/Vector2D'

const GA_ADJ = 1.0 - Math.sqrt( 3 )/2
const DEF_MAX_ANGLE = Math.PI / 6

function buildFromPoints( points )
{
	let coords = [];

	for( let i = 0; i < points.length; i += 2 )
		coords.push( new Coordinate( points[i], points[i+1] ) )

	return new GeometryFactory().createPolygon( coords )
}

function buildFromSVGData( data )
{
	let coords = []

	// Assumes line path commands only (i.e. no circular/bezier arcs).
	data.split( ' ' ).filter( val => -1 < val.indexOf( ',' ) ).forEach( val => {
		let pt = val.split( ',' )
		coords.push( new Coordinate( parseFloat( pt[0] ), parseFloat( pt[1] ) ) )
	})

	return new GeometryFactory().createPolygon( coords )
}

function buildFromType( type, width, height )
{
	let coords, geometry
	let gf = new GeometryFactory()
	let gsf = new GeometricShapeFactory()

	gsf.setWidth( width )
	gsf.setHeight( height )
	gsf.setNumPoints( 100 )
	gsf.setBase( new Coordinate( 0, 0 ) )

	switch( type )
	{
		case 'Ca':
			// Chapel Arch
      gsf.setSize( width )
      coords = gsf.createArc( Math.PI, Math.PI ).getCoordinates()

      coords.push( new Coordinate( width, height ) )
      coords.push( new Coordinate( 0, height ) )
      coords.push( coords[0] )
      geometry = gf.createPolygon( coords )
      break

    case 'Ci':
    	// Circle
    	geometry = gsf.createCircle()
    	break

    case 'Ga':
    	// Gothic Arch
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

 		case 'Ov':
 			// Oval
 			geometry = gsf.createEllipse()
 			break

 		case 'Re':
 		case 'Sq':
 			// Rectangle & Square
 			geometry = gsf.createRectangle()
 			break

 		case 'Vp':
 			// Vesica Piscis
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

function getDims( geometry )
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

function getMinBoundRect( geometry )
{
	let area = 0, coords = [], theta = 0

	try
	{
		let obb = MinimumDiameter.getMinimumRectangle( geometry )

		area = obb.getArea()
		coords = obb.getCoordinates()
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

function getSVGData( geometry )
{
	const coords = geometry.getCoordinates()
  let data = 0 < coords.length ? `M ${coords[0].x},${coords[0].y}` : ''

  for( let i = 1; i < coords.length; i++ )
    data += ` L ${coords[i].x},${coords[i].y}`

  // if( false )
  // {
  // 	coords.reverse()
  // 	let str = 0 < coords.length ? `M ${coords[0].x},${coords[0].y}` : ''
  // 	for( let i = 1; i < coords.length; i++ )
  //   	str += ` L ${coords[i].x},${coords[i].y}`
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

const Contour =
{
	buildFromPoints,
	buildFromSVGData,
	buildFromType,

	getDims,
	getMinBoundRect,
	getSVGData,

	addPockets,
	buffer,
	scale
}

export { Contour, ContourType }
