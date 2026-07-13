'use client'

import { useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import MirrorView from './MirrorView'
import SnapshotDialog from './SnapshotDialog'

// Visualization controls (front/back, glass, dimension callouts, zoom) plus
// the preview itself. Ported from the old console app's MirrorPanel.jsx -
// the @mui/icons-material icons it used aren't available in this app (which
// uses Remix Icon classes throughout instead), so those are swapped for the
// closest equivalents.
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
              icon={<i className='ri-eye-off-line' />}
              checkedIcon={<i className='ri-eye-line' />}
              onChange={() => setSettings( {...settings, showGlass: !settings.showGlass} )}
            />
          </Tooltip>
          <Tooltip title={settings.showBack ? 'Show Front' : 'Show Back'}>
            <Checkbox
              checked={settings.showBack}
              icon={<i className='ri-flip-horizontal-line' />}
              checkedIcon={<i className='ri-flip-horizontal-2-line' />}
              onChange={() => setSettings( {...settings, showBack: !settings.showBack} )}
            />
          </Tooltip>
          <Tooltip title={(settings.showDims & 1) === 1 ? 'Hide Outside Dimensions' : 'Show Outside Dimensions'}>
            <Checkbox
              checked={(settings.showDims & 1) === 1}
              icon={<i className='ri-crop-2-line' />}
              checkedIcon={<i className='ri-crop-2-line' />}
              onChange={() => setSettings( {...settings, showDims: settings.showDims ^ 1} )}
            />
          </Tooltip>
          <Tooltip title={(settings.showDims & 2) === 2 ? 'Hide Inside Dimensions' : 'Show Inside Dimensions'}>
            <Checkbox
              checked={(settings.showDims & 2) === 2}
              icon={<i className='ri-crop-line' />}
              checkedIcon={<i className='ri-crop-line' />}
              onChange={() => setSettings( {...settings, showDims: settings.showDims ^ 2} )}
            />
          </Tooltip>
          <SnapshotDialog imageRef={imageRef} />
        </Box>
        <Slider
          sx={{ width: '50%', mr: '5px'}}
          min={0}
          max={100}
          value={typeof settings.zoom === 'number' ? settings.zoom : 65}
          valueLabelDisplay='auto'
          onChange={(e, val) => setSettings( {...settings, zoom: val} )}
        />
      </Stack>
    </Stack>
  )
}
