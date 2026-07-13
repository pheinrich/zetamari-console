'use client'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import SnapshotDialog from './SnapshotDialog'

// Visualization controls (front/back, glass, dimension callouts, zoom),
// extracted out of MirrorPanel so CalculatorPanel can render this same
// toolbar either inline below the preview (expanded panels) or inside a
// hover overlay on top of it (collapsed panels), against one shared
// controlled `settings` object either way.
export default function MirrorToolbar( {settings, onSettingsChange, imageRef, onBroadcast} )
{
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Box>
        <Tooltip title={settings.showGlass ? 'Hide Glass' : 'Show Glass'}>
          <Checkbox
            checked={settings.showGlass}
            icon={<i className='ri-eye-off-line' />}
            checkedIcon={<i className='ri-eye-line' />}
            onChange={() => onSettingsChange( {...settings, showGlass: !settings.showGlass} )}
          />
        </Tooltip>
        <Tooltip title={settings.showBack ? 'Show Front' : 'Show Back'}>
          <Checkbox
            checked={settings.showBack}
            icon={<i className='ri-flip-horizontal-line' />}
            checkedIcon={<i className='ri-flip-horizontal-2-line' />}
            onChange={() => onSettingsChange( {...settings, showBack: !settings.showBack} )}
          />
        </Tooltip>
        <Tooltip title={(settings.showDims & 1) === 1 ? 'Hide Outside Dimensions' : 'Show Outside Dimensions'}>
          <Checkbox
            checked={(settings.showDims & 1) === 1}
            icon={<i className='ri-crop-2-line' />}
            checkedIcon={<i className='ri-crop-2-line' />}
            onChange={() => onSettingsChange( {...settings, showDims: settings.showDims ^ 1} )}
          />
        </Tooltip>
        <Tooltip title={(settings.showDims & 2) === 2 ? 'Hide Inside Dimensions' : 'Show Inside Dimensions'}>
          <Checkbox
            checked={(settings.showDims & 2) === 2}
            icon={<i className='ri-crop-line' />}
            checkedIcon={<i className='ri-crop-line' />}
            onChange={() => onSettingsChange( {...settings, showDims: settings.showDims ^ 2} )}
          />
        </Tooltip>
        <SnapshotDialog imageRef={imageRef} />
        {onBroadcast && (
          <Tooltip title='Apply these view settings to every panel'>
            <IconButton onClick={onBroadcast}>
              <i className='ri-broadcast-line' />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Slider
        sx={{ width: '50%', mr: '5px'}}
        min={0}
        max={100}
        value={typeof settings.zoom === 'number' ? settings.zoom : 65}
        valueLabelDisplay='auto'
        onChange={(e, val) => onSettingsChange( {...settings, zoom: val} )}
      />
    </Stack>
  )
}
