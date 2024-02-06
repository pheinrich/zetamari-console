import { Shape, PrimitiveShapeType } from 'src/modules/shape.mjs';

const ROOT3 = Math.sqrt( 3 );

class PrimitiveShape extends Shape
{
	constructor( type, variants, width, height, border )
	{
		super( type, variants );
		this.initOutlines( 0, width, height, border );
	}
}

class ChapelArch extends PrimitiveShape
{
	static variants = [
		{
			width: 11,
			height: 23,
			border: 2.5
		}
	]

	constructor( width, height, border )
	{
		super( PrimitiveShapeType.ChapelArch, ChapelArch.variants, width, height, border );
	}
}

class Circle extends PrimitiveShape
{
	static variants = [
		{
			width: 17,
			height: 17,
			border: 2.75
		}
	]

	constructor( diameter, border )
	{
		super( PrimitiveShapeType.Circle, Circle.variants, diameter, diameter, border );
	}

	setDiameter( diameter )
	{
		this.width = diameter;
		this.height = diameter;
		this.updateOutlines();
	}

	setWidth( width )
	{
		this.setDiameter( width );
	}

	setHeight( height )
	{
		this.setDiameter( height );
	}
}

class GothicArch extends PrimitiveShape
{
	static variants = [
		{
			width: 10,
			height: 16,
			border: 2.25
		}
	]

	constructor( width, height, border )
	{
		super( PrimitiveShapeType.GothicArch, GothicArch.variants, width, height, border );
	}
}

class Oval extends PrimitiveShape
{
	static variants = [
		{
			width: 14,
			height: 20,
			border: 2.75
		}
	]

	constructor( width, height, border )
	{
		super( PrimitiveShapeType.Oval, Oval.variants, width, height, border );
	}
}

class Rectangle extends PrimitiveShape
{
	static variants = [
		{
			width: 11.5,
			height: 18.5,
			border: 2.5
		}
	]

	constructor( width, height, border )
	{
		super( PrimitiveShapeType.Rectangle, Rectangle.variants, width, height, border );
	}
}

class Square extends PrimitiveShape
{
	static variants = [
		{
			width: 12,
			height: 12,
			border: 2.75
		}
	]

	constructor( side, border )
	{
		super( PrimitiveShapeType.Square, Square.variants, side, side, border );
	}

	setSide( side )
	{
		this.width = side;
		this.height = side;
		this.updateOutlines();
	}

	setWidth( width )
	{
		this.setSide( width );
	}

	setHeight( height )
	{
		this.setSide( height );
	}
}

class VesicaPiscis extends PrimitiveShape
{
	static variants = [
		{
			width: 15,
			height: 15 * ROOT3,
			border: 2.5
		}
	]

	constructor( width, border )
	{
		super( PrimitiveShapeType.VesicaPiscis, VesicaPiscis.variants, width, width * ROOT3, border );
	}

	setWidth( width )
	{
		this.width = width;
		this.height = this.width * ROOT3;
		this.updateOutlines();
	}

	setHeight( height )
	{
		this.height = height;
		this.width = this.height / ROOT3;
		this.updateOutlines();
	}
}

export
{
	PrimitiveShape,
	ChapelArch,
	Circle,
	GothicArch,
	Oval,
	Rectangle,
	Square,
	VesicaPiscis
}
