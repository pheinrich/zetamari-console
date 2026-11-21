'use client'

import { useEffect, useState, useTransition } from 'react'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { createProduct } from '@/db/actions/product'
import { dollarInputProps } from '@/utils/units'

// A Product made on the spot for a Channel Order Line nothing in the
// catalog matches - just the basics (name, SKU, prices), prefilled from
// the line, created as a finished (assembled, sellable) product. The rest
// (weights, bill of materials, images) is filled in later on its own page.
// onCreated( productId, sku ) gets the new Product's id to match the line to.
export default function NewProductDialog( {line, initialName, open, onClose, onCreated} )
{
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState( '' )
  const [sku, setSku] = useState( '' )
  const [priceWholesale, setPriceWholesale] = useState( '' )
  const [priceRetail, setPriceRetail] = useState( '' )

  useEffect( () => {
    if( !open )
      return

    setName( initialName || line.description || '' )
    setSku( line.sku ?? '' )
    setPriceWholesale( line.unitPrice ?? '' )
    setPriceRetail( '' )
  }, [open, line, initialName] )

  function submit()
  {
    startTransition( async () => {
      const result = await createProduct( {
        name: name.trim(),
        sku: sku.trim(),
        priceWholesale: priceWholesale === '' ? null : Number( priceWholesale ),
        priceRetail: priceRetail === '' ? null : Number( priceRetail ),
      } )

      if( result.error )
        return toast.error( result.error )

      await onCreated( result.id, sku.trim() )
    } )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>New product</DialogTitle>
      <DialogContent className='flex flex-col gap-4'>
        <Typography variant='body2' color='text.secondary'>
          For the line &ldquo;{line.sku ? `${line.sku} - ` : ''}{line.description}&rdquo;. It&apos;s matched to the new product once created; fill in the rest on the product&apos;s page.
        </Typography>
        <TextField label='Name' value={name} onChange={e => setName( e.target.value )} autoFocus required className='mbs-2' />
        <TextField label='SKU' value={sku} onChange={e => setSku( e.target.value )} required />
        <div className='flex gap-4'>
          <TextField
            label='Wholesale price'
            type='number'
            value={priceWholesale}
            onChange={e => setPriceWholesale( e.target.value )}
            InputProps={dollarInputProps()}
            fullWidth
          />
          <TextField
            label='Retail price'
            type='number'
            value={priceRetail}
            onChange={e => setPriceRetail( e.target.value )}
            InputProps={dollarInputProps()}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button variant='contained' onClick={submit} disabled={!name.trim() || !sku.trim() || isPending}>
          Create and match
        </Button>
      </DialogActions>
    </Dialog>
  )
}
