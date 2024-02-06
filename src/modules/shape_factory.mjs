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
		let shape = this.create(
			preset.type,
			preset.actualWidth,
			preset.actualHeight,
			preset.border,
			preset.outsidePath,
			preset.insidePath,
			preset.rabbetPath
		)

		if( preset.nickname )
			shape.setNickname( preset.nickname )

		return shape
	}

	static create( type, lod, width, height, border )
	{
		let shape;

		switch( type )
		{
			// PrimitiveShape variants
			//
			case PrimitiveShapeType.ChapelArch:
				shape = new ChapelArch( width, height, border )
				break

			case PrimitiveShapeType.Circle:
				shape = new Circle( width, border )
				break

			case PrimitiveShapeType.GothicArch:
				shape = new GothicArch( width, height, border )
				break

			case PrimitiveShapeType.Oval:
				shape = new Oval( width, height, border )
				break

			case PrimitiveShapeType.Rectangle:
				shape = new Rectangle( width, height, border )
				break

			case PrimitiveShapeType.Square:
				shape = new Square( width, border )
				break

			case PrimitiveShapeType.VesicaPiscis:
				shape = new VesicaPiscis( width, border )
				break

			// SVGShape variants
			//
			case SVGShapeType.Cloud:
				shape = new Cloud( lod, width, height, border )
				break

			case SVGShapeType.Cora:
				shape = new Cora( lod, width, height, border )
				break

			case SVGShapeType.Leaf:
				shape = new Leaf( lod, width, height, border )
				break

			case SVGShapeType.Mina:
				shape = new Mina( lod, width, height, border )
				break

			case SVGShapeType.Neslo:
				shape = new Neslo( lod, width, height, border )
				break

			case SVGShapeType.PlanetMandala:
				shape = new PlanetMandala( lod, width, border )
				break

			case SVGShapeType.SonoraMandala:
				shape = new SonoraMandala( lod, width, border )
				break

			case SVGShapeType.StarlightMandala:
				shape = new StarlightMandala( lod, width, border )
				break

			case SVGShapeType.WillowLeaf:
				shape = new WillowLeaf( lod, width, height, border )
				break
		}

		return shape
	}
}

export { ShapeFactory }
