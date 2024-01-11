import { PrimitiveShapeType, SVGShapeType } from 'src/modules/shape.mjs'
import
{
	ChapelArch,
	Circle,
	GothicArch,
	Oval,
	Rectangle,
	Square,
	VesicaPiscis
} from 'src/modules/primitive_shape.mjs';

import
{
	Cloud,
	Cora,
	Leaf,
	Mina,
	Neslo,
	PlanetMandala,
	SonoraMandala,
	StarlightMandala,
	WillowLeaf
} from 'src/modules/svg_shape.mjs';

class ShapeFactory
{
	static createFromPreset( preset )
	{
		return this.create(
			preset.type,
			preset.actualWidth,
			preset.actualHeight,
			preset.border,
			preset.outsidePath,
			preset.insidePath,
			preset.rabbetPath
		)
	}

	static create( type, width, height, border, outsidePath, insidePath, rabbetPath )
	{
		let shape;

		switch( type )
		{
			// PrimitiveShape variants
			//
			case PrimitiveShapeType.ChapelArch:
				shape = new ChapelArch( width, height, border );
				break;

			case PrimitiveShapeType.Circle:
				shape = new Circle( width, border );
				break;

			case PrimitiveShapeType.GothicArch:
				shape = new GothicArch( width, height, border );
				break;

			case PrimitiveShapeType.Oval:
				shape = new Oval( width, height, border );
				break;

			case PrimitiveShapeType.Rectangle:
				shape = new Rectangle( width, height, border );
				break;

			case PrimitiveShapeType.Square:
				shape = new Square( width, border );
				break;

			case PrimitiveShapeType.VesicaPiscis:
				shape = new VesicaPiscis( width, border );
				break;

			// SVGShape variants
			//
			case SVGShapeType.Cloud:
				shape = new Cloud( width, height, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.Cora:
				shape = new Cora( width, height, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.Leaf:
				shape = new Leaf( width, height, border, outsidePath );
				break;

			case SVGShapeType.Mina:
				shape = new Mina( width, height, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.Neslo:
				shape = new Neslo( width, height, border, outsidePath );
				break;

			case SVGShapeType.PlanetMandala:
				shape = new PlanetMandala( width, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.SonoraMandala:
				shape = new SonoraMandala( width, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.StarlightMandala:
				shape = new StarlightMandala( width, border, outsidePath, insidePath, rabbetPath );
				break;

			case SVGShapeType.WillowLeaf:
				shape = new WillowLeaf( width, height, border, outsidePath );
				break;
		}

		return shape;
	}
}

export { ShapeFactory };
