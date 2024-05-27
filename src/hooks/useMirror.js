import { useEffect, useState } from 'react'
import Mirror from 'src/lib/mirror'

function useMirror( width, height, border, shapeId, outsideSVG, insideSVG, rabbetSVG )
{
	const [mirror, setMirror] = useState( undefined )

	useEffect( () =>
	{
		if( shapeId )
		{
			const mirror = Mirror.build( width, height, border, shapeId, outsideSVG, insideSVG, rabbetSVG )
			setMirror( mirror )
		}
	}, [width, height, border, shapeId])

	return mirror
}

export { useMirror }
