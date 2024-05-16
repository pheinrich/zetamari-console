import { Contour } from 'src/lib/contour'

const MIRROR_BUFFER = 0.0625
const RABBET_BUFFER = 0.3125
const POCKET_DIAMETER = 0.6
const SHARP_ANGLE = Math.PI / 6

function build( width, height, border, outsideId, insideId, rabbetId )
{
	let outside, inside, rabbet, glass
	let outsideDims, insideDims

	let outsideSVG = SVGData.outside.find( item => item.id === outsideId ) || SVGData.outside[0]
	if( 'undefined' === typeof outsideSVG.data )
		outside = Contour.buildFromType( outsideSVG.id, width, height )
	else
		outside = Contour.buildFromSVGData( outsideSVG.data )
	outsideDims = Contour.getDims( outside )

	let sx = (0 === width || width === outsideDims.width) ? 1 : width / outsideDims.width
	let sy = (0 === height || height === outsideDims.height) ? 1 : height / outsideDims.height

	if( 1 !== sx || 1 !== sy )
	{
		outside = Contour.scale( outside, sx, sy )
		outsideDims = Contour.getDims( outside )
	}

	let insideSVG = SVGData.inside.find( item => item.id === insideId )
	if( 'undefined' === typeof insideSVG )
		inside = Contour.buffer( outside, -border )
	else
	{
		inside = Contour.scale( Contour.buildFromSVGData( insideSVG.data ), sx, sy )
		insideDims = Contour.getDims( inside )

		const dx = (1 - border)*(outsideDims.width / insideDims.width) + border
		const dy = (1 - border)*(outsideDims.height / insideDims.height) + border

		inside = Contour.scale( inside, dx, dy )
		sx *= dx
		sy *= dy
	}
	insideDims = Contour.getDims( inside )

	let rabbetSVG = SVGData.rabbet.find( item => item.id === rabbetId )
	if( 'undefined' === typeof rabbetSVG )
		rabbet = Contour.buffer( inside, RABBET_BUFFER );
	else
		rabbet = Contour.scale( Contour.buildFromSVGData( rabbetSVG.data ), sx, sy )

	glass = Contour.buffer( rabbet, -MIRROR_BUFFER )
	rabbet = Contour.addPockets( rabbet, POCKET_DIAMETER, RABBET_BUFFER, SHARP_ANGLE )

	return {
		outside: {
			id: outsideId,
			dims: outsideDims,
			obb: Contour.getMinBoundRect( outside ),
			data: Contour.getSVGData( outside )
		},
		inside: {
			id: insideId,
			dims: insideDims,
			data: Contour.getSVGData( inside )
		},
		rabbet: {
			id: rabbetId,
			dims: Contour.getDims( rabbet ),
			data: Contour.getSVGData( rabbet )
		},
		glass: {
			dims: Contour.getDims( glass ),
			obb: Contour.getMinBoundRect( glass ),
			data: Contour.getSVGData( glass )
		}
	}
}

export default
{
	build
}
