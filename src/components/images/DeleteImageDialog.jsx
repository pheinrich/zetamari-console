'use client'

import { useEffect, useState, useTransition } from 'react'

import Link from 'next/link'

import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'

import { deleteImage, readImageProducts } from '@/db/actions/productImage'
import { useConfirm } from '@/contexts/confirmContext'

import { imageFileName } from './ImageInfo'

const SHOWN = 8

// Confirms deleting an Image: lists the products it'll be removed from
// (and which lose their primary image), and asks whether to keep the file
// in S3 or remove it too - the latter only after a second "Are you sure?".
// onDeleted() once it's gone.
export default function DeleteImageDialog( {image, open, onClose, onDeleted} )
{
  const confirm = useConfirm()
  const [isPending, startTransition] = useTransition()
  const [products, setProducts] = useState( null )
  const [fileChoice, setFileChoice] = useState( 'keep' )

  useEffect( () => {
    if( !open || !image )
      return

    setProducts( null )
    setFileChoice( 'keep' )
    readImageProducts( image.imageId ).then( setProducts )
  }, [open, image] )

  async function submit()
  {
    const removeFile = fileChoice === 'remove'

    if( removeFile && !await confirm(
      `${imageFileName( image.url )} will be permanently deleted from S3. This can't be undone, and anywhere outside this app that links to it will break.`,
      {title: 'Are you sure?', confirmText: 'Delete file', destructive: true},
    ) )
      return

    startTransition( async () => {
      const result = await deleteImage( image.imageId, {removeFile} )

      if( result.error )
        return toast.error( result.error )

      toast.success( removeFile ? 'Image and file deleted' : 'Image deleted' )
      onClose()
      await onDeleted?.()
    } )
  }

  const primaries = products?.filter( p => p.primary ) ?? []

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Delete image</DialogTitle>
      <DialogContent className='flex flex-col gap-4'>
        {!image || !products ? (
          <div className='flex justify-center p-6'><CircularProgress size={28} /></div>
        ) : (
          <>
            <Typography>
              Delete <strong className='break-all'>{imageFileName( image.url )}</strong> from the image library?
            </Typography>

            {products.length ? (
              <div className='flex flex-col gap-2'>
                <Typography>
                  It will be removed from {products.length === 1 ? 'the product' : `all ${products.length} products`} using it:
                </Typography>
                <ul className='m-0 flex flex-col gap-1 pis-5'>
                  {products.slice( 0, SHOWN ).map( p => (
                    <li key={p.id}>
                      <Link href={`/products/${p.id}`} target='_blank' className='text-primary'>{p.name}</Link>
                      <Typography component='span' variant='body2' color='text.secondary'> {p.sku}</Typography>
                      {p.primary && <Chip size='small' variant='tonal' color='warning' label='primary image' className='mis-2' />}
                    </li>
                  ) )}
                  {products.length > SHOWN && <li><Typography variant='body2' color='text.secondary'>and {products.length - SHOWN} more</Typography></li>}
                </ul>
                {primaries.length > 0 && (
                  <Alert severity='warning'>
                    It&apos;s the primary image of {primaries.length === 1 ? primaries[0].name : `${primaries.length} of them`}; {primaries.length === 1 ? 'its' : 'their'} next image will become primary{primaries.length === 1 ? '' : ' instead'}, or none if there isn&apos;t one.
                  </Alert>
                )}
              </div>
            ) : (
              <Typography color='text.secondary'>No product uses it.</Typography>
            )}

            <RadioGroup value={fileChoice} onChange={e => setFileChoice( e.target.value )}>
              <FormControlLabel value='keep' control={<Radio />} label='Keep the file in S3' />
              <FormControlLabel
                value='remove'
                control={<Radio color='error' />}
                label={<span>Remove from S3 <Typography component='span' variant='body2' color='text.secondary'>- permanently deletes the file</Typography></span>}
              />
            </RadioGroup>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button variant='contained' color='error' onClick={submit} disabled={!products || isPending}>
          {fileChoice === 'remove' ? 'Delete image and file' : 'Delete image'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
