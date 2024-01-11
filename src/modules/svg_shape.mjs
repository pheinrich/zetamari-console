import { Shape, SVGShapeType } from 'src/modules/shape.mjs';

class SVGShape extends Shape
{
	constructor( type, width, height, border, outsidePath, insidePath, rabbetPath )
	{
		super( type );
		this.initOutlines( width, height, border, outsidePath, insidePath, rabbetPath );
	}
}

class Cloud extends SVGShape
{
	constructor( width, height, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.Cloud, width, height, border, outsidePath, insidePath, rabbetPath );
	}
}

class Cora extends SVGShape
{
	constructor( width, height, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.Cora, width, height, border, outsidePath, insidePath, rabbetPath );
	}
}

class Leaf extends SVGShape
{
	constructor( width, height, border, outsidePath )
	{
		super( SVGShapeType.Leaf, width, height, border, outsidePath );
	}
}

class Mina extends SVGShape
{
	constructor( width, height, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.Mina, width, height, border, outsidePath, insidePath, rabbetPath );
	}
}

class Neslo extends SVGShape
{
	constructor( width, height, border, outsidePath )
	{
		super( SVGShapeType.Neslo, width, height, border, outsidePath );
	}
}

class PlanetMandala extends SVGShape
{
	constructor( diameter, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.PlanetMandala, diameter, diameter, border, outsidePath, insidePath, rabbetPath );
	}
}

class SonoraMandala extends SVGShape
{
	constructor( diameter, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.SonoraMandala, diameter, diameter, border, outsidePath, insidePath, rabbetPath );
	}
}

class StarlightMandala extends SVGShape
{
	constructor( diameter, border, outsidePath, insidePath, rabbetPath )
	{
		super( SVGShapeType.StarlightMandala, diameter, diameter, border, outsidePath, insidePath, rabbetPath );
	}
}

class WillowLeaf extends SVGShape
{
	constructor( width, height, border, outsidePath )
	{
		super( SVGShapeType.WillowLeaf, width, height, border, outsidePath );
	}
}

export
{
	SVGShape,
	Cloud,
	Cora,
	Leaf,
	Mina,
	Neslo,
	PlanetMandala,
	SonoraMandala,
	StarlightMandala,
	WillowLeaf
}
