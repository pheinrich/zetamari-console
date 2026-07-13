'use client'

import { useState } from 'react'

import Typography from '@mui/material/Typography'

import LightboxThumbnail from './LightboxThumbnail'

// The horizontally scrolling strip of saved prototypes. Drag-and-drop
// reordering uses the native HTML5 drag API (no extra dependency) - each
// thumbnail is itself the draggable element (dragging starts from a
// press-and-move gesture, which doesn't interfere with a plain click to
// select), and the wrapping div here is the drop target that actually
// performs the reorder.
export default function LightboxStrip( {gallery, contours, substrateProducts, selectedId, onSelect, onRemove, onReorder} )
{
  const [dragId, setDragId] = useState( null )

  if( 0 === gallery.length )
  {
    return (
      <Typography variant='body2' color='text.secondary'>
        No saved prototypes yet - use the menu (⋮) above to add the current view to the lightbox.
      </Typography>
    )
  }

  return (
    <div style={{display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8}}>
      {gallery.map( entry => (
        <div
          key={entry.id}
          onDragOver={evt => evt.preventDefault()}
          onDrop={() => { onReorder( dragId, entry.id ); setDragId( null ) }}
        >
          <LightboxThumbnail
            entry={entry}
            contours={contours}
            substrateProducts={substrateProducts}
            selected={selectedId === entry.id}
            onSelect={() => onSelect( entry )}
            onRemove={() => onRemove( entry.id )}
            dragHandleProps={{
              draggable: true,
              onDragStart: () => setDragId( entry.id ),
              onDragEnd: () => setDragId( null ),
            }}
          />
        </div>
      ) )}
    </div>
  )
}
