import { Contour } from 'src/lib/contour'

const MIRROR_BUFFER = 0.0625
const RABBET_BUFFER = 0.3125
const POCKET_DIAMETER = 0.6
const SHARP_ANGLE = Math.PI / 6

function build( width, height, border, outside, inside, rabbet )
{
	let op, ip, rp, gp
	let outsideDims, insideDims

	let outsideSVG = outside.svgData
	if( !outsideSVG )
		op = Contour.buildFromType( outside.prefix, width, height )
	else
		op = Contour.buildFromSVGData( outsideSVG )
	outsideDims = Contour.getDims( op )

	let sx = (0 === width || width === outsideDims.width) ? 1 : width / outsideDims.width
	let sy = (0 === height || height === outsideDims.height) ? 1 : height / outsideDims.height

	if( 1 !== sx || 1 !== sy )
	{
		op = Contour.scale( op, sx, sy )
		outsideDims = Contour.getDims( op )
	}

	let insideSVG = inside ? inside.svgData : undefined
	if( !insideSVG )
		ip = Contour.buffer( op, -border )
	else
	{
		ip = Contour.scale( Contour.buildFromSVGData( insideSVG ), sx, sy )
		insideDims = Contour.getDims( ip )

		const dx = (1 - border)*(outsideDims.width / insideDims.width) + border
		const dy = (1 - border)*(outsideDims.height / insideDims.height) + border

		ip = Contour.scale( ip, dx, dy )
		sx *= dx
		sy *= dy
	}
	insideDims = Contour.getDims( ip )

	let rabbetSVG = rabbet ? rabbet.svgData : undefined
	if( !rabbetSVG )
		rp = Contour.buffer( ip, RABBET_BUFFER );
	else
		rp = Contour.scale( Contour.buildFromSVGData( rabbetSVG ), sx, sy )

	gp = Contour.buffer( rp, -MIRROR_BUFFER )
	rp = Contour.addPockets( rp, POCKET_DIAMETER, RABBET_BUFFER, SHARP_ANGLE )

	return {
		outside: {
			dims: outsideDims,
			obb: Contour.getMinBoundRect( op ),
			data: Contour.getSVGData( op )
		},
		inside: {
			dims: insideDims,
			data: Contour.getSVGData( ip )
		},
		rabbet: {
			dims: Contour.getDims( rp ),
			data: Contour.getSVGData( rp )
		},
		glass: {
			dims: Contour.getDims( gp ),
			obb: Contour.getMinBoundRect( gp ),
			data: Contour.getSVGData( gp )
		}
	}
}

export default
{
	build
}
