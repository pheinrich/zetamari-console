'use client'

import { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import tableStyles from '@core/styles/table.module.css'

import ImageDropZone from './ImageDropZone'
import DeleteImageDialog from './DeleteImageDialog'
import ImageInfo from './ImageInfo'

const openImage = url => window.open( url, '_blank', 'noopener' )

// The image library: every Image, searchable, in a table (thumbnail, URL
// with alt text beneath, how many products use it) beside a preview of the
// active one with its details and a Delete button, and an upload drop zone
// underneath. Used by the Images page and, with `selectable`, by the
// product page's image picker.
//
// images: readImages() rows. onChanged(): reload them (after an alt-text
// edit, a delete or an upload). onUploaded( images ): called with fresh
// uploads, after onChanged(). With `selectable`: a checkbox column driven
// by selectedIds/onToggle( imageId ); lockedIds are shown checked and
// can't be changed (e.g. images already on the product).
export default function ImageLibrary( {images, onChanged, onUploaded, selectable = false, selectedIds, onToggle, lockedIds, tableHeight = 520} )
{
  const [deleting, setDeleting] = useState( false )
  const [search, setSearch] = useState( '' )
  const [activeId, setActiveId] = useState( images[0]?.imageId ?? null )
  const [dims, setDims] = useState( {} )   // imageId -> {width, height}

  const shown = useMemo( () => {
    const words = search.trim().toLowerCase().split( /\s+/ ).filter( Boolean )

    return words.length ? images.filter( i => words.every( w => `${i.url} ${i.altText ?? ''}`.toLowerCase().includes( w ) ) ) : images
  }, [images, search] )

  // Keep a shown image previewed as the list or the search changes
  useEffect( () => {
    if( !shown.some( i => i.imageId === activeId ) )
      setActiveId( shown[0]?.imageId ?? null )
  }, [shown, activeId] )

  const active = images.find( i => i.imageId === activeId ) ?? null

  async function uploaded( fresh )
  {
    await onChanged?.()
    setActiveId( fresh[0]?.imageId ?? activeId )
    onUploaded?.( fresh )
  }

  const noteDims = id => e => {
    const {naturalWidth: width, naturalHeight: height} = e.currentTarget

    setDims( d => d[id] ? d : {...d, [id]: {width, height}} )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-6 md:flex-row'>
        {/* Preview and details */}
        <div className='flex flex-col gap-4 md:is-1/3'>
          {active ? (
            <>
              <Tooltip title='Double-click to open in a new tab' placement='top'>
                <div
                  className='flex items-center justify-center overflow-hidden rounded cursor-zoom-in'
                  style={{blockSize: 300, backgroundColor: 'var(--mui-palette-action-hover)'}}
                  onDoubleClick={() => openImage( active.url )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img key={active.imageId} src={active.url} alt={active.altText ?? ''} onLoad={noteDims( active.imageId )} className='max-is-full max-bs-full object-contain' />
                </div>
              </Tooltip>
              <ImageInfo image={active} dimensions={dims[active.imageId]} onChanged={onChanged}>
                <div>
                  <Button color='error' variant='contained' startIcon={<i className='ri-delete-bin-7-line' />} onClick={() => setDeleting( true )}>
                    Delete
                  </Button>
                </div>
              </ImageInfo>
            </>
          ) : (
            <Typography color='text.secondary'>No image selected.</Typography>
          )}
        </div>

        {/* Search and table */}
        <div className='flex min-is-0 flex-col gap-3 md:is-2/3'>
          <TextField
            size='small'
            placeholder='Search file names and alt text'
            value={search}
            onChange={e => setSearch( e.target.value )}
            InputProps={{startAdornment: <InputAdornment position='start'><i className='ri-search-line' /></InputAdornment>}}
          />
          <div className='overflow-y-auto rounded border' style={{maxBlockSize: tableHeight, borderColor: 'var(--mui-palette-divider)'}}>
            <table className={tableStyles.table} style={{tableLayout: 'fixed', inlineSize: '100%'}}>
              <thead className='sticky block-start-0 z-[1]' style={{backgroundColor: 'var(--mui-palette-background-paper)'}}>
                <tr>
                  {selectable && <th style={{inlineSize: 56}} />}
                  <th style={{inlineSize: 72}} />
                  <th>URL</th>
                  <th style={{inlineSize: 100, textAlign: 'end'}}>Products</th>
                </tr>
              </thead>
              <tbody>
                {shown.map( image => {
                  const locked = lockedIds?.has( image.imageId )

                  return (
                    <tr
                      key={image.imageId}
                      onClick={() => setActiveId( image.imageId )}
                      onDoubleClick={() => openImage( image.url )}
                      className='cursor-pointer'
                      style={image.imageId === activeId ? {backgroundColor: 'var(--mui-palette-primary-lightOpacity)'} : undefined}
                    >
                      {selectable && (
                        <td onClick={e => e.stopPropagation()}>
                          <Tooltip title={locked ? 'Already on this product' : ''}>
                            <span>
                              <Checkbox
                                size='small'
                                checked={locked || selectedIds?.has( image.imageId )}
                                disabled={locked}
                                onChange={() => onToggle?.( image.imageId )}
                              />
                            </span>
                          </Tooltip>
                        </td>
                      )}
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt='' loading='lazy' className='block rounded object-cover' style={{inlineSize: 48, blockSize: 48}} />
                      </td>
                      <td>
                        <div className='truncate' title={image.url}>{image.url}</div>
                        {image.altText && <Typography variant='body2' color='text.secondary' className='whitespace-normal break-words'>{image.altText}</Typography>}
                      </td>
                      <td style={{textAlign: 'end'}}>{image.productCount}</td>
                    </tr>
                  )
                } )}
                {!shown.length && (
                  <tr><td colSpan={selectable ? 4 : 3} className='text-center'>{images.length ? 'No images match.' : 'No images yet.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Typography variant='caption' color='text.secondary'>
            {shown.length === images.length ? `${images.length} images` : `${shown.length} of ${images.length} images`}
          </Typography>
        </div>
      </div>

      <ImageDropZone onUploaded={uploaded} />

      <DeleteImageDialog image={active} open={deleting} onClose={() => setDeleting( false )} onDeleted={onChanged} />
    </div>
  )
}
