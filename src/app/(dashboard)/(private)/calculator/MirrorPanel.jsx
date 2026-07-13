'use client'

import Stack from '@mui/material/Stack'

import MirrorView from './MirrorView'
import MirrorToolbar from './MirrorToolbar'

// The working panel's preview image with its toolbar stacked directly
// below it. `settings`/`onSettingsChange`/`imageRef` are all controlled
// by the caller (MirrorCalculator) rather than owned here, so the same
// settings can be captured into a lightbox entry or read for the pinned-
// settings indicator.
export default function MirrorPanel( {mirror, settings, onSettingsChange, imageRef, size = 500} )
{
  return (
    <Stack>
      <MirrorView mirror={mirror} settings={settings} imageRef={imageRef} size={size} />
      <MirrorToolbar settings={settings} onSettingsChange={onSettingsChange} imageRef={imageRef} />
    </Stack>
  )
}
