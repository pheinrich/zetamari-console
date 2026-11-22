'use client'

import { useEffect, useState, useTransition } from 'react'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { readImageFileSize, updateImageAltText } from '@/db/actions/productImage'

export const imageFileName = url => decodeURIComponent( url.split( '/' ).pop() )

function formatBytes( bytes )
{
  if( bytes < 1024 )
    return `${bytes} B`

  if( bytes < 1024 * 1024 )
    return `${(bytes / 1024).toFixed( 1 )} KB`

  return `${(bytes / 1024 / 1024).toFixed( 1 )} MB`
}

// File sizes already looked up this session, by image id
const sizeCache = {}

// The selected image's details: file name (linking to the file), alt text
// with an in-place editor, dimensions and file size. Alt text belongs to
// the shared Image, so the editor says how many products it reaches.
// `image` is {imageId, url, altText, productCount}; `dimensions` comes from
// whichever <img> showed it ({width, height}); onChanged() after a save.
// Children (action buttons) go underneath.
export default function ImageInfo( {image, dimensions, onChanged, children} )
{
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState( false )
  const [draft, setDraft] = useState( '' )
  const [size, setSize] = useState( sizeCache[image.imageId] )

  useEffect( () => {
    setEditing( false )
    setSize( sizeCache[image.imageId] )

    if( !(image.imageId in sizeCache) )
      readImageFileSize( image.url ).then( bytes => {
        sizeCache[image.imageId] = bytes
        setSize( bytes )
      } )
  }, [image.imageId, image.url] )

  function save()
  {
    startTransition( async () => {
      await updateImageAltText( image.imageId, draft )
      setEditing( false )
      await onChanged?.()
    } )
  }

  const count = image.productCount

  const reach = count > 1
    ? `Shared image: this changes the alt text on all ${count} products that use it.`
    : count === 1 ? 'Only one product uses this image.' : 'No product uses this image yet.'

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <Typography variant='caption' color='text.secondary'>File name</Typography>
        <Typography className='break-all'>
          <a href={image.url} target='_blank' rel='noopener noreferrer' className='text-primary'>
            {imageFileName( image.url )} <i className='ri-external-link-line text-sm' />
          </a>
        </Typography>
      </div>

      <div>
        <Typography variant='caption' color='text.secondary'>Alt text</Typography>
        {editing ? (
          <div className='flex flex-col gap-1'>
            <TextField
              size='small'
              autoFocus
              multiline
              value={draft}
              onChange={e => setDraft( e.target.value )}
              onKeyDown={e => {
                if( e.key === 'Enter' && !e.shiftKey )
                {
                  e.preventDefault()
                  save()
                }

                if( e.key === 'Escape' )
                  setEditing( false )
              }}
              disabled={isPending}
            />
            <Typography variant='caption' color={count > 1 ? 'warning.main' : 'text.secondary'}>{reach}</Typography>
            <div className='flex gap-2'>
              <Button size='small' variant='contained' onClick={save} disabled={isPending}>Save</Button>
              <Button size='small' color='secondary' onClick={() => setEditing( false )} disabled={isPending}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className='flex items-start gap-1'>
            <Typography color={image.altText ? 'text.primary' : 'text.secondary'}>{image.altText || 'none'}</Typography>
            <Tooltip title={count > 1 ? `Edit (shared by ${count} products)` : 'Edit'}>
              <IconButton size='small' className='-mbs-1' onClick={() => { setDraft( image.altText ?? '' ); setEditing( true ) }}>
                <i className='ri-pencil-line text-base' />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      <div className='flex gap-8'>
        <div>
          <Typography variant='caption' color='text.secondary'>Dimensions</Typography>
          <Typography>{dimensions ? `${dimensions.width} × ${dimensions.height} px` : '…'}</Typography>
        </div>
        <div>
          <Typography variant='caption' color='text.secondary'>File size</Typography>
          <Typography>{size === undefined ? '…' : size === null ? 'unknown' : formatBytes( size )}</Typography>
        </div>
      </div>

      {children}
    </div>
  )
}
