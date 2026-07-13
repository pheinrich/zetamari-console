'use client'

import Stack from '@mui/material/Stack'

import MirrorView from './MirrorView'
import MirrorToolbar from './MirrorToolbar'

// The "expanded" panel layout: preview image with its toolbar stacked
// directly below it. `settings`/`onSettingsChange`/`imageRef` are all
// controlled by the caller (CalculatorPanel) rather than owned here, so
// the same settings can also drive a collapsed panel's hover overlay
// (which renders MirrorView and MirrorToolbar separately) and so a
// panel's current settings can be read by the board for "apply to all".
export default function MirrorPanel( {mirror, settings, onSettingsChange, imageRef, size = 500, onBroadcast} )
{
  return (
    <Stack>
      <MirrorView mirror={mirror} settings={settings} imageRef={imageRef} size={size} />
      <MirrorToolbar settings={settings} onSettingsChange={onSettingsChange} imageRef={imageRef} onBroadcast={onBroadcast} />
    </Stack>
  )
}
