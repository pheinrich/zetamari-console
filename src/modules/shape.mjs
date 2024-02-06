import { Polygon } from 'src/modules/polygon.mjs'
import Geometry from 'jsts/org/locationtech/jts/geom/Geometry'


const BUFFER_RABBET = 0.3125
const BUFFER_MIRROR = 0.125

const TIMEADJ_PICK = 7.5
const TIMEADJ_GLUE = 5.5
const TIMEADJ_GROUT = 5.75

const AVG_BITFEED = 150
const AVG_FULLSHEET_LAYOUT = 30
const AVG_FULLSHEET_CUT = 45
const AVG_FULLSHEET_SAND = 45
const AVG_FULLSHEET_ALL = AVG_FULLSHEET_LAYOUT + AVG_FULLSHEET_CUT + AVG_FULLSHEET_SAND

const PrimitiveShapeType = Object.freeze({
	ChapelArch: 'Ca',
	Circle: 'Ci',
	GothicArch: 'Ga',
	Oval: 'Ov',
	Rectangle: 'Re',
	Square: 'Sq',
	VesicaPiscis: 'Vp'
});

const SVGShapeType = Object.freeze({
	Cloud: 'Cd',
	Cora: 'Cr',
	Leaf: 'Lr',
	Mina: 'Mn',
	Neslo: 'Ne',
	PlanetMandala: 'MdPl',
	SonoraMandala: 'MdSn',
	StarlightMandala: 'MdSl',
	WillowLeaf: 'Wf'
});

class Shape
{
	static shapeNames = new Map();
	static
	{
		for( const type in PrimitiveShapeType )
			this.shapeNames.set( PrimitiveShapeType[type], type.replace( /[A-Z]/g, letter => ` ${letter}` ).trim() );

		for( const type in SVGShapeType )
			this.shapeNames.set( SVGShapeType[type], type.replace( /[A-Z]/g, letter => ` ${letter}` ).trim() );
	}

	static getTypeName( type )
	{
		return this.shapeNames.get( type );
	}

	constructor( type, variants )
	{
		this.type = type
		this.variants = variants
		this.lod = 0
	}

	setWidth( width )
	{
		this.width = width
		this.nominalWidth = Math.round( width )
		this.updateOutlines()
	}

	setHeight( height )
	{
		this.height = height
		this.nominalHeight = Math.round( height )
		this.updateOutlines();
	}

	setBorder( border )
	{
		this.border = border;
		this.updateOutlines();
	}

	initOutlines( lod, width, height, border )
	{
		let variant = this.variants[lod]

		if( 'undefined' !== typeof variant )
		{
			this.lod = lod
			this.nickname = variant.nickname
			this.width = variant.width
			this.height = variant.height
			this.border = variant.border
			this.outsidePath = variant.outsidePath
			this.insidePath = variant.insidePath
			this.rabbetPath = variant.rabbetPath
		}
		else
		{
			this.width = width
			this.height = height
			this.border = border
		}

		this.nominalWidth = Math.round( this.width )
		this.nominalHeight = Math.round( this.height )
		this.updateOutlines()
	}

	updateOutlines()
	{
		let sx = 1;
		let sy = 1;

		if( 'undefined' === typeof this.outsidePath )
			this.outside = Polygon.buildFromType( this.type, this.width, this.height );
		else
		{
			this.outside = Polygon.buildFromSVGData( this.outsidePath );
			0 === this.width ? this.width = this.outside.getWidth() : sx = this.width / this.outside.getWidth();
			0 === this.height ? this.height = this.outside.getHeight() : sy = this.height / this.outside.getHeight();
			this.outside.scale( sx, sy );
		}

		if( 'undefined' === typeof this.insidePath )
			this.inside = Polygon.buffer( this.outside, -this.border );
		else
		{
			this.inside = Polygon.buildFromSVGData( this.insidePath );
			this.inside.scale( sx, sy );

			let dx = (1 - this.border)*(this.outside.getWidth() / this.inside.getWidth()) + this.border;
			let dy = (1 - this.border)*(this.outside.getHeight() / this.inside.getHeight()) + this.border;

			this.inside.scale( dx, dy );
			sx *= dx;
			sy *= dy;
		}

		if( 'undefined' === typeof this.rabbetPath )
			this.rabbet = Polygon.buffer( this.inside, BUFFER_RABBET );
		else
		{
			this.rabbet = Polygon.buildFromSVGData( this.rabbetPath );
			this.rabbet.scale( sx, sy );
		}

		this.mirror = Polygon.buffer( this.rabbet, -BUFFER_MIRROR );

		let pockets = this.rabbet.getSharpCorners( BUFFER_RABBET )
		this.rabbet.addPockets( pockets )

		// Force recalculation on next access.
		let fields = ['areas', 'lengths', 'times', 'chip', 'sku', 'name']
		fields.forEach( f => this[f] = null )
	}

	getName()
	{
		if( !this.name )
		{
			this.name = `${this.getChip()} ${Shape.getTypeName( this.type )}`
			if( this.nickname )
				this.name += ` (${this.nickname})`
		}

		return this.name
	}

	getSKU()
	{
		if( !this.sku )
		{
			this.sku = `${this.type}${this.nominalWidth}`
			if( this.nominalWidth !== this.nominalHeight )
				this.sku += this.nominalHeight;
		}

		return sku;
	}

	getChip()
	{
		if( !this.chip )
		{
			this.chip = `${this.nominalWidth}"`
			if( this.nominalWidth !== this.nominalHeight )
				this.chip += `x${this.nominalHeight}"`
		}

		return this.chip
	}

	getOrigin()
	{
		return this.outside.getOrigin();
	}

	getAreas()
	{
		if( !this.areas )
		{
			this.areas =
			{
				woodSheet: this.outside.getMinBoundRectArea(),
				glass: this.mirror.getArea(),
				visibleGlass: this.inside.getArea(),
				glassSheet: this.mirror.getMinBoundRectArea(),
				tesserae: this.outside.getArea() - this.inside.getArea(),
			};
			this.areas.wood = this.areas.tesserae;

			// Calculate square feet from square inches. 
			let feet = {}
			for( const prop in this.areas )
				feet[prop] = this.areas[prop] / 144;

			this.areas.feet = feet;
		}

		return this.areas;
	}

	getLengths()
	{
		if( !this.lengths )
		{
			this.lengths =
			{
				inside: this.inside.getPerimeter(),
				outside: this.outside.getPerimeter(),
				mirror: this.mirror.getPerimeter(),
				rabbet: this.rabbet.getPerimeter()
			};
	
			// Calculate feet from inches.
			let feet = {};
			for( const prop in this.lengths )
				feet[prop] = this.lengths[prop] / 12;

			this.lengths.feet = feet;
		}

		return this.lengths;
	}

	getTimes()
	{
		if( !this.times )
		{
			let areas = this.getAreas();
			let lengths = this.getLengths();

			// Calculate time in minutes for one rabbet pass and two cutting passes.
			let cutTime = (2*lengths.outside + 2*lengths.inside + lengths.rabbet) / AVG_BITFEED;

			// Calculate what fraction of a full sheet this represents.
			let fracCut = cutTime / AVG_FULLSHEET_CUT;

			this.times =
			{
				prep: this.defaultTimes?.prep || AVG_FULLSHEET_ALL * fracCut,
				cut: this.defaultTimes?.cut || cutTime,
				pick: this.defaultTimes?.pick || areas.tesserae / TIMEADJ_PICK,
				glue: this.defaultTimes?.glue || areas.tesserae / TIMEADJ_GLUE,
				grout: this.defaultTimes?.grout || areas.tesserae / TIMEADJ_GROUT
			};
		}

		return this.times;
	}

	getMachineCost( time, toolCost, toolLife, utilities )
	{
		toolCost = parseFloat( toolCost.value );
		toolLife = parseFloat( toolLife.value );
		utilities = parseFloat( utilities.value );

		let result =
		{
			bitWear: time.cut * toolCost / (60 * toolLife),
			utilities: time.cut * (utilities / 60)
		}

		result.substrate = result.bitWear + result.utilities;
		result.kit = result.substrate;
		result.finished = result.kit;

		return result;
	}

	getLaborCost( time, prep, pick, glue, grout )
	{
		prep = parseFloat( prep.value );
		pick = parseFloat( pick.value );
		glue = parseFloat( glue.value );
		grout = parseFloat( grout.value );

		let result =
		{
			prep: time.prep * (prep / 60),
			pick: time.pick * (pick / 60),
			glue: time.glue * (glue / 60),
			grout: time.grout * (grout / 60),
		};

		result.substrate = result.prep;
		result.kit = result.substrate + result.pick;
		result.finished = result.substrate + result.glue + result.grout;

		return result;
	}
}

export { Shape, PrimitiveShapeType, SVGShapeType };
