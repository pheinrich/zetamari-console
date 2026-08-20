'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { z } from 'zod'

import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createProduct } from '@/db/actions/product'
import { MIRROR_GLASS_SHAPE_VALUES, resolveMirrorGlassShape } from './mirrorGlassShape'
import CreateWoodenBaseDialog from './CreateWoodenBaseDialog'
import CreateMirrorGlassDialog from './CreateMirrorGlassDialog'

// Which Pricing-tab "Include" rows (see configurationCost.js's
// PRICING_ROWS) correspond to a real, BOM-able Product material - the
// rest (Machine/Labor/Breakage rows) are cost-formula inputs with no
// Product of their own to attach. `productTypes` is what each row's
// picker filters the catalog to. `creatable` marks the two shape-derived
// categories where "no suitable existing product" can be resolved right
// here by forking the Visualizer's own current shape into a brand new one
// (see CreateWoodenBaseDialog/CreateMirrorGlassDialog, and the
// `directCategory` case below) - Tesserae/Grout have no shape data in the
// working panel to seed a new product from, so they're pick-an-existing-
// product-or-leave-blank only.
const MATERIAL_CATEGORIES = [
  { key: 'woodenBase', label: 'Wooden Base', productTypes: ['wooden base'], creatable: true },
  { key: 'mirrorGlass', label: 'Mirror Glass', productTypes: ['mirror glass'], creatable: true },
  { key: 'tesserae', label: 'Tesserae', productTypes: ['bead', 'tile', 'millefiori'], creatable: false },
  { key: 'grout', label: 'Grout', productTypes: ['grout'], creatable: false },
]

const assembledSchema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  bomLines: z.array( z.object({
    materialProductId: z.coerce.number().int(),
    quantity: z.coerce.number().positive(),
  }) ).optional(),
})

const woodenBaseSchema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  type: z.literal( 'wooden base' ),
  woodenBaseInfo: z.object({
    outsideId: z.coerce.number().int(),
    insideId: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().int().optional() ),
    rabbetId: z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().int().optional() ),
    width: z.coerce.number(),
    height: z.coerce.number(),
    border: z.coerce.number(),
  }),
})

const mirrorGlassSchema = z.object({
  name: z.string().min( 1 ),
  sku: z.string().min( 1 ),
  type: z.literal( 'mirror glass' ),
  mirrorGlassInfo: z.object({
    contourId: z.coerce.number().int(),
    shape: z.enum( MIRROR_GLASS_SHAPE_VALUES ),
    width: z.coerce.number(),
    height: z.coerce.number(),
    thickness: z.coerce.number(),
    bevel: z.coerce.number(),
  }),
})

// Replaces the old "Save New Wooden Base.../Save New Mirror Glass..."
// kebab items with a single Pricing-tab action driven by whichever
// Material rows are currently checked "Include" there (see
// StatsSummary.jsx's `include` state and configurationCost.js's
// CONFIGURATIONS):
//
//   - Wooden Base or Mirror Glass alone (`directCategory` below, per the
//     2026-08-19 revision): the working panel's current shape *is* the
//     new product - this creates that single Wooden Base/Mirror Glass
//     Product directly (its own type + Info row), with no Bill of
//     Materials at all, same as the two old dialogs each used to.
//   - Any other combination (including Wooden Base + Mirror Glass
//     together, e.g. the Substrate/Kit/Finished Mirror presets): creates
//     the ASSEMBLED product (type: null) a real Finished Mirror would be,
//     with one Bill of Materials line per checked category, each resolved
//     to a real catalog Product - Wooden Base/Mirror Glass can still be
//     forked fresh from the current shape here (see CreateWoodenBaseDialog/
//     CreateMirrorGlassDialog) when no existing product already matches;
//     Tesserae/Grout have no shape of their own, so they're pick-existing-
//     or-leave-blank.
//
// Either way the new product starts as a hidden, non-sellable draft -
// parked for someone to finish out (pricing, images, etc.) on its own
// edit page, which this dialog redirects to on success.
export default function CreateNewProductDialog( {open, onClose, label, substrateInfo, outsideContour, include, products} )
{
  const router = useRouter()
  const [extraProducts, setExtraProducts] = useState( [] )
  const [selected, setSelected] = useState( {} )
  const [quantities, setQuantities] = useState( {} )
  const [createCategory, setCreateCategory] = useState( null )
  const createdIdRef = useRef( null )

  const activeCategories = MATERIAL_CATEGORIES.filter( c => include?.[c.key] )
  const directCategory = (1 === activeCategories.length && activeCategories[0].creatable) ? activeCategories[0] : null

  const schema = !directCategory
    ? assembledSchema
    : ('woodenBase' === directCategory.key ? woodenBaseSchema : mirrorGlassSchema)

  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: async data => {
      const payload = directCategory
        ? {...data, status: 'hidden', sellable: false}
        : {...data, type: null, status: 'hidden', sellable: false}

      const result = await createProduct( payload )

      if( result?.success )
        createdIdRef.current = result.id

      return result
    },
  })

  useEffect( () => {
    if( !success )
      return

    onClose()
    router.push( `/products/${createdIdRef.current}` )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success] )

  // Starts fresh every time the dialog opens - picks/quantities from a
  // previous open (or a previous, cancelled submission) shouldn't carry
  // over into the next one.
  useEffect( () => {
    if( !open )
      return

    setExtraProducts( [] )
    setSelected( {} )
    setQuantities( Object.fromEntries( MATERIAL_CATEGORIES.map( c => [c.key, 1] ) ) )
  }, [open] )

  // Products created inline via CreateWoodenBaseDialog/CreateMirrorGlassDialog
  // (see handleCreated below) merge in here so they're immediately
  // selectable in their row's Autocomplete, same as any pre-existing
  // catalog product.
  const allProducts = useMemo( () => [...products, ...extraProducts], [products, extraProducts] )

  const bomLineEntries = directCategory ? [] : activeCategories
    .map( c => ({key: c.key, materialProductId: selected[c.key]?.id, quantity: quantities[c.key]}) )
    .filter( e => e.materialProductId )

  function candidatesFor( category )
  {
    // A product already picked for another row here can't also fill
    // this one - same "no duplicate material" idea BomEditor.jsx's own
    // picker enforces (there, by excluding every already-used bomLines
    // row; here, nothing's persisted yet, so it's just the other rows'
    // current picks).
    const usedIds = new Set(
      Object.entries( selected )
        .filter( ([key]) => key !== category.key )
        .map( ([, p]) => p?.id )
        .filter( Boolean )
    )

    return allProducts.filter( p => category.productTypes.includes( p.type ) && !usedIds.has( p.id ) )
  }

  function handleCreated( categoryKey, product )
  {
    setExtraProducts( prev => [...prev, product] )
    setSelected( prev => ({...prev, [categoryKey]: product}) )
    setCreateCategory( null )
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth PaperProps={{component: 'form', onSubmit: handleSubmit}}>
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          {directCategory ? (
            <DialogContentText className='mbe-4'>
              Only {directCategory.label} is currently checked &ldquo;Include&rdquo; on the Pricing tab, so this
              creates a new {directCategory.label} Product directly - using the shape/dimensions currently shown in
              the Visualizer - rather than a wrapper product referencing one.
            </DialogContentText>
          ) : (
            <DialogContentText className='mbe-4'>
              This creates a new, hidden draft Product in your inventory using the shape currently shown in the
              Visualizer, with a Bill of Materials line for each Material row currently checked &ldquo;Include&rdquo;
              on the Pricing tab. You&rsquo;ll land on the new product&rsquo;s own page afterward to finish it out
              (pricing, images, etc.) before making it visible.
            </DialogContentText>
          )}

          {errors && (
            <Alert severity='error' className='mbe-4'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          )}

          <Stack spacing={4}>
            <TextField fullWidth autoFocus label='Name' name='name' defaultValue={label || ''} required />
            <TextField fullWidth label='SKU' name='sku' required />

            {directCategory ? null : 0 === activeCategories.length ? (
              <Typography variant='body2' color='text.secondary'>
                No Material rows are currently checked &ldquo;Include&rdquo; on the Pricing tab - check one or more
                there (Wooden Base, Mirror Glass, Tesserae, Grout) to attach them here as Bill of Materials lines.
              </Typography>
            ) : (
              <>
                <Divider />
                <Typography variant='subtitle2'>Bill of Materials</Typography>
                {activeCategories.map( category => (
                  <Stack key={category.key} direction='row' spacing={2} alignItems='flex-start'>
                    <Autocomplete
                      fullWidth
                      size='small'
                      options={candidatesFor( category )}
                      getOptionLabel={p => `${p.name} (${p.sku})`}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      value={selected[category.key] ?? null}
                      onChange={(evt, value) => setSelected( prev => ({...prev, [category.key]: value}) )}
                      renderInput={params => <TextField {...params} label={category.label} placeholder='— none —' />}
                    />
                    <TextField
                      type='number'
                      label='Qty'
                      size='small'
                      sx={{width: 90}}
                      inputProps={{step: '0.0001', min: '0'}}
                      value={quantities[category.key] ?? 1}
                      onChange={evt => setQuantities( prev => ({...prev, [category.key]: evt.target.value}) )}
                    />
                    {category.creatable && (
                      <Button size='small' sx={{whiteSpace: 'nowrap', mt: 1}} onClick={() => setCreateCategory( category.key )}>
                        + New
                      </Button>
                    )}
                  </Stack>
                ) )}
              </>
            )}
          </Stack>

          {directCategory && 'woodenBase' === directCategory.key && (
            <>
              <input type='hidden' name='type' value='wooden base' />
              <input type='hidden' name='woodenBaseInfo.outsideId' value={substrateInfo?.outsideId ?? ''} />
              <input type='hidden' name='woodenBaseInfo.insideId' value={substrateInfo?.insideId ?? ''} />
              <input type='hidden' name='woodenBaseInfo.rabbetId' value={substrateInfo?.rabbetId ?? ''} />
              <input type='hidden' name='woodenBaseInfo.width' value={substrateInfo?.width ?? ''} />
              <input type='hidden' name='woodenBaseInfo.height' value={substrateInfo?.height ?? ''} />
              <input type='hidden' name='woodenBaseInfo.border' value={substrateInfo?.border ?? ''} />
            </>
          )}

          {directCategory && 'mirrorGlass' === directCategory.key && (
            <>
              <input type='hidden' name='type' value='mirror glass' />
              <input type='hidden' name='mirrorGlassInfo.contourId' value={substrateInfo?.outsideId ?? ''} />
              <input type='hidden' name='mirrorGlassInfo.shape' value={resolveMirrorGlassShape( outsideContour )} />
              <input type='hidden' name='mirrorGlassInfo.width' value={substrateInfo?.width ?? ''} />
              <input type='hidden' name='mirrorGlassInfo.height' value={substrateInfo?.height ?? ''} />
              <input type='hidden' name='mirrorGlassInfo.thickness' value='0.125' />
              <input type='hidden' name='mirrorGlassInfo.bevel' value='0' />
            </>
          )}

          {bomLineEntries.map( (entry, i) => (
            <Fragment key={entry.key}>
              <input type='hidden' name={`bomLines.${i}.materialProductId`} value={entry.materialProductId} />
              <input type='hidden' name={`bomLines.${i}.quantity`} value={entry.quantity} />
            </Fragment>
          ) )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='secondary'>Cancel</Button>
          <Button type='submit' variant='contained' disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <CreateWoodenBaseDialog
        open={'woodenBase' === createCategory}
        onClose={() => setCreateCategory( null )}
        substrateInfo={substrateInfo}
        onCreated={product => handleCreated( 'woodenBase', product )}
      />
      <CreateMirrorGlassDialog
        open={'mirrorGlass' === createCategory}
        onClose={() => setCreateCategory( null )}
        substrateInfo={substrateInfo}
        outsideContour={outsideContour}
        onCreated={product => handleCreated( 'mirrorGlass', product )}
      />
    </>
  )
}
