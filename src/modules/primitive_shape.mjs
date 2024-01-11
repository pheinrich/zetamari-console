import { Shape, PrimitiveShapeType } from 'src/modules/shape.mjs';

const ROOT3 = Math.sqrt( 3 );

class PrimitiveShape extends Shape
{
	constructor( type, width, height, border )
	{
		super( type );
		this.initOutlines( width, height, border );
	}
}

class ChapelArch extends PrimitiveShape
{
	constructor( width, height, border )
	{
		super( PrimitiveShapeType.ChapelArch, width, height, border );
	}
}

class Circle extends PrimitiveShape
{
	constructor( diameter, border )
	{
		super( PrimitiveShapeType.Circle, diameter, diameter, border );
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
	constructor( width, height, border )
	{
		super( PrimitiveShapeType.GothicArch, width, height, border );
	}
}

class Oval extends PrimitiveShape
{
	constructor( width, height, border )
	{
		super( PrimitiveShapeType.Oval, width, height, border );
	}
}

class Rectangle extends PrimitiveShape
{
	constructor( width, height, border )
	{
		super( PrimitiveShapeType.Rectangle, width, height, border );
	}
}

class Square extends PrimitiveShape
{
	constructor( side, border )
	{
		super( PrimitiveShapeType.Square, side, side, border );
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
	constructor( width, border )
	{
		super( PrimitiveShapeType.VesicaPiscis, width, width * ROOT3, border );
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
