'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'

import Button from '@mui/material/Button'
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
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { build } from '@/libs/mirror'

import { DEFAULT_SETTINGS } from './mirrorSettings'
import { resolveSubstrateInfo } from './resolveSubstrateInfo'
import { encodeEntry, encodeEntryList } from './urlCodec'
import ParamsPanel from './ParamsPanel'
import MirrorPanel from './MirrorPanel'
import StatsSummary from './StatsSummary'
import LightboxStrip from './LightboxStrip'
import ComparisonTable from './ComparisonTable'
import SaveAsProductDialog from './SaveAsProductDialog'

const MAIN_PREVIEW_SIZE = 460

function settingsEqual( a, b )
{
  return a.showBack === b.showBack && a.showDims === b.showDims && a.showGlass === b.showGlass && a.zoom === b.zoom
}

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

  // Dimensions edits live-update the selected lightbox entry (if any)
  // rather than clearing the selection - adjusting a saved prototype's
  // size/border is treated as refining that same entry, not starting a
  // new one. (Switching to a different product, below, is still treated
  // as a big enough jump to drop the selection instead.)
  function setSubstrateInfo( next )
  {
    setSubstrateInfoState( next )
    if( selectedId )
      updateSelectedEntry( {width: next.width, height: next.height, border: next.border} )
  }

  // Settings/zoom edits also live-update the selected entry - unless
  // pinned, in which case pinning has explicitly decoupled the working
  // panel's settings from any one entry, so they shouldn't get written
  // back into it.
  function handleSettingsChange( next )
  {
    setSettings( next )
    if( !pinned && selectedId )
      updateSelectedEntry( {settings: next} )
  }

  function updateSelectedEntry( patch )
  {
    setGallery( prev => prev.map( e => (e.id === selectedId ? {...e, ...patch} : e) ) )
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

  function clearLightbox()
  {
    if( 0 === gallery.length )
      return
    if( !window.confirm( `Remove all ${gallery.length} saved prototype${1 === gallery.length ? '' : 's'} from the lightbox? This can't be undone.` ) )
      return

    setGallery( [] )
    setSelectedId( null )
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
    const nextPinned = !pinned

    // Unpinning hands control of the view settings back to whichever
    // entry is selected. Without this, the display would keep showing
    // the (no-longer-pinned) override until the next thumbnail click,
    // silently pretending to be unpinned while still looking pinned.
    if( !nextPinned && selectedId )
    {
      const entry = gallery.find( e => e.id === selectedId )
      if( entry?.settings && !settingsEqual( entry.settings, settings ) )
        setSettings( entry.settings )
    }

    setPinned( nextPinned )
    setMenuAnchor( null )
  }

  function handleSaveAsProduct()
  {
    setSaveOpen( true )
    setMenuAnchor( null )
  }

  const selectedProduct = substrateProducts.find( p => p.id === productId ) ?? null
  const canRevert = Boolean( selectedProduct?.substrateInfo ) && (
    substrateInfo.width !== selectedProduct.substrateInfo.width
    || substrateInfo.height !== selectedProduct.substrateInfo.height
    || substrateInfo.border !== selectedProduct.substrateInfo.border
  )

  // Discards local width/height/border edits, restoring the values
  // actually saved on the tied product. Reuses setSubstrateInfo so this
  // also live-updates the selected lightbox entry, same as any other
  // dimensions edit.
  function handleRevert()
  {
    if( !selectedProduct?.substrateInfo )
      return

    setSubstrateInfo( resolveSubstrateInfo( {}, selectedProduct, contours ) )
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
  //
  // Debounced: MirrorToolbar's zoom Slider uses onChange (fires on every
  // tick of a drag, not just on release), and when a lightbox entry is
  // selected each tick also patches `gallery` via handleSettingsChange.
  // Calling replaceState() synchronously on every tick blew past the
  // browser's ~100-calls-per-10-seconds throttle ("Attempt to use
  // history.replaceState() more than 100 times per 10 seconds"). Waiting
  // for a short pause in changes keeps the URL synced without calling
  // replaceState() on every drag tick.
  useEffect( () => {
    const timeoutId = setTimeout( () => {
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
    }, 300 )

    return () => clearTimeout( timeoutId )
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
          <Stack direction='row' spacing={2}>
            <Button
              variant='outlined'
              size='small'
              onClick={handleAddToLightbox}
              disabled={!mirror}
              startIcon={<i className='ri-gallery-line' />}
            >
              Add to Lightbox
            </Button>
            <IconButton onClick={evt => setMenuAnchor( evt.currentTarget )}>
              <i className='ri-more-2-fill' />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean( menuAnchor )} onClose={() => setMenuAnchor( null )}>
              <MenuItem onClick={handleTogglePinned}>
                <ListItemIcon><i className={pinned ? 'ri-pushpin-2-fill' : 'ri-pushpin-2-line'} /></ListItemIcon>
                <ListItemText>{pinned ? 'Unpin Settings' : 'Pin Settings'}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleRevert} disabled={!canRevert}>
                <ListItemIcon><i className='ri-arrow-go-back-line' /></ListItemIcon>
                <ListItemText>Revert to Prototype Dimensions</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                component={NextLink}
                href={{
                  pathname: '/calculator/report',
                  query: {current: encodeEntry( {productId, width: substrateInfo.width, height: substrateInfo.height, border: substrateInfo.border, settings} )},
                }}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => setMenuAnchor( null )}
                disabled={!mirror}
              >
                <ListItemIcon><i className='ri-printer-line' /></ListItemIcon>
                <ListItemText>Print Report</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSaveAsProduct} disabled={!mirror}>
                <ListItemIcon><i className='ri-save-line' /></ListItemIcon>
                <ListItemText>Save as New Product</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        }
      />
      <CardContent className='flex flex-col gap-6'>
        {!mirror ? (
          <Typography>Loading...</Typography>
        ) : (
          <Stack direction={{xs: 'column', lg: 'row'}} gap={6}>
            <div>
              <MirrorPanel mirror={mirror} settings={settings} onSettingsChange={handleSettingsChange} imageRef={imageRef} size={MAIN_PREVIEW_SIZE} />
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
          <Stack direction='row' alignItems='center' justifyContent='space-between' className='mbe-2'>
            <Typography variant='subtitle1'>Lightbox</Typography>
            <Stack direction='row'>
              <Tooltip title={0 === gallery.length ? 'Add prototypes to the lightbox first' : 'Print a report of the lightbox'}>
                <span>
                  <IconButton
                    component={NextLink}
                    href={{pathname: '/calculator/report/lightbox', query: {gallery: encodeEntryList( gallery )}}}
                    target='_blank'
                    rel='noopener noreferrer'
                    size='small'
                    disabled={0 === gallery.length}
                  >
                    <i className='ri-printer-line' />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title='Remove all lightbox entries'>
                <span>
                  <IconButton size='small' onClick={clearLightbox} disabled={0 === gallery.length}>
                    <i className='ri-delete-bin-line' />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
          {1 < gallery.length && (
            <Typography variant='body2' color='text.secondary' className='mbe-2'>
              Drag a thumbnail to reorder the lightbox.
            </Typography>
          )}
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

        <ComparisonTable gallery={gallery} contours={contours} substrateProducts={substrateProducts} />
      </CardContent>

      <SaveAsProductDialog open={saveOpen} onClose={() => setSaveOpen( false )} substrateInfo={substrateInfo} />
    </Card>
  )
}
