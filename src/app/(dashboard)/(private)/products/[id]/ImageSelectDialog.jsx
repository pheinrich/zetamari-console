'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { attachImagesToProduct, readImages } from '@/db/actions/productImage'
import ImageLibrary from '@/components/images/ImageLibrary'

// The product Images tab's "Select": the image library (as on the Images
// page) with checkboxes, to add existing or newly uploaded images to the
// product. Images it already has show checked and locked; fresh uploads
// are checked for you. onAdded() after the product's images change.
export default function ImageSelectDialog( {productId, attachedIds, open, onClose, onAdded} )
{
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState( null )
  const [selected, setSelected] = useState( new Set() )

  const load = useCallback( () => readImages().then( setImages ), [] )

  useEffect( () => {
    if( !open )
      return

    setImages( null )
    setSelected( new Set() )
    load()
  }, [open, load] )

  function toggle( id )
  {
    setSelected( s => {
      const next = new Set( s )

      next.has( id ) ? next.delete( id ) : next.add( id )

      return next
    } )
  }

  function add()
  {
    startTransition( async () => {
      // In the order they appear in the library (newest first)
      const ids = images.map( i => i.imageId ).filter( id => selected.has( id ) )
      const result = await attachImagesToProduct( productId, ids )

      if( result.error )
        return toast.error( result.error )

      toast.success( `Added ${ids.length} image${ids.length === 1 ? '' : 's'}` )
      onAdded?.()
      onClose()
    } )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>Select images</DialogTitle>
      <DialogContent>
        {images ? (
          <ImageLibrary
            images={images}
            onChanged={load}
            onUploaded={fresh => setSelected( s => new Set( [...s, ...fresh.map( i => i.imageId ).filter( id => !attachedIds.has( id ) )] ) )}
            selectable
            selectedIds={selected}
            onToggle={toggle}
            lockedIds={attachedIds}
            tableHeight={420}
          />
        ) : (
          <div className='flex justify-center p-10'><CircularProgress /></div>
        )}
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={add} disabled={!selected.size || isPending}>
          {selected.size ? `Add ${selected.size} image${selected.size === 1 ? '' : 's'}` : 'Add images'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
