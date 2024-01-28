import { PrimitiveShapeType } from 'src/modules/shape.mjs'
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
const SHARP_ANGLE = Math.PI / 6
const ANGLE_COS = Math.cos( SHARP_ANGLE )
const POCKET_DIAMETER = 0.6

class Polygon
{
	static buildFromPoints( points )
	{
		let coords = [];

		for( let i = 0; i < points.length; i += 2 )
			coords.push( new Coordinate( points[i], points[i+1] ) );

		let gf = new GeometryFactory();
		return new Polygon( gf.createPolygon( coords ) );
	}

	static buildFromGeometry( geometry )
	{
		return new Polygon( geometry.copy() );
	}

	static buildFromSVGData( data )
	{
		let coords = [];

		// Assumes line path commands only (i.e. no circular/bezier arcs).
		data.split( ' ' ).filter( val => -1 < val.indexOf( ',' ) ).forEach( val => {
			let pt = val.split( ',' );
			coords.push( new Coordinate( parseFloat( pt[0] ), parseFloat( pt[1] ) ) );
		});

		let gf = new GeometryFactory();
		return new Polygon( gf.createPolygon( coords ) );
	}

	static buildFromType( type, width, height )
	{
		let coords, geometry;
		let gf = new GeometryFactory();
		let gsf = new GeometricShapeFactory();

		gsf.setWidth( width );
		gsf.setHeight( height );
		gsf.setNumPoints( 100 );
		gsf.setBase( new Coordinate( 0, 0 ) );

		switch( type )
		{
			case PrimitiveShapeType.ChapelArch:
        gsf.setSize( width )
        coords = gsf.createArc( Math.PI, Math.PI ).getCoordinates();

        coords.push( new Coordinate( width, height ) );
        coords.push( new Coordinate( 0, height ) );
        coords.push( coords[0] );
        geometry = gf.createPolygon( coords );
        break;

      case PrimitiveShapeType.Circle:
      	geometry = gsf.createCircle();
      	break;

      case PrimitiveShapeType.GothicArch:
      	gsf.setSize( 2*width );
      	gsf.setBase( new Coordinate( 0, -width * GA_ADJ ) );
      	coords = gsf.createArc( Math.PI, Math.PI/3 ).getCoordinates();

      	for( let i = coords.length - 2; i >= 0; i-- )
      		coords.push( new Coordinate( width - coords[i].x, coords[i].y ) );

      	coords.push( new Coordinate( width, height ) );
      	coords.push( new Coordinate( 0, height ) );
      	coords.push( coords[0] );
      	geometry = gf.createPolygon( coords );
      	break;

   		case PrimitiveShapeType.Oval:
   			geometry = gsf.createEllipse();
   			break;

   		case PrimitiveShapeType.Rectangle:
   		case PrimitiveShapeType.Square:
   			geometry = gsf.createRectangle();
   			break;

   		case PrimitiveShapeType.VesicaPiscis:
   			gsf.setSize( 2*width );
   			gsf.setBase( new Coordinate( 0, -width * GA_ADJ ) );
   			coords = gsf.createArc( 2*Math.PI/3, 2*Math.PI/3 ).getCoordinates();

   			for( let i = coords.length - 2; i > 0; i-- )
   				coords.push( new Coordinate( width - coords[i].x, coords[i].y ) );

   			coords.push( coords[0] );
   			geometry = gf.createPolygon( coords );
   			break;
		}

		return new Polygon( geometry );
	}

	static buffer( polygon, delta )
	{
		let parms = new BufferParameters()
		parms.setJoinStyle( BufferParameters.JOIN_MITRE )

		return new Polygon( BufferOp.bufferOp( polygon.geometry, delta, parms ) );
	}

	constructor( geometry )
	{
		this.geometry = geometry;
		this.minBoundRect = null;
		this.dims = null;
	}

	scale( sx, sy )
	{
		let origin = this.getOrigin();
		let af = AffineTransformation.translationInstance( -origin.x, -origin.y );

		af.scale( sx, sy );
		af.translate( origin.x, origin.y );

		this.geometry = af.transform( this.geometry );
		this.minBoundRect = null;
		this.dims = null;
	}

	addPockets( pockets )
	{
		let coll = new ArrayList()
		let gsf = new GeometricShapeFactory()

		gsf.setWidth( POCKET_DIAMETER )
		gsf.setHeight( POCKET_DIAMETER )
		gsf.setNumPoints( 24 )

		pockets.forEach( pocket => {
			gsf.setCentre( new Coordinate( pocket.x, pocket.y ) )
			coll.add( gsf.createCircle() )
		})

		coll.add( this.geometry )
		this.geometry = UnaryUnionOp.union( coll )
	}

	getArea()
	{
		return this.geometry.getArea();
	}

	getOrigin()
	{
		return this.getDims().center
	}

	getWidth()
	{
		return this.getDims().width
	}

	getHeight()
	{
		return this.getDims().height
	}

	getMinBoundRect()
	{
		if( null === this.minBoundRect )
		{
			let obb = MinimumDiameter.getMinimumRectangle( this.geometry )
			let coords = obb.getCoordinates()
			let theta = 180*Math.atan( (coords[1].x - coords[0].x) / (coords[1].y - coords[0].y) ) / Math.PI

			while( -90 > theta )
				theta += 90
			while( 90 < theta )
				theta -= 90

			this.minBoundRect =
			{
				coords: [...coords],
				theta: theta
			}
		}

		return this.minBoundRect;
	}

	getMinBoundRectArea()
	{
		let mbr = this.getMinBoundRect();
		return mbr.dx * mbr.dy;
	}

	getDims()
	{
		if( null === this.dims )
		{
			const coords = this.geometry.getCoordinates()

			let top = { x: coords[0].x, y: coords[0].y }
			let right = { ...top }
			let bottom = { ...top }
			let left = { ...top }

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

			this.dims = {
				top: top, right: right, bottom: bottom, left: left,
				width: right.x - left.x, height: bottom.y - top.y,
				center: { x: (left.x + right.x) / 2, y: (top.y + bottom.y) / 2 }
			}
		}

		return this.dims
	}

	isSharpAngle( u, v )
	{
		let cosine = u.dot( v ) / (u.length() * v.length())
		let term = 2 + 2*cosine

		return [Math.abs( cosine ) <= ANGLE_COS, Math.sqrt( term )/term ]
	}

	getSharpCorners( rabbet )
	{
		let coords = this.geometry.getCoordinates()
		let size = coords.length - 1
		let result = []

		for( let i = 0; i < size; i++ )
		{
			let curr = coords[i]
			let prev = coords[(i + size - 1) % size]
			let next = coords[(i + 1) % size]

			let u = new Vector2D( prev, curr )
			let v = new Vector2D( curr, next )
			let [isSharp, mag] = this.isSharpAngle( u, v )

			if( isSharp )
			{
				let delta = new Vector2D( u.toCoordinate(), v.toCoordinate() ).normalize().multiply( rabbet*mag )
				result.push( { x: curr.x + delta.getX(), y: curr.y + delta.getY() } )
			}
		}

		return result
	}

	getPerimeter()
	{
		return this.geometry.getLength();
	}

	getSVGData( isOBB = false )
	{
    let coords = isOBB ? this.getMinBoundRect().coords : this.geometry.getCoordinates();
    let data = `M ${coords[0].x},${coords[0].y}`;

    for( let i = 1; i < coords.length; i++ )
      data += ` L ${coords[i].x},${coords[i].y}`;

    return data;
	}
}

export { Polygon };
