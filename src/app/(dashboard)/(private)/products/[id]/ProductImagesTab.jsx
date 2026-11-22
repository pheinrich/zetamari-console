'use client'

import { useEffect, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Typography from '@mui/material/Typography'

import { detachProductImage, reorderProductImages } from '@/db/actions/productImage'
import { useConfirm } from '@/contexts/confirmContext'
import ImageInfo, { imageFileName } from '@/components/images/ImageInfo'

import ImageSelectDialog from './ImageSelectDialog'

const COLUMNS = 3

const isFileDrag = e => Array.from( e.dataTransfer?.types ?? [] ).includes( 'Files' )

// The product page's Images tab: the product's gallery as a scrollable
// masonry list (drag to reorder - the first is the primary image;
// double-click opens the file), the selected image's details beside it,
// and "Select" to add images from the library (or upload new ones) -
// see ImageSelectDialog. `images` comes from readProductImages().
export default function ProductImagesTab( {productId, images} )
{
  const router = useRouter()
  const confirm = useConfirm()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState( images )
  const [selectedId, setSelectedId] = useState( images[0]?.linkId ?? null )
  const [dims, setDims] = useState( {} )   // imageId -> {width, height}
  const [dragId, setDragId] = useState( null )
  const [selecting, setSelecting] = useState( false )

  // Server data wins whenever it changes (after adding, a refresh, …)
  useEffect( () => {
    setItems( images )
    setSelectedId( id => images.some( i => i.linkId === id ) ? id : images[0]?.linkId ?? null )
  }, [images] )

  const selected = items.find( i => i.linkId === selectedId ) ?? null

  function dragOver( e, overId )
  {
    if( dragId === null || isFileDrag( e ) )
      return

    e.preventDefault()

    if( overId === dragId )
      return

    setItems( list => {
      const from = list.findIndex( i => i.linkId === dragId )
      const to = list.findIndex( i => i.linkId === overId )
      const next = [...list]

      next.splice( to, 0, next.splice( from, 1 )[0] )

      return next
    } )
  }

  function dragEnd()
  {
    setDragId( null )

    const order = items.map( i => i.linkId )

    if( order.join() === images.map( i => i.linkId ).join() )
      return

    startTransition( async () => {
      await reorderProductImages( productId, order )
      router.refresh()
    } )
  }

  async function detach()
  {
    const others = selected.productCount - 1
    const message = `Remove ${imageFileName( selected.url )} from this product?${others ? ` It stays on the ${others} other product${others === 1 ? '' : 's'} using it.` : ''} It stays in the image library.`

    if( !await confirm( message, {confirmText: 'Remove', destructive: true} ) )
      return

    startTransition( async () => {
      await detachProductImage( selected.linkId )
      router.refresh()
    } )
  }

  const others = selected ? selected.productCount - 1 : 0

  return (
    <Card>
      <CardHeader
        title='Images'
        subheader='Drag to reorder - the first is the primary image. Double-click one to open it.'
        action={<Button variant='contained' startIcon={<i className='ri-image-add-line' />} onClick={() => setSelecting( true )}>Select</Button>}
      />
      <CardContent>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='md:is-7/12 overflow-y-auto rounded border' style={{maxBlockSize: 520, borderColor: 'var(--mui-palette-divider)'}}>
            {items.length ? (

              // Masonry, but in reading order: item i goes in column i % 3, so
              // the top row is 1-2-3 left to right. (MUI's masonry variant
              // uses CSS columns, which run down each column instead.)
              <div className='flex items-start gap-2 p-2'>
                {Array.from( {length: COLUMNS}, (_, col) => (
                  <ImageList key={col} cols={1} gap={8} className='m-0 flex-1 overflow-visible'>
                    {items.map( (item, i) => ({item, i}) ).filter( ({i}) => i % COLUMNS === col ).map( ({item, i}) => (
                      <ImageListItem
                        key={item.linkId}
                        draggable
                        onDragStart={e => {
                          e.dataTransfer.effectAllowed = 'move'
                          setDragId( item.linkId )
                        }}
                        onDragOver={e => dragOver( e, item.linkId )}
                        onDragEnd={dragEnd}
                        onClick={() => setSelectedId( item.linkId )}
                        onDoubleClick={() => window.open( item.url, '_blank', 'noopener' )}
                        className='cursor-pointer overflow-hidden rounded'
                        sx={{
                          outline: item.linkId === selectedId ? '3px solid var(--mui-palette-primary-main)' : 'none',
                          outlineOffset: -3,
                          opacity: item.linkId === dragId ? 0.4 : 1,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.altText ?? ''}
                          loading='lazy'
                          draggable={false}
                          onLoad={e => {
                            const {naturalWidth: width, naturalHeight: height} = e.currentTarget

                            setDims( d => ({...d, [item.imageId]: {width, height}}) )
                          }}
                        />
                        {0 === i && <Chip size='small' color='primary' label='Primary' className='absolute inline-start-2 block-start-2' />}
                      </ImageListItem>
                    ) )}
                  </ImageList>
                ) )}
              </div>
            ) : (
              <div className='flex flex-col items-center gap-3 p-10'>
                <Typography color='text.secondary'>No images yet.</Typography>
                <Button variant='outlined' onClick={() => setSelecting( true )}>Select images</Button>
              </div>
            )}
          </div>

          <div className='md:is-5/12'>
            {selected ? (
              <ImageInfo image={selected} dimensions={dims[selected.imageId]} onChanged={() => router.refresh()}>
                <Typography variant='body2' color='text.secondary'>
                  {others ? `Also used by ${others} other product${others === 1 ? '' : 's'}.` : 'Used only by this product.'}
                </Typography>
                <div>
                  <Button size='small' color='error' variant='outlined' startIcon={<i className='ri-link-unlink' />} onClick={detach} disabled={isPending}>
                    Remove from this product
                  </Button>
                </div>
              </ImageInfo>
            ) : (
              <Typography color='text.secondary'>Select an image to see its details.</Typography>
            )}
          </div>
        </div>
      </CardContent>

      <ImageSelectDialog
        productId={productId}
        attachedIds={new Set( items.map( i => i.imageId ) )}
        open={selecting}
        onClose={() => setSelecting( false )}
        onAdded={() => router.refresh()}
      />
    </Card>
  )
}
