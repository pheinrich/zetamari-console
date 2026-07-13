'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { build } from '@/libs/mirror'

import { DEFAULT_SETTINGS } from './mirrorSettings'
import { resolveSubstrateInfo } from './resolveSubstrateInfo'
import { encodeEntry, encodeEntryList } from './urlCodec'
import ParamsPanel from './ParamsPanel'
import MirrorPanel from './MirrorPanel'
import StatsSummary from './StatsSummary'
import LightboxStrip from './LightboxStrip'
import SaveAsProductDialog from './SaveAsProductDialog'

const MAIN_PREVIEW_SIZE = 460

// The calculator: one working panel (product picker, live preview,
// dimensions, stats) plus a lightbox strip of saved snapshots below it.
// Replaces the earlier side-by-side multi-panel board - comparison now
// happens by clicking between saved thumbnails rather than viewing many
// panels at once.
//
// `initialState` comes from urlCodec's decodeInitialState(): {current,
// gallery, pinned}, already resolved from whichever of the current/
// legacy query params was present.
export default function MirrorCalculator( {initialState, contours, substrateProducts} )
{
  const [productId, setProductId] = useState( initialState.current.productId ?? '' )
  const [substrateInfo, setSubstrateInfoState] = useState( () =>
    resolveSubstrateInfo(
      {width: initialState.current.width, height: initialState.current.height, border: initialState.current.border},
      substrateProducts.find( p => p.id === initialState.current.productId ) ?? null,
      contours
    )
  )
  const [settings, setSettings] = useState( initialState.current.settings ?? DEFAULT_SETTINGS )
  const [pinned, setPinned] = useState( initialState.pinned ?? false )

  const [gallery, setGallery] = useState( () => initialState.gallery.map( (e, i) => ({...e, id: `g-${i}`}) ) )
  const nextGalleryIdRef = useRef( initialState.gallery.length )
  const [selectedId, setSelectedId] = useState( null )

  const [saveOpen, setSaveOpen] = useState( false )
  const [menuAnchor, setMenuAnchor] = useState( null )

  const imageRef = useRef( null )

  function handleProductChange( newProductId )
  {
    const product = substrateProducts.find( p => p.id === newProductId )
    const next = resolveSubstrateInfo( {}, product ?? null, contours )

    setProductId( newProductId )
    setSubstrateInfoState( next )
    setSelectedId( null )
  }

  function setSubstrateInfo( next )
  {
    setSubstrateInfoState( next )
    setSelectedId( null )
  }

  // Loads a lightbox entry into the working panel. Shape/dimensions
  // always come from the entry; view settings (toggles/zoom) only come
  // from the entry when settings aren't pinned - pinning is exactly the
  // escape hatch for "keep looking at these settings no matter which
  // entry I click".
  function loadEntry( entry )
  {
    const product = substrateProducts.find( p => p.id === entry.productId ) ?? null
    const next = resolveSubstrateInfo( {width: entry.width, height: entry.height, border: entry.border}, product, contours )

    setProductId( entry.productId ?? '' )
    setSubstrateInfoState( next )
    if( !pinned )
      setSettings( entry.settings ?? DEFAULT_SETTINGS )
    setSelectedId( entry.id )
  }

  function removeFromLightbox( id )
  {
    setGallery( prev => prev.filter( e => e.id !== id ) )
    setSelectedId( prev => (prev === id ? null : prev) )
  }

  function reorderGallery( fromId, toId )
  {
    setGallery( prev => {
      if( !fromId || fromId === toId )
        return prev

      const from = prev.findIndex( e => e.id === fromId )
      const to = prev.findIndex( e => e.id === toId )
      if( -1 === from || -1 === to )
        return prev

      const next = [...prev]
      const [moved] = next.splice( from, 1 )
      next.splice( to, 0, moved )
      return next
    })
  }

  function handleAddToLightbox()
  {
    const id = `g-${nextGalleryIdRef.current}`
    nextGalleryIdRef.current += 1

    const entry = {
      id,
      productId: productId || undefined,
      width: substrateInfo.width,
      height: substrateInfo.height,
      border: substrateInfo.border,
      settings,
    }

    setGallery( prev => [...prev, entry] )
    setSelectedId( id )
    setMenuAnchor( null )
  }

  function handleTogglePinned()
  {
    setPinned( p => !p )
    setMenuAnchor( null )
  }

  function handleSaveAsProduct()
  {
    setSaveOpen( true )
    setMenuAnchor( null )
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

  // Keeps the working panel + gallery + pinned flag in sync with the URL
  // for bookmarking/sharing. Uses the raw History API rather than
  // router.replace() deliberately - the latter would re-run this page's
  // Server Component and, since it's keyed on the search params (see
  // page.jsx), remount this whole component on every edit.
  useEffect( () => {
    const url = new URL( window.location.href )

    url.searchParams.delete( 'productId' )
    url.searchParams.delete( 'panels' )
    url.searchParams.set( 'current', encodeEntry( {productId, width: substrateInfo.width, height: substrateInfo.height, border: substrateInfo.border, settings} ) )

    const galleryEncoded = encodeEntryList( gallery )
    if( galleryEncoded )
      url.searchParams.set( 'gallery', galleryEncoded )
    else
      url.searchParams.delete( 'gallery' )

    if( pinned )
      url.searchParams.set( 'pinned', '1' )
    else
      url.searchParams.delete( 'pinned' )

    window.history.replaceState( null, '', url.toString() )
  }, [productId, substrateInfo, settings, gallery, pinned] )

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
        title={
          <FormControl size='small' style={{minWidth: 260}}>
            <InputLabel id='calculator-prototype'>Prototype</InputLabel>
            <Select
              labelId='calculator-prototype'
              label='Prototype'
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
          <>
            <IconButton onClick={evt => setMenuAnchor( evt.currentTarget )}>
              <i className='ri-more-2-fill' />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean( menuAnchor )} onClose={() => setMenuAnchor( null )}>
              <MenuItem onClick={handleAddToLightbox} disabled={!mirror}>
                <ListItemIcon><i className='ri-gallery-line' /></ListItemIcon>
                <ListItemText>Add to Lightbox</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleTogglePinned}>
                <ListItemIcon><i className={pinned ? 'ri-pushpin-2-fill' : 'ri-pushpin-2-line'} /></ListItemIcon>
                <ListItemText>{pinned ? 'Unpin Settings' : 'Pin Settings'}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleSaveAsProduct} disabled={!mirror}>
                <ListItemIcon><i className='ri-save-line' /></ListItemIcon>
                <ListItemText>Save as New Product</ListItemText>
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent className='flex flex-col gap-6'>
        {!mirror ? (
          <Typography>Loading...</Typography>
        ) : (
          <Stack direction={{xs: 'column', lg: 'row'}} gap={6}>
            <div>
              <MirrorPanel mirror={mirror} settings={settings} onSettingsChange={setSettings} imageRef={imageRef} size={MAIN_PREVIEW_SIZE} />
              {pinned && (
                <Chip
                  className='mbs-2'
                  size='small'
                  color='primary'
                  variant='outlined'
                  icon={<i className='ri-pushpin-2-fill' />}
                  label='Settings pinned - unaffected by lightbox selection'
                />
              )}
            </div>
            <Stack flex={1} minWidth={0} gap={6}>
              <ParamsPanel substrateInfo={substrateInfo} setSubstrateInfo={setSubstrateInfo} contours={contours} />
              <Divider />
              <StatsSummary mirror={mirror} />
            </Stack>
          </Stack>
        )}

        <Divider />

        <div>
          <Typography variant='subtitle1' className='mbe-2'>Lightbox</Typography>
          <LightboxStrip
            gallery={gallery}
            contours={contours}
            substrateProducts={substrateProducts}
            selectedId={selectedId}
            onSelect={loadEntry}
            onRemove={removeFromLightbox}
            onReorder={reorderGallery}
          />
        </div>
      </CardContent>

      <SaveAsProductDialog open={saveOpen} onClose={() => setSaveOpen( false )} substrateInfo={substrateInfo} />
    </Card>
  )
}
