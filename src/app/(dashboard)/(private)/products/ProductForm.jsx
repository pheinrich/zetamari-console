'use client'

import { redirect } from 'next/navigation'
import { useState } from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { createProduct, updateProduct } from '@/db/actions/product'
import { PRODUCT_TYPE_META } from './ProductTypeMeta'
import { formatCurrency } from './productFormat'
import ProductImagesCard from './ProductImagesCard'

const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().optional()
)

const optionalType = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.enum( ['bead', 'birdhouse', 'frame', 'grout', 'millefiori', 'mirror', 'substrate', 'tile', 'other'] ).optional()
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
  description: z.string().optional(),
  priceWholesale: optionalPositiveNumber,
  priceRetail: optionalPositiveNumber,

  beadInfo: z.object({
    category: z.enum( ['glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other'] ).optional(),
    finish: z.enum( ['fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain'] ).optional(),
    shape: z.enum( ['round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other'] ).optional(),
    color: z.string().min( 1 ),
    length: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber
  }).optional(),

  frameInfo: z.object({
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    channel: optionalPositiveNumber,
    border: optionalPositiveNumber,
    photoWidth: optionalPositiveNumber,
    photoHeight: optionalPositiveNumber,
  }).optional(),

  millefioriInfo: z.object({
    shape: z.enum( ['round', 'square'] ).optional(),
    color: z.string().min( 1 ),
    length: optionalPositiveNumber,
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
  }).optional(),

  mirrorInfo: z.object({
    shape: z.enum( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis', 'other'] ).optional(),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    bevel: optionalPositiveNumber,
  }).optional(),

  substrateInfo: z.object({
    outsideId: z.coerce.number().int(),
    insideId: z.coerce.number().int().optional(),
    rabbetId: z.coerce.number().int().optional(),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    border: optionalPositiveNumber,
  }).optional(),

  tileInfo: z.object({
    color: z.string().min( 1 ),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
  }).optional(),
})

export default function ProductForm( {contourList, initialData={}, costs} )
{
  const isEdit = Boolean( initialData?.id )
  const [type, setType] = useState( initialData?.type || '' )
  const [priceWholesale, setPriceWholesale] = useState( initialData?.priceWholesale || '' )
  const [priceRetail, setPriceRetail] = useState( initialData?.priceRetail || '' )
  const { handleSubmit, loading, errors, success } = useFormSubmit({
    schema,
    onSubmit: isEdit ? updateProduct : createProduct
  })

  if( success )
    redirect( '/products' )

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
                      <TextField fullWidth label='Weight' name='weight' defaultValue={initialData?.weight || ''} />
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

            {type && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title={`${PRODUCT_TYPE_META[type]?.label || 'Type'} Details`} />
                  <CardContent>
                    <Grid container spacing={5}>
                      {type === 'bead' && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='beadInfo-category'>Category</InputLabel>
                              <Select labelId='beadInfo-category' label='Category' name='beadInfo.category' defaultValue={initialData?.beadInfo?.category || 'plastic'}>
                                <MenuItem value='glass'>Glass</MenuItem>
                                <MenuItem value='metal'>Metal</MenuItem>
                                <MenuItem value='plastic'>Plastic</MenuItem>
                                <MenuItem value='ceramic'>Ceramic</MenuItem>
                                <MenuItem value='shell'>Shell</MenuItem>
                                <MenuItem value='rhinestone'>Rhinestone</MenuItem>
                                <MenuItem value='other'>Other</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='beadInfo-finish'>Finish</InputLabel>
                              <Select labelId='beadInfo-finish' label='Finish' name='beadInfo.finish' defaultValue={initialData?.beadInfo?.finish || 'plain'}>
                                <MenuItem value='fire-polished'>Fire-Polished</MenuItem>
                                <MenuItem value='silvered'>Silvered</MenuItem>
                                <MenuItem value='opaque'>Opaque</MenuItem>
                                <MenuItem value='opaque luster'>Opaque Luster</MenuItem>
                                <MenuItem value='transparent'>Transparent</MenuItem>
                                <MenuItem value='aurora borealis'>Aurora Borealis</MenuItem>
                                <MenuItem value='plain'>Plain</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='beadInfo-shape'>Shape</InputLabel>
                              <Select labelId='beadInfo-shape' label='Shape' name='beadInfo.shape' defaultValue={initialData?.beadInfo?.shape || 'round'}>
                                <MenuItem value='round'>Round</MenuItem>
                                <MenuItem value='faceted round'>Faceted Round</MenuItem>
                                <MenuItem value='rondelle'>Rondelle</MenuItem>
                                <MenuItem value='drop'>Drop</MenuItem>
                                <MenuItem value='bicone'>Bicone/Diamond</MenuItem>
                                <MenuItem value='rivoli'>Rivoli</MenuItem>
                                <MenuItem value='chaton'>Chaton</MenuItem>
                                <MenuItem value='other'>Other</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Color' name='beadInfo.color' defaultValue={initialData?.beadInfo?.color || ''} required />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Length' name='beadInfo.length' defaultValue={initialData?.beadInfo?.length || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Height' name='beadInfo.height' defaultValue={initialData?.beadInfo?.height || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Thickness' name='beadInfo.thickness' defaultValue={initialData?.beadInfo?.thickness || ''} />
                          </Grid>
                        </>
                      )}

                      {type === 'frame' && (
                        <>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Width' name='frameInfo.width' defaultValue={initialData?.frameInfo?.width || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Height' name='frameInfo.height' defaultValue={initialData?.frameInfo?.height || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Thickness' name='frameInfo.thickness' defaultValue={initialData?.frameInfo?.thickness || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Channel' name='frameInfo.channel' defaultValue={initialData?.frameInfo?.channel} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Border' name='frameInfo.border' defaultValue={initialData?.frameInfo?.border || '1'} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Photo Width' name='frameInfo.photoWidth' defaultValue={initialData?.frameInfo?.photoWidth || 4} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Photo Height' name='frameInfo.photoHeight' defaultValue={initialData?.frameInfo?.photoHeight || 6} />
                          </Grid>
                        </>
                      )}

                      {type === 'millefiori' && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='millefioriInfo-shape'>Shape</InputLabel>
                              <Select labelId='millefioriInfo-shape' label='Shape' name='millefioriInfo.shape' defaultValue={initialData?.millefioriInfo?.shape || 'round'}>
                                <MenuItem value='round'>Round</MenuItem>
                                <MenuItem value='square'>Square</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth label='Color' name='millefioriInfo.color' defaultValue={initialData?.millefioriInfo?.color || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth label='Length' name='millefioriInfo.length' defaultValue={initialData?.millefioriInfo?.length || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label='Width' name='millefioriInfo.width' defaultValue={initialData?.millefioriInfo?.width || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label='Height' name='millefioriInfo.height' defaultValue={initialData?.millefioriInfo?.height || ''} />
                          </Grid>
                        </>
                      )}

                      {type === 'mirror' && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='mirrorInfo-shape'>Shape</InputLabel>
                              <Select labelId='mirrorInfo-shape' label='Shape' name='mirrorInfo.shape' defaultValue={initialData?.mirrorInfo?.shape || 'circle'}>
                                <MenuItem value='chapel arch'>Chapel Arch</MenuItem>
                                <MenuItem value='circle'>Circle</MenuItem>
                                <MenuItem value='gothic arch'>Gothic Arch</MenuItem>
                                <MenuItem value='oval'>Oval</MenuItem>
                                <MenuItem value='rectangle'>Rectangle</MenuItem>
                                <MenuItem value='square'>Square</MenuItem>
                                <MenuItem value='vesica piscis'>Vesica Piscis</MenuItem>
                                <MenuItem value='other'>Other</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth label='Width' name='mirrorInfo.width' defaultValue={initialData?.mirrorInfo?.width || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth label='Height' name='mirrorInfo.height' defaultValue={initialData?.mirrorInfo?.height || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label='Thickness' name='mirrorInfo.thickness' defaultValue={initialData?.mirrorInfo?.thickness || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label='Bevel' name='mirrorInfo.bevel' defaultValue={initialData?.mirrorInfo?.bevel || 0} />
                          </Grid>
                        </>
                      )}

                      {type === 'substrate' && (
                        <>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth required>
                              <InputLabel id='substrateInfo-outsideId'>Outside Contour</InputLabel>
                              <Select
                                labelId='substrateInfo-outsideId'
                                label='Outside Contour'
                                name='substrateInfo.outsideId'
                                defaultValue={initialData?.substrateInfo?.outsideId || ''}
                              >
                                {contourList.map( (contour) => (
                                  <MenuItem key={`oc-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                                ) )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='substrateInfo-insideId'>Inside Contour</InputLabel>
                              <Select
                                labelId='substrateInfo-insideId'
                                label='Inside Contour'
                                name='substrateInfo.insideId'
                                defaultValue={initialData?.substrateInfo?.insideId || ''}
                              >
                                <MenuItem value=''>None</MenuItem>
                                {contourList.map( (contour) => (
                                  <MenuItem key={`ic-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                                ) )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth>
                              <InputLabel id='substrateInfo-rabbetId'>Rabbet Contour</InputLabel>
                              <Select
                                labelId='substrateInfo-rabbetId'
                                label='Rabbet Contour'
                                name='substrateInfo.rabbetId'
                                defaultValue={initialData?.substrateInfo?.rabbetId || ''}
                              >
                                <MenuItem value=''>None</MenuItem>
                                {contourList.map( (contour) => (
                                  <MenuItem key={`rc-${contour.id}`} value={contour.id}>{contour.name}</MenuItem>
                                ) )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Width' name='substrateInfo.width' defaultValue={initialData?.substrateInfo?.width || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Height' name='substrateInfo.height' defaultValue={initialData?.substrateInfo?.height || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Thickness' name='substrateInfo.thickness' defaultValue={initialData?.substrateInfo?.thickness || '0.455'} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Border' name='substrateInfo.border' defaultValue={initialData?.substrateInfo?.border || '1'} />
                          </Grid>
                        </>
                      )}

                      {type === 'tile' && (
                        <>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Color' name='tileInfo.color' defaultValue={initialData?.tileInfo?.color || ''} required />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Width' name='tileInfo.width' defaultValue={initialData?.tileInfo?.width || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Height' name='tileInfo.height' defaultValue={initialData?.tileInfo?.height || ''} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField fullWidth label='Thickness' name='tileInfo.thickness' defaultValue={initialData?.tileInfo?.thickness || ''} />
                          </Grid>
                        </>
                      )}
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
