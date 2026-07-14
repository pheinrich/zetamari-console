'use client'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import SnapshotDialog from './SnapshotDialog'

// Visualization controls (front/back, glass, dimension callouts, zoom).
// Kept as a controlled component (settings/onSettingsChange/imageRef all
// owned by the caller) so the same toolbar can render either inline below
// the working panel's preview or, in principle, elsewhere against the
// same settings object.
export default function MirrorToolbar( {settings, onSettingsChange, imageRef} )
{
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Box>
        <Tooltip title={(settings.showDims & 1) === 1 ? 'Hide Outside Dimensions' : 'Show Outside Dimensions'}>
          <Checkbox
            checked={(settings.showDims & 1) === 1}
            icon={<i className='ri-expand-diagonal-fill' />}
            checkedIcon={<i className='ri-expand-diagonal-fill' />}
            onChange={() => onSettingsChange( {...settings, showDims: settings.showDims ^ 1} )}
          />
        </Tooltip>
        <Tooltip title={(settings.showDims & 2) === 2 ? 'Hide Inside Dimensions' : 'Show Inside Dimensions'}>
          <Checkbox
            checked={(settings.showDims & 2) === 2}
            icon={<i className='ri-collapse-diagonal-fill' />}
            checkedIcon={<i className='ri-collapse-diagonal-fill' />}
            onChange={() => onSettingsChange( {...settings, showDims: settings.showDims ^ 2} )}
          />
        </Tooltip>
        <Tooltip title={settings.showBack ? 'Show Front' : 'Show Back'}>
          <Checkbox
            checked={settings.showBack}
            icon={<i className='ri-arrow-turn-forward-line' />}
            checkedIcon={<i className='ri-arrow-turn-forward-line' />}
            onChange={() => onSettingsChange( {...settings, showBack: !settings.showBack} )}
          />
        </Tooltip>
        <Tooltip title={settings.showGlass ? 'Hide Glass' : 'Show Glass'}>
          <Checkbox
            checked={settings.showGlass}
            icon={<i className='ri-eye-off-line' />}
            checkedIcon={<i className='ri-eye-line' />}
            onChange={() => onSettingsChange( {...settings, showGlass: !settings.showGlass} )}
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
        onChange={(e, val) => onSettingsChange( {...settings, zoom: val} )}
      />
    </Stack>
  )
}
