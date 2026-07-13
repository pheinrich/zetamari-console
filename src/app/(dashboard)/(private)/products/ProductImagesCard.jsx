'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { addProductImage, removeProductImage, reorderProductImage } from '@/db/actions/product'

// Images live in S3 and are referenced by URL (no upload widget here - see
// the product list restyle conversation for why). The same image may be
// attached to more than one product; removing it here only unlinks it from
// this product, it never deletes the shared Image row.
export default function ProductImagesCard( {productId, images} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [url, setUrl] = useState( '' )
  const [altText, setAltText] = useState( '' )
  const [error, setError] = useState( null )

  const sorted = [...images].sort( (a, b) => (a.ProductImage?.sortOrder ?? 0) - (b.ProductImage?.sortOrder ?? 0) )

  function handleAdd()
  {
    if( !url )
      return

    setError( null )
    startTransition( async () => {
      const result = await addProductImage( productId, url, altText || undefined )
      if( result?.error )
        setError( result.error )
      else
      {
        setUrl( '' )
        setAltText( '' )
        router.refresh()
      }
    })
  }

  function handleRemove( productImageId )
  {
    if( !confirm( 'Remove this image from the product? (The image itself is not deleted - only the link to this product.)' ) )
      return

    startTransition( async () => {
      try
      {
        await removeProductImage( productImageId )
        router.refresh()
      }
      catch( err )
      {
        toast.error( 'Failed to remove the image' )
      }
    })
  }

  function handleMove( index, direction )
  {
    const other = sorted[index + direction]
    if( !other )
      return

    const current = sorted[index]

    startTransition( async () => {
      await Promise.all([
        reorderProductImage( current.ProductImage.id, other.ProductImage.sortOrder ),
        reorderProductImage( other.ProductImage.id, current.ProductImage.sortOrder ),
      ])
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader title='Images' />
      <CardContent className='flex flex-col gap-4'>
        {sorted.length === 0 && (
          <Typography color='text.secondary'>No images attached yet.</Typography>
        )}
        {sorted.length > 0 && (
          <List disablePadding>
            {sorted.map( (image, index) => (
              <ListItem key={image.ProductImage.id} className='pis-0 plb-2' divider>
                <div className='flex items-center gap-4 is-full'>
                  <img
                    src={image.url}
                    alt={image.altText || ''}
                    width={44}
                    height={44}
                    className='rounded bg-actionHover object-cover'
                  />
                  <div className='flex flex-col flex-grow min-is-0'>
                    <Typography className='truncate' variant='body2'>{image.url}</Typography>
                    {index === 0 && <Typography variant='caption' color='text.secondary'>Primary</Typography>}
                  </div>
                  <IconButton size='small' disabled={isPending || index === 0} onClick={() => handleMove( index, -1 )}>
                    <i className='ri-arrow-up-line' />
                  </IconButton>
                  <IconButton size='small' disabled={isPending || index === sorted.length - 1} onClick={() => handleMove( index, 1 )}>
                    <i className='ri-arrow-down-line' />
                  </IconButton>
                  <IconButton size='small' disabled={isPending} onClick={() => handleRemove( image.ProductImage.id )}>
                    <i className='ri-close-line' />
                  </IconButton>
                </div>
              </ListItem>
            ) )}
          </List>
        )}

        <TextField
          fullWidth
          size='small'
          label='Image URL'
          placeholder='https://...'
          value={url}
          onChange={e => setUrl( e.target.value )}
        />
        <TextField
          fullWidth
          size='small'
          label='Alt Text (optional)'
          value={altText}
          onChange={e => setAltText( e.target.value )}
        />
        {error && <Typography color='error' variant='body2'>{error}</Typography>}
        <Button variant='outlined' disabled={isPending || !url} onClick={handleAdd}>
          Add Image
        </Button>
      </CardContent>
    </Card>
  )
}
