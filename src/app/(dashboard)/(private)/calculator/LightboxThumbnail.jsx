'use client'

import { useMemo, useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import MirrorView from './MirrorView'
import { resolveEntryMirror } from './resolveEntryMirror'

export const THUMBNAIL_SIZE = 110

const NO_IMAGE_REF = {current: null}

// One lightbox entry: a small, mostly-bare preview of the shape/settings
// captured at the moment "Add to Lightbox" was used. Deliberately minimal
// (see the request this was built from) - no product name, no toolbar, no
// dimensions - just the image, a selected-state border, and a Close
// button that only appears on hover. Resolves its own geometry from the
// entry's stored productId/width/height/border rather than depending on
// whatever the main working panel currently shows, so old entries keep
// rendering correctly even after the main panel moves on.
export default function LightboxThumbnail( {entry, contours, substrateProducts, selected, onSelect, onRemove, dragHandleProps} )
{
  const [hovering, setHovering] = useState( false )

  const mirror = useMemo(
    () => resolveEntryMirror( entry, contours, substrateProducts ),
    [entry, contours, substrateProducts]
  )

  // Dimension callouts are unreadable clutter at thumbnail size, so they're
  // always suppressed here regardless of what the entry itself captured -
  // glass/back/zoom still reflect the captured settings.
  const thumbnailSettings = {...entry.settings, showDims: 0}

  return (
    <div
      {...dragHandleProps}
      onMouseEnter={() => setHovering( true )}
      onMouseLeave={() => setHovering( false )}
      onClick={onSelect}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        display: 'inline-block',
        cursor: 'pointer',
        borderRadius: 4,
        // MirrorView already draws its own 1px divider border - the
        // selected state adds an outline (outside the box, no layout
        // impact) rather than doubling up on borders.
        outline: selected ? '2px solid var(--mui-palette-primary-main)' : 'none',
        outlineOffset: 2,
      }}
    >
      {mirror && <MirrorView mirror={mirror} settings={thumbnailSettings} imageRef={NO_IMAGE_REF} size={THUMBNAIL_SIZE} />}

      {hovering && (
        <Tooltip title='Remove from lightbox'>
          <IconButton
            size='small'
            onClick={evt => { evt.stopPropagation(); onRemove() }}
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              padding: 2,
              background: 'var(--mui-palette-background-paper)',
            }}
          >
            <i className='ri-close-line' style={{fontSize: 14}} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
