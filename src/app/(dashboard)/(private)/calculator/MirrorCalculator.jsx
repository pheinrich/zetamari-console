'use client'

import { useMemo, useState } from 'react'
import NextLink from 'next/link'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import { build } from '@/libs/mirror'

import ParamsPanel from './ParamsPanel'
import MirrorPanel from './MirrorPanel'
import CollapseArea from './CollapseArea'
import CollapseCost from './CollapseCost'
import CollapseWeight from './CollapseWeight'
import SaveAsProductDialog from './SaveAsProductDialog'

function a11yProps( index )
{
  return {
    id: `calculator-tab-${index}`,
    'aria-controls': `calculator-tabpanel-${index}`,
  }
}

function CalculatorTabPanel( {children, value, index} )
{
  if( value !== index )
    return null

  return (
    <div role='tabpanel' id={`calculator-tabpanel-${index}`} aria-labelledby={`calculator-tab-${index}`}>
      <Box sx={{ pt: 5 }}>{children}</Box>
    </div>
  )
}

function defaultSubstrateInfo( contours )
{
  const contour = contours.find( c => 'circle' === c.shapeType ) || contours.find( c => !c.svgData ) || contours[0]

  return {
    outsideId: contour?.id,
    insideId: undefined,
    rabbetId: undefined,
    width: 6,
    height: 6,
    border: 1,
  }
}

// This runs @/libs/mirror's build() (jsts-based geometry) client-side,
// unlike the rest of the app which deliberately keeps jsts out of the
// client bundle by precomputing thumbnails server-side. The calculator is
// the one place that genuinely needs live recomputation as the user drags
// sliders/edits dimensions, so that tradeoff is made deliberately here.
export default function MirrorCalculator( {initialProduct, contours, substrateProducts} )
{
  const [tab, setTab] = useState( 0 )
  const [saveOpen, setSaveOpen] = useState( false )
  const [substrateInfo, setSubstrateInfo] = useState( () =>
    initialProduct?.substrateInfo
      ? {
        outsideId: initialProduct.substrateInfo.outsideId,
        insideId: initialProduct.substrateInfo.insideId ?? undefined,
        rabbetId: initialProduct.substrateInfo.rabbetId ?? undefined,
        width: initialProduct.substrateInfo.width,
        height: initialProduct.substrateInfo.height,
        border: initialProduct.substrateInfo.border,
      }
      : defaultSubstrateInfo( contours )
  )

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

  if( 0 === contours.length )
  {
    return (
      <Card>
        <CardContent>
          <Typography>
            No contours exist yet. <NextLink href='/contours/new'>Create one</NextLink> (a basic circle/oval/
            rectangle/etc is enough to get started) before using the calculator.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title={initialProduct ? `Calculator — ${initialProduct.name}` : 'Mirror Calculator'}
        action={
          <Button variant='contained' onClick={() => setSaveOpen( true )} startIcon={<i className='ri-add-line' />}>
            Save as New Product
          </Button>
        }
      />
      <CardContent>
        <Stack spacing={5}>
          {initialProduct && (
            <Alert severity='info'>
              Exploring <NextLink href={`/products/${initialProduct.id}`}>{initialProduct.name}</NextLink> ({initialProduct.sku}).
              Changes here are local to this page and aren&rsquo;t saved back to the product automatically.
            </Alert>
          )}

          {!mirror ? (
            <Typography>Loading...</Typography>
          ) : (
            <Stack direction={{xs: 'column', lg: 'row'}} justifyContent='space-between' gap={6}>
              <MirrorPanel mirror={mirror} />
              <Box flex={1} minWidth={0}>
                <Tabs value={tab} onChange={(evt, val) => setTab( val )}>
                  <Tab label='Dimensions' {...a11yProps( 0 )} />
                  <Tab label='Materials' {...a11yProps( 1 )} />
                  <Tab label='Rates' {...a11yProps( 2 )} />
                </Tabs>

                <CalculatorTabPanel value={tab} index={0}>
                  <ParamsPanel
                    substrateInfo={substrateInfo}
                    setSubstrateInfo={setSubstrateInfo}
                    contours={contours}
                    substrateProducts={substrateProducts}
                    initialProduct={initialProduct}
                  />
                  <Card sx={{ mt: 8 }} variant='outlined'>
                    <CardContent>
                      <CollapseArea mirror={mirror} />
                      <CollapseWeight mirror={mirror} />
                      <CollapseCost mirror={mirror} />
                    </CardContent>
                  </Card>
                </CalculatorTabPanel>
                <CalculatorTabPanel value={tab} index={1}>
                  <Typography color='text.secondary'>Materials breakdown isn&rsquo;t built yet.</Typography>
                </CalculatorTabPanel>
                <CalculatorTabPanel value={tab} index={2}>
                  <Typography color='text.secondary'>Rate configuration isn&rsquo;t built yet.</Typography>
                </CalculatorTabPanel>
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <SaveAsProductDialog open={saveOpen} onClose={() => setSaveOpen( false )} substrateInfo={substrateInfo} />
    </Card>
  )
}
