'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import NextLink from 'next/link'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createProduct, updateProduct } from '@/db/actions/product'
import { PRODUCT_TYPE_META } from './ProductTypeMeta'
import { INFO_KEY, infoSchemas, optionalPositiveInt, optionalPositiveNumber } from '@/libs/productInfo'
import ProductInfoFields from './ProductInfoFields'
import { formatCurrency } from './productFormat'
import ProductImagesCard from './ProductImagesCard'
import ProductCostBreakdown from './[id]/ProductCostBreakdown'
import tableStyles from '@core/styles/table.module.css'

// Same spinner-hiding treatment used on the Cost Breakdown/BOM editors -
// quantities here are typically several digits past the decimal point.
const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

const optionalType = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.enum( ['bead', 'birdhouse base', 'picture frame', 'grout', 'kit', 'millefiori', 'mirror glass', 'other', 'tile', 'wooden base'] ).optional()
)

const schema = z.object({
  id: optionalPositiveNumber,
  name: z.string().min( 1 ),
  type: optionalType,
  sku: z.string().min( 1 ),
  sellable: z.preprocess( (val) => val === 'on' || val === true, z.boolean() ),
  status: z.enum( ['visible', 'hidden'] ).optional(),
  units: z.string().optional(),
  weight: optionalPositiveNumber,
  shippingWeight: optionalPositiveNumber,
  description: z.string().optional(),
  priceWholesale: optionalPositiveNumber,
  priceRetail: optionalPositiveNumber,

  beadInfo: infoSchemas.beadInfo.optional(),
  pictureFrameInfo: infoSchemas.pictureFrameInfo.optional(),
  millefioriInfo: infoSchemas.millefioriInfo.optional(),
  mirrorGlassInfo: infoSchemas.mirrorGlassInfo.optional(),
  woodenBaseInfo: infoSchemas.woodenBaseInfo.optional(),
  tileInfo: infoSchemas.tileInfo.optional(),
  birdhouseBaseInfo: infoSchemas.birdhouseBaseInfo.optional(),

  // Only ever populated by the Duplicate flow (see duplicateCostRows/
  // dupBomLines below) - a snapshot of another product's cost-breakdown
  // Included checkboxes/quantities and bill-of-materials lines, carried
  // over onto the new product by createProduct in the same transaction
  // as its creation. Absent for a plain Create/Update submission.
  costOverrides: z.array( z.object({
    costFactorId: z.coerce.number().int(),
    enabledOverride: z.preprocess( (val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean() ),
    quantityOverride: z.coerce.number(),
  }) ).optional(),

  bomLines: z.array( z.object({
    materialProductId: z.coerce.number().int(),
    quantity: z.coerce.number(),
    supplierId: optionalPositiveInt,
  }) ).optional(),
})

export default function ProductForm( {contourList, initialData={}, costs, computedWeight, duplicateCostRows, duplicateFromName} )
{
  const router = useRouter()
  const isEdit = Boolean( initialData?.id )
  const isDuplicate = !isEdit && duplicateCostRows?.length > 0
  const [type, setType] = useState( initialData?.type || '' )
  const [priceWholesale, setPriceWholesale] = useState( initialData?.priceWholesale || '' )
  const [priceRetail, setPriceRetail] = useState( initialData?.priceRetail || '' )
  // Controlled the same way priceWholesale/priceRetail are, for the same
  // reason: `weight` stays an independent, manually-entered figure (see
  // Product.js's comment), but computedWeight - the BOM-weight-sum-plus-
  // material-cost-factor-weight figure from productCost.js's
  // computeProductWeight() - gives a "Copy from Computed Weight" button
  // something to fill it from, same as the cost breakdown does for the
  // price fields below.
  const [weight, setWeight] = useState( initialData?.weight || '' )
  // Controlled the same way, and for the same reason as weight above -
  // lifted here (rather than left as an uncontrolled defaultValue on the
  // Wooden Base Details TextField below) so the Cost Breakdown card's
  // Sheet Breakage rows can edit these same two values directly (they're
  // "Quantity" for those two rows - see ProductCostBreakdown.jsx) and
  // have it reflected in the one field that actually gets submitted,
  // rather than maintaining a second, disconnected copy.
  const [piecesPerSheet, setPiecesPerSheet] = useState( initialData?.woodenBaseInfo?.piecesPerSheet ?? '' )
  const [glassPiecesPerSheet, setGlassPiecesPerSheet] = useState( initialData?.woodenBaseInfo?.glassPiecesPerSheet ?? '' )
  // Both only ever seeded once, from the Duplicate flow's snapshot (see
  // products/new/page.jsx) - dupCostRows drives the Included checkboxes/
  // costOverrides.* inputs below, dupBomLines the bill-of-materials
  // lines/bomLines.* inputs. A plain create/edit never touches either.
  const [dupCostRows, setDupCostRows] = useState( () => duplicateCostRows?.map( row => ({...row}) ) ?? [] )
  const [dupBomLines, setDupBomLines] = useState( () => (isDuplicate ? (initialData?.bomLines || []).map( line => ({
    materialProductId: line.materialProductId,
    materialName: line.material?.name,
    materialSku: line.material?.sku,
    units: line.material?.units,
    quantity: line.quantity,
    supplierId: line.supplierId || '',
    supplierName: line.supplier?.name,
  }) ) : []) )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateProduct : createProduct
  })

  function handleToggleDupIncluded( costFactorId, checked )
  {
    setDupCostRows( prev => prev.map( row => row.costFactorId === costFactorId ? {...row, enabled: checked} : row ) )
  }

  function handleDupBomQuantityChange( index, value )
  {
    setDupBomLines( prev => prev.map( (line, i) => i === index ? {...line, quantity: value} : line ) )
  }

  function handleDupBomRemove( index )
  {
    setDupBomLines( prev => prev.filter( (_, i) => i !== index ) )
  }

  // redirect() from next/navigation is meant for Server Components/Server
  // Actions - calling it during a Client Component's render (as this used
  // to) throws NEXT_REDIRECT mid-render, which left the client-side
  // transition half-committed and showed up as a long white-screen hang
  // right after a successful save. router.push() from an effect is the
  // supported Client Component pattern.
  useEffect( () => {
    if( success )
      router.push( isEdit ? `/products/${initialData.id}` : '/products' )
  }, [success, isEdit, initialData?.id, router] )

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>{isEdit ? 'Update' : 'Create'} Product</Typography>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outlined' color='secondary' component={NextLink} href={isEdit ? `/products/${initialData.id}` : '/products'}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </Grid>

        {isEdit && <input type='hidden' name='id' value={initialData?.id} />}

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        {isDuplicate && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='info'>
              Duplicating <strong>{duplicateFromName}</strong> - review the details below, then Create Product. Nothing is saved until you do.
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Product Information' />
                <CardContent>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label='Name' name='name' defaultValue={initialData?.name || ''} required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label='SKU' name='sku' defaultValue={initialData?.sku || ''} required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label='Units' name='units' defaultValue={initialData?.units || 'each'} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className='flex flex-col gap-1'>
                        <TextField fullWidth label='Weight' name='weight' value={weight} onChange={e => setWeight( e.target.value )} />
                        {null != computedWeight && (
                          <div className='flex items-center justify-between gap-2'>
                            <Typography variant='caption' color='text.secondary'>
                              Computed: {computedWeight.toFixed( 3 )}
                            </Typography>
                            <Button type='button' size='small' onClick={() => setWeight( computedWeight.toFixed( 3 ) )}>
                              Copy from Computed Weight
                            </Button>
                          </div>
                        )}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label='Shipping Weight'
                        name='shippingWeight'
                        defaultValue={initialData?.shippingWeight || ''}
                        helperText='Packaging included, if different from Weight above'
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label='Description'
                        name='description'
                        defaultValue={initialData?.description || ''}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {isEdit && costs && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader
                    title='Cost Breakdown'
                    subheader='Per-factor production cost estimate - edit any column to adjust, reset with the close button'
                  />
                  <CardContent>
                    <ProductCostBreakdown
                      productId={initialData?.id}
                      costs={costs}
                      piecesPerSheetEditable={'wooden base' === type}
                      piecesPerSheet={piecesPerSheet}
                      onPiecesPerSheetChange={setPiecesPerSheet}
                      glassPiecesPerSheet={glassPiecesPerSheet}
                      onGlassPiecesPerSheetChange={setGlassPiecesPerSheet}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDuplicate && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader
                    title='Cost Breakdown'
                    subheader={`Copied from ${duplicateFromName} - toggle Included as needed`}
                  />
                  <CardContent>
                    <div className='overflow-x-auto'>
                      <table className={tableStyles.table}>
                        <thead>
                          <tr>
                            <th>Included</th>
                            <th>Factor</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dupCostRows.map( (row, i) => (
                            <tr key={row.costFactorId}>
                              <td>
                                <Checkbox
                                  size='small'
                                  checked={row.enabled}
                                  onChange={e => handleToggleDupIncluded( row.costFactorId, e.target.checked )}
                                />
                                <input type='hidden' name={`costOverrides.${i}.costFactorId`} value={row.costFactorId} />
                                <input type='hidden' name={`costOverrides.${i}.enabledOverride`} value={row.enabled ? 'true' : 'false'} />
                                <input type='hidden' name={`costOverrides.${i}.quantityOverride`} value={row.quantity} />
                              </td>
                              <td>{row.label}</td>
                              <td>{Number( row.quantity ).toFixed( 3 )} {row.unit}</td>
                            </tr>
                          ) )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDuplicate && dupBomLines.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='Bill of Materials' subheader={`Copied from ${duplicateFromName}`} />
                  <CardContent>
                    <div className='overflow-x-auto'>
                      <table className={tableStyles.table}>
                        <thead>
                          <tr>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {dupBomLines.map( (line, i) => (
                            <tr key={line.materialProductId}>
                              <td>
                                {line.materialName}
                                <Typography variant='body2' color='text.secondary'>{line.materialSku}</Typography>
                              </td>
                              <td>
                                <div className='flex items-center gap-2'>
                                  <TextField
                                    type='number'
                                    size='small'
                                    inputProps={{step: '0.0001', min: '0'}}
                                    name={`bomLines.${i}.quantity`}
                                    value={line.quantity}
                                    onChange={e => handleDupBomQuantityChange( i, e.target.value )}
                                    sx={noSpinnerSx}
                                    className='is-24'
                                  />
                                  <Typography variant='body2'>{line.units}</Typography>
                                </div>
                                <input type='hidden' name={`bomLines.${i}.materialProductId`} value={line.materialProductId} />
                                <input type='hidden' name={`bomLines.${i}.supplierId`} value={line.supplierId} />
                              </td>
                              <td>{line.supplierName || 'Cheapest (auto)'}</td>
                              <td>
                                <IconButton size='small' onClick={() => handleDupBomRemove( i )}>
                                  <i className='ri-delete-bin-7-line' />
                                </IconButton>
                              </td>
                            </tr>
                          ) )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {INFO_KEY[type] && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title={`${PRODUCT_TYPE_META[type]?.label || 'Type'} Details`} />
                  <CardContent>
                    <Grid container spacing={5}>
                      <ProductInfoFields
                        type={type}
                        info={initialData?.[INFO_KEY[type]]}
                        contourList={contourList}
                        piecesPerSheet={piecesPerSheet}
                        onPiecesPerSheetChange={setPiecesPerSheet}
                        glassPiecesPerSheet={glassPiecesPerSheet}
                        onGlassPiecesPerSheetChange={setGlassPiecesPerSheet}
                      />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Organize' />
                <CardContent className='flex flex-col gap-5'>
                  <FormControl fullWidth>
                    <InputLabel id='product-type'>Type</InputLabel>
                    <Select
                      labelId='product-type'
                      label='Type'
                      name='type'
                      defaultValue={initialData?.type || ''}
                      onChange={(evt) => setType( evt.target.value )}
                    >
                      <MenuItem value=''>None (finished/assembled product)</MenuItem>
                      {Object.entries( PRODUCT_TYPE_META ).map( ([value, meta]) => (
                        <MenuItem key={value} value={value}>{meta.label}</MenuItem>
                      ) )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id='product-status'>Status</InputLabel>
                    <Select labelId='product-status' label='Status' name='status' defaultValue={initialData?.status || 'visible'}>
                      <MenuItem value='visible'>Visible</MenuItem>
                      <MenuItem value='hidden'>Hidden</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox name='sellable' defaultChecked={initialData?.sellable ?? true} />}
                    label='Sellable directly to customers'
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title='Pricing' />
                <CardContent className='flex flex-col gap-5'>
                  <div className='flex flex-col gap-1'>
                    <TextField
                      fullWidth
                      label='Wholesale Price'
                      name='priceWholesale'
                      value={priceWholesale}
                      onChange={e => setPriceWholesale( e.target.value )}
                    />
                    {costs && (
                      <div className='flex items-center justify-between gap-2'>
                        <Typography variant='caption' color='text.secondary'>
                          Cost breakdown: {formatCurrency( costs.wholesaleTotal )}
                        </Typography>
                        <Button type='button' size='small' onClick={() => setPriceWholesale( costs.wholesaleTotal.toFixed( 2 ) )}>
                          Copy from Cost Breakdown
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <TextField
                      fullWidth
                      label='Retail Price'
                      name='priceRetail'
                      value={priceRetail}
                      onChange={e => setPriceRetail( e.target.value )}
                    />
                    {costs && (
                      <div className='flex items-center justify-between gap-2'>
                        <Typography variant='caption' color='text.secondary'>
                          Cost breakdown: {formatCurrency( costs.retailTotal )}
                        </Typography>
                        <Button type='button' size='small' onClick={() => setPriceRetail( costs.retailTotal.toFixed( 2 ) )}>
                          Copy from Cost Breakdown
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              {isEdit ? (
                <ProductImagesCard productId={initialData.id} images={initialData.images || []} />
              ) : (
                <Card>
                  <CardHeader title='Images' />
                  <CardContent>
                    <Typography color='text.secondary'>Save the product first to attach images.</Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
