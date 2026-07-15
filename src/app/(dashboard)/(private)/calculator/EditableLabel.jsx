'use client'

import { useEffect, useState } from 'react'

import ClickAwayListener from '@mui/material/ClickAwayListener'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// A plain title that becomes an editable text field in place when
// clicked - replaces the old Prototype dropdown. This is the name used
// in printable reports and, on hover, for lightbox thumbnails - it no
// longer has to match any product's name (Copy From sets it as a
// starting point, but it's freely renamable afterward).
export default function EditableLabel( {value, onChange, placeholder = 'Untitled Prototype'} )
{
  const [editing, setEditing] = useState( false )
  const [draft, setDraft] = useState( value ?? '' )

  // Keep the draft in sync with external updates (e.g. Copy From, or
  // loading a different lightbox entry) while not currently editing -
  // once editing starts, external changes are ignored until commit/cancel.
  useEffect( () => {
    if( !editing )
      setDraft( value ?? '' )
  }, [value, editing] )

  function commit()
  {
    setEditing( false )

    const trimmed = draft.trim()
    if( trimmed !== (value ?? '') )
      onChange( trimmed )
  }

  function cancel()
  {
    setDraft( value ?? '' )
    setEditing( false )
  }

  if( !editing )
  {
    return (
      <Typography
        variant='h6'
        onClick={() => setEditing( true )}
        style={{cursor: 'text'}}
        title='Click to rename'
      >
        {value || placeholder}
      </Typography>
    )
  }

  return (
    <ClickAwayListener onClickAway={commit}>
      <TextField
        autoFocus
        size='small'
        variant='standard'
        value={draft}
        placeholder={placeholder}
        onChange={evt => setDraft( evt.target.value )}
        onFocus={evt => evt.target.select()}
        onKeyDown={evt => {
          if( 'Enter' === evt.key )
          {
            evt.preventDefault()
            commit()
          }
          else if( 'Escape' === evt.key )
          {
            evt.preventDefault()
            cancel()
          }
        }}
      />
    </ClickAwayListener>
  )
}
