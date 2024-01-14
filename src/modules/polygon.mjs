import { PrimitiveShapeType } from 'src/modules/shape.mjs'
import AffineTransformation from 'jsts/org/locationtech/jts/geom/util/AffineTransformation'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp'
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate'
import GeometricShapeFactory from 'jsts/org/locationtech/jts/util/GeometricShapeFactory'
import Geometry from 'jsts/org/locationtech/jts/geom/Geometry'
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory'

const GA_ADJ = 1.0 - Math.sqrt( 3 )/2;

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
		return new Polygon( BufferOp.bufferOp( polygon.geometry, delta ) );
	}

	constructor( geometry )
	{
		this.geometry = geometry;
		this.minBoundRect = null;
		this.extremes = null;
	}

	scale( sx, sy )
	{
		let origin = this.getOrigin();
		let af = AffineTransformation.translationInstance( -origin.x, -origin.y );

		af.scale( sx, sy );
		af.translate( origin.x, origin.y );

		this.geometry = af.transform( this.geometry );
		this.minBoundRect = null;
		this.extremes = null;
	}

	getArea()
	{
		return this.geometry.getArea();
	}

	getOrigin()
	{
		let env = this.geometry.getEnvelopeInternal()
		return {
			x: env.getMinX() + env.getWidth() / 2,
			y: env.getMinY() + env.getHeight() / 2
		}
	}

	getWidth()
	{
		return this.geometry.getEnvelopeInternal().getWidth();
	}

	getHeight()
	{
		return this.geometry.getEnvelopeInternal().getHeight();
	}

	getMinBoundRect()
	{
		if( null === this.minBoundRect )
		{
			// TODO: replace this cheat with true minimum bounding rectangle computation.
			let env = this.geometry.getEnvelopeInternal();
			this.minBoundRect = {
				x: env.getMinX(),
				y: env.getMinY(),
				dx: env.getWidth(),
				dy: env.getHeight(),
				theta: 0
			}
		}

		return this.minBoundRect;
	}

	getMinBoundRectArea()
	{
		let mbr = this.getMinBoundRect();
		return mbr.dx * mbr.dy;
	}

	getExtremes()
	{
		if( null === this.extremes )
		{
			const coords = this.geometry.getCoordinates()
			const first = coords[0]
			let left = { x: first.x, y: first.y }
			let right = { x: first.x, y: first.y }
			let top = { x: first.x, y: first.y }
			let bottom = { x: first.x, y: first.y }

			coords.forEach( pt => {
				if( pt.x < left.x )
					left = { x: pt.x, y: pt.y }
				if( pt.x > right.x )
					right = { x: pt.x, y: pt.y }
				if( pt.y < top.y )
					top = { x: pt.x, y: pt.y }
				if( pt.y > bottom.y )
					bottom = { x: pt.x, y: pt.y }
			})

			this.extremes = {
				left: left,
				right: right,
				top: top,
				bottom: bottom
			}
		}

		return this.extremes
	}

	getPerimeter()
	{
		return this.geometry.getLength();
	}

	getSVGData()
	{
    let coords = this.geometry.getCoordinates();
    let data = `M ${coords[0].x},${coords[0].y}`;

    for( let i = 1; i < coords.length; i++ )
      data += ` L ${coords[i].x},${coords[i].y}`;

    return data;
	}
}

export { Polygon };
