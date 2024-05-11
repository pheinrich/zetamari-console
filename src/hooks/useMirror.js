import { useEffect, useState } from 'react'
import Mirror from 'src/lib/mirror'

function useMirror( width, height, border, outsideId, insideId, rabbetId )
{
	const [outside, setOutside] = useState( undefined )
	const [inside, setInside] = useState( undefined )
	const [rabbet, setRabbet] = useState( undefined )
	const [glass, setGlass] = useState( undefined )

	useEffect( () =>
	{
		const mirror = Mirror.build( width, height, border, outsideId, insideId, rabbetId )

		setOutside( mirror.outside )
		setInside( mirror.inside )
		setRabbet( mirror.rabbet )
		setGlass( mirror.glass )

	}, [width, height, border, outsideId, insideId, rabbetId] )

	return {outside, inside, rabbet, glass}
}

export { useMirror }
