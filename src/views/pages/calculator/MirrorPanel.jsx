import { useRef, useState } from 'react'
import { createSvgIcon } from '@mui/material/utils'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import BorderInnerIcon from '@mui/icons-material/BorderInner'
import BorderOuterIcon from '@mui/icons-material/BorderOuter'
import FlipToBackIcon from '@mui/icons-material/FlipToBack'
import FlipToFrontIcon from '@mui/icons-material/FlipToFront'

import MirrorView from 'src/views/pages/calculator/MirrorView'
import SnapshotDialog from 'src/views/pages/calculator/SnapshotDialog'

const MirrorIcon = createSvgIcon(
	<path d='M12 1c4.69 0 8.5 4.93 8.5 11c0 6.08-3.81 11-8.5 11s-8.5-4.92-8.5-11C3.5 5.93 7.31 1 12 1m0 2c-3.59 0-6.5 4.03-6.5 9s2.91 9 6.5 9s6.5-4.03 6.5-9s-2.91-9-6.5-9m-3.71 7.28l3.24-3.25l1.06 1.06l-3.24 3.25zm.41 4.33l5.66-5.66L15.42 10l-5.66 5.67z' />,
	'Mirror'
)

export default function MirrorPanel( {mirror} )
{
	const imageRef = useRef( null )
	const [settings, setSettings] = useState({
		showBack: false,
		showDims: 0,
		showGlass: true,
		zoom: 65
	})

	return (
		<Stack>
			<MirrorView mirror={mirror} settings={settings} imageRef={imageRef} />
	    <Stack direction='row' justifyContent='space-between' alignItems='center'>
	      <Box>
	        <Tooltip title={settings.showGlass ? 'Hide Glass' : 'Show Glass'}>
	          <Checkbox
	            checked={settings.showGlass}
	            icon={<MirrorIcon />}
	            checkedIcon={<MirrorIcon />}
	            onChange={() => setSettings( {...settings, showGlass: !settings.showGlass} )} />
	        </Tooltip>
	        <Tooltip title={settings.showBack ? 'Show Front' : 'Show Back'}>
	          <Checkbox
	            checked={settings.showBack}
	            icon={<FlipToFrontIcon />}
	            checkedIcon={<FlipToBackIcon />}
	            onChange={() => setSettings( {...settings, showBack: !settings.showBack} )} />
	        </Tooltip>
	        <Tooltip title={(settings.showDims & 1) === 1 ? 'Hide Outside Dimensions' : 'Show Outside Dimensions'}>
	          <Checkbox
	            checked={(settings.showDims & 1) === 1}
	            icon={<BorderOuterIcon />}
	            checkedIcon={<BorderOuterIcon />}
	            onChange={() => setSettings( {...settings, showDims: settings.showDims ^ 1} )} />
	        </Tooltip>
	        <Tooltip title={(settings.showDims & 2) === 2 ? 'Hide Inside Dimensions' : 'Show Inside Dimensions'}>
	          <Checkbox
	            checked={(settings.showDims & 2) === 2}
	            icon={<BorderInnerIcon />}
	            checkedIcon={<BorderInnerIcon />}
	            onChange={() => setSettings( {...settings, showDims: settings.showDims ^ 2} )} />
	        </Tooltip>
        	<SnapshotDialog imageRef={imageRef} />
	      </Box>
	      <Slider
	        sx={{ width: '50%', mr: '5px'}}
	        min={0}
	        max={100}
	        value={typeof settings.zoom === 'number' ? settings.zoom : 65}
	        valueLabelDisplay='auto'
	        onChange={(e,val) => setSettings( {...settings, zoom: val} )}
	      />
	    </Stack>
		</Stack>
	)
}
