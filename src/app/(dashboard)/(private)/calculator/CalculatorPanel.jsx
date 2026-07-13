'use client'

import { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { build } from '@/libs/mirror'

import ParamsPanel from './ParamsPanel'
import MirrorPanel from './MirrorPanel'
import SaveAsProductDialog from './SaveAsProductDialog'

// MirrorPanel's visualization toolbar (four toggle checkboxes, snapshot
// button, zoom slider) is laid out to match the preview's own width, so
// bumping this up is what actually gives those icons breathing room - a
// wider card with a small preview still leaves the toolbar cramped.
const PANEL_PREVIEW_SIZE = 380

// Wider than the preview - the dimensions row (three TextFields plus
// separators) needs more horizontal room than the (roughly square)
// preview + toolbar do.
const PANEL_CARD_WIDTH = 460

// Resolves one panel's full substrateInfo from its spec (a possibly-
// edited productId/width/height/border, see urlCodec.js) plus whichever
// product that productId points at. `overrides` lets a width/height/
// border edit already present in the spec take precedence over the
// product's own stored values; pass {} to force the product's original
// values (used when switching to a different product - see
// handleProductChange below).
function resolveSubstrateInfo( overrides, product, contours )
{
  if( product?.substrateInfo )
  {
    return {
      outsideId: product.substrateInfo.outsideId,
      insideId: product.substrateInfo.insideId ?? undefined,
      rabbetId: product.substrateInfo.rabbetId ?? undefined,
      width: overrides.width ?? product.substrateInfo.width,
      height: overrides.height ?? product.substrateInfo.height,
      border: overrides.border ?? product.substrateInfo.border,
    }
  }

  const defaultContour = contours.find( c => 'circle' === c.shapeType ) || contours.find( c => !c.svgData ) || contours[0]

  return {
    outsideId: defaultContour?.id,
    insideId: undefined,
    rabbetId: undefined,
    width: overrides.width ?? 6,
    height: overrides.height ?? 6,
    border: overrides.border ?? 1,
  }
}

// One comparison panel: product picker, live shape preview, dimensions
// form, and a "Save as New Product" fork action. Owns its own substrateInfo
// state (seeded once from `spec` at mount) and its own memoized mirror, so
// editing one panel never re-renders or recomputes its siblings - each
// CalculatorPanel instance is independent, keyed by spec.id in the parent.
//
// Runs @/libs/mirror's build() (jsts-based geometry) client-side, same
// deliberate exception to keeping jsts out of the client bundle as the
// single-panel calculator this was built from.
export default function CalculatorPanel( {spec, contours, substrateProducts, onChange, onRemove, onResolvedChange, canRemove} )
{
  const [productId, setProductId] = useState( spec.productId ?? '' )
  const [substrateInfo, setSubstrateInfoState] = useState( () =>
    resolveSubstrateInfo( spec, substrateProducts.find( p => p.id === spec.productId ) ?? null, contours )
  )
  const [saveOpen, setSaveOpen] = useState( false )

  function setSubstrateInfo( next )
  {
    setSubstrateInfoState( next )
    onChange( spec.id, {productId: productId || undefined, width: next.width, height: next.height, border: next.border} )
  }

  function handleProductChange( newProductId )
  {
    const product = substrateProducts.find( p => p.id === newProductId )
    const next = resolveSubstrateInfo( {}, product ?? null, contours )

    setProductId( newProductId )
    setSubstrateInfoState( next )
    onChange( spec.id, {productId: newProductId || undefined, width: next.width, height: next.height, border: next.border} )
  }

  const outsideContour = contours.find( c => c.id === substrateInfo.outsideId )
  const insideContour = contours.find( c => c.id === substrateInfo.insideId )
  const rabbetContour = contours.find( c => c.id === substrateInfo.rabbetId )

  const mirror = useMemo( () => {
    if( !outsideContour || (!outsideContour.svgData && !outsideContour.shapeType) )
      return undefined
    if( !substrateInfo.width || !substrateInfo.height )
      return undefined

    try
    {
      return build(
        Number( substrateInfo.width ),
        Number( substrateInfo.height ),
        Number( substrateInfo.border ) || 0,
        outsideContour.shapeType,
        outsideContour.svgData,
        insideContour?.svgData,
        rabbetContour?.svgData,
      )
    }
    catch( err )
    {
      return undefined
    }
  }, [substrateInfo, outsideContour, insideContour, rabbetContour] )

  const label = substrateProducts.find( p => p.id === productId )?.name || 'Blank Shape'

  // Reports this panel's current mirror up to the board (MirrorCalculator)
  // so the shared ComparisonTable can list every open panel's numbers side
  // by side. onResolvedChange is a stable (useCallback'd) reference from
  // the board, so this only actually refires when mirror/label change.
  useEffect( () => {
    onResolvedChange( spec.id, {label, mirror} )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirror, label] )

  return (
    <Card variant='outlined' style={{width: PANEL_CARD_WIDTH}}>
      <CardHeader
        title={
          <FormControl fullWidth size='small'>
            <InputLabel id={`panel-product-${spec.id}`}>Product</InputLabel>
            <Select
              labelId={`panel-product-${spec.id}`}
              label='Product'
              value={productId}
              onChange={e => handleProductChange( e.target.value )}
            >
              <MenuItem value=''>— Blank Shape —</MenuItem>
              {substrateProducts.map( p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ) )}
            </Select>
          </FormControl>
        }
        action={
          <Tooltip title={canRemove ? 'Remove this panel' : 'At least one panel is required'}>
            <span>
              <IconButton onClick={() => onRemove( spec.id )} disabled={!canRemove}>
                <i className='ri-close-line' />
              </IconButton>
            </span>
          </Tooltip>
        }
      />
      <CardContent className='flex flex-col items-center gap-4'>
        {!mirror ? (
          <Typography>Loading...</Typography>
        ) : (
          <MirrorPanel mirror={mirror} size={PANEL_PREVIEW_SIZE} />
        )}

        <ParamsPanel substrateInfo={substrateInfo} setSubstrateInfo={setSubstrateInfo} contours={contours} />

        <Button variant='outlined' size='small' onClick={() => setSaveOpen( true )} startIcon={<i className='ri-add-line' />}>
          Save as New Product
        </Button>
      </CardContent>

      <SaveAsProductDialog open={saveOpen} onClose={() => setSaveOpen( false )} substrateInfo={substrateInfo} />
    </Card>
  )
}
