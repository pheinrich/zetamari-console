import { useEffect, useState } from 'react'
import Mirror from 'src/lib/mirror'

// function useMirror( width, height, border, shapeId, outsideSVG, insideSVG, rabbetSVG )
function useMirror( substrate )
{
	const [mirror, setMirror] = useState( undefined )

	useEffect( () =>
	{
			const mirror = Mirror.build(
				substrate.width,
				substrate.height,
				substrate.border,
				substrate.outside.shapeId,
				substrate.outside?.svgData,
				substrate.inside?.svgData,
				substrate.rabbet?.svgData )

			setMirror( mirror )
	}, [substrate])

	return mirror
}

export { useMirror }
