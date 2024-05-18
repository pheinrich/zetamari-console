import { useEffect, useState } from 'react'
import Mirror from 'src/lib/mirror'

function useMirror( width, height, border, outside, inside, rabbet )
{
	const [mirror, setMirror] = useState( undefined )

	useEffect( () =>
	{
		const mirror = Mirror.build( width, height, border, outside, inside, rabbet )
		setMirror( mirror )

	}, [width, height, border, outside, inside, rabbet] )

	return mirror
}

export { useMirror }
