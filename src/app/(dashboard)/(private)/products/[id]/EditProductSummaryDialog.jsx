'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { updateProductSummary } from '@/db/actions/product'
import { TYPES_WITH_INFO } from '@/libs/productInfo'
import { PRODUCT_TYPE_META, ASSEMBLED_TYPE_META } from '../ProductTypeMeta'

// Select value standing in for "no type" (an assembled product) - an MUI
// Select treats '' as empty and wouldn't display the matching item.
const ASSEMBLED = 'assembled'

function initialValues( product )
{
  return {
    name: product.name,
    sku: product.sku,
    type: product.type ?? ASSEMBLED,
    status: product.status,
    sellable: product.sellable,
    description: product.description ?? '',
  }
}

// The hero pane's Edit popup: just the summary fields shown in the hero.
export default function EditProductSummaryDialog( {open, setOpen, product} )
{
  const router = useRouter()
  const [values, setValues] = useState( () => initialValues( product ) )
  const [error, setError] = useState( null )
  const [isPending, startTransition] = useTransition()

  // Start from the product's current values on each open - the hero's
  // chips can toggle visibility/sellability after this first mounted.
  useEffect( () => {
    if( open )
    {
      setValues( initialValues( product ) )
      setError( null )
    }
  }, [open] ) // eslint-disable-line react-hooks/exhaustive-deps

  const newType = values.type === ASSEMBLED ? null : values.type
  const typeChanged = newType !== (product.type ?? null)
  // Types with an Info row lose those details on a type change.
  const losesInfo = typeChanged && TYPES_WITH_INFO.includes( product.type )
  const canSubmit = values.name.trim() && values.sku.trim() && !isPending

  function set( field, value )
  {
    setValues( (v) => ({...v, [field]: value}) )
  }

  function handleClose()
  {
    if( isPending )
      return

    setOpen( false )
  }

  function handleSubmit( e )
  {
    e.preventDefault()
    setError( null )

    startTransition( async () => {
      const result = await updateProductSummary({
        id: product.id,
        name: values.name.trim(),
        sku: values.sku.trim(),
        type: newType,
        status: values.status,
        sellable: values.sellable,
        description: values.description.trim() || null,
      })

      if( result?.error )
      {
        setError( result.error )
        return
      }

      toast.success( 'Product updated' )
      setOpen( false )
      router.refresh()
    })
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='sm' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Edit Product</div>
        <Typography component='span' className='flex flex-col text-center'>
          Update the product&#39;s name, SKU, type, availability and description.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='error'>{error}</Alert>
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                autoFocus
                label='Name'
                value={values.name}
                onChange={(e) => set( 'name', e.target.value )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label='SKU'
                value={values.sku}
                onChange={(e) => set( 'sku', e.target.value )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label='Type' value={values.type} onChange={(e) => set( 'type', e.target.value )}>
                  <MenuItem value={ASSEMBLED}>{ASSEMBLED_TYPE_META.label}</MenuItem>
                  {Object.entries( PRODUCT_TYPE_META ).map( ([value, meta]) => (
                    <MenuItem key={value} value={value}>{meta.label}</MenuItem>
                  ) )}
                </Select>
              </FormControl>
            </Grid>
            {losesInfo && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='warning'>
                  Changing the type discards this product&#39;s {PRODUCT_TYPE_META[product.type].label} details.
                </Alert>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.status === 'visible'}
                    onChange={(e) => set( 'status', e.target.checked ? 'visible' : 'hidden' )}
                  />
                }
                label='Visible'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={<Switch checked={values.sellable} onChange={(e) => set( 'sellable', e.target.checked )} />}
                label='Sellable'
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Description'
                value={values.description}
                onChange={(e) => set( 'description', e.target.value )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={!canSubmit}>
            {isPending ? 'Saving...' : 'Submit'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
