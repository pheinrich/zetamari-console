'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { build } from '@/libs/mirror'

import { DEFAULT_SETTINGS } from './mirrorSettings'
import { resolveSubstrateInfo } from './resolveSubstrateInfo'
import { encodeEntry, encodeEntryList } from './urlCodec'
import CopyFromMenu from './CopyFromMenu'
import EditableLabel from './EditableLabel'
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

// The calculator: one working panel (editable label, live preview,
// dimensions, stats) plus a lightbox strip of saved snapshots below it,
// and a sortable comparison table below that. Replaces the earlier
// side-by-side multi-panel board - comparison now happens by clicking
// between saved thumbnails (or comparison table rows) rather than
// viewing many panels at once.
//
// `initialState` comes from urlCodec's decodeInitialState(): {current,
// gallery, pinned}, already fully resolved (contour ids + label, not a
// productId) from whichever of the current/legacy query params was
// present - this component no longer resolves anything against a
// product at mount time; "Copy From..." (below) is the only place a
// product's stored values get pulled in, and only as a one-shot copy.
export default function MirrorCalculator( {initialState, contours, substrateProducts} )
{
  const [substrateInfo, setSubstrateInfoState] = useState( () => ({
    outsideId: initialState.current.outsideId,
    insideId: initialState.current.insideId,
    rabbetId: initialState.current.rabbetId,
    width: initialState.current.width,
    height: initialState.current.height,
    border: initialState.current.border,
  }) )
  const [label, setLabel] = useState( initialState.current.label ?? '' )
  const [settings, setSettings] = useState( initialState.current.settings ?? DEFAULT_SETTINGS )
  const [pinned, setPinned] = useState( initialState.pinned ?? false )

  const [gallery, setGallery] = useState( () => initialState.gallery.map( (e, i) => ({...e, id: `g-${i}`}) ) )
  const nextGalleryIdRef = useRef( initialState.gallery.length )
  const [selectedId, setSelectedId] = useState( null )

  const [saveOpen, setSaveOpen] = useState( false )
  const [menuAnchor, setMenuAnchor] = useState( null )

  const imageRef = useRef( null )

  // Dimensions edits live-update the selected lightbox entry (if any)
  // rather than clearing the selection - adjusting a saved prototype's
  // size/border is treated as refining that same entry, not starting a
  // new one.
  function setSubstrateInfo( next )
  {
    setSubstrateInfoState( next )
    if( selectedId )
      updateSelectedEntry( {width: next.width, height: next.height, border: next.border} )
  }

  // Renaming the label live-updates the selected entry too, same as any
  // other working-panel edit.
  function setEntryLabel( next )
  {
    setLabel( next )
    if( selectedId )
      updateSelectedEntry( {label: next} )
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

  // Loads a lightbox entry into the working panel. Shape/dimensions/label
  // always come from the entry; view settings (toggles/zoom) only come
  // from the entry when settings aren't pinned - pinning is exactly the
  // escape hatch for "keep looking at these settings no matter which
  // entry I click". Also used when a comparison table row's name is
  // clicked (see handleSelectFromTable below) - clicking a name is meant
  // to behave exactly like clicking the matching thumbnail.
  function loadEntry( entry )
  {
    setSubstrateInfoState( {
      outsideId: entry.outsideId,
      insideId: entry.insideId,
      rabbetId: entry.rabbetId,
      width: entry.width,
      height: entry.height,
      border: entry.border,
    } )
    setLabel( entry.label ?? '' )
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

  // Applies a full reordering - used by the comparison table's column
  // sort, as opposed to reorderGallery's single drag move above. Reuses
  // the same `gallery` state the lightbox strip and every comparison
  // section already derive from, so sorting by any stat reorders all of
  // them together.
  function applyGalleryOrder( orderedIds )
  {
    setGallery( prev => {
      const byId = new Map( prev.map( e => [e.id, e] ) )
      return orderedIds.map( id => byId.get( id ) ).filter( Boolean )
    })
  }

  // Clicking a name in the comparison table selects that entry exactly as
  // if its lightbox thumbnail had been clicked directly.
  function handleSelectFromTable( id )
  {
    const entry = gallery.find( e => e.id === id )
    if( entry )
      loadEntry( entry )
  }

  function handleAddToLightbox()
  {
    const id = `g-${nextGalleryIdRef.current}`
    nextGalleryIdRef.current += 1

    const entry = {
      id,
      label: label || 'Blank Shape',
      outsideId: substrateInfo.outsideId,
      insideId: substrateInfo.insideId,
      rabbetId: substrateInfo.rabbetId,
      width: substrateInfo.width,
      height: substrateInfo.height,
      border: substrateInfo.border,
      settings,
    }

    setGallery( prev => [...prev, entry] )
    setSelectedId( id )
  }

  // "Copy From..." replaces both the old Prototype dropdown and the
  // Revert-to-Prototype-Dimensions menu item: picking a product always
  // initializes dimensions/contours/label fresh from it, live-updating
  // the selected entry the same way any other working-panel edit does -
  // so re-picking the same product later is how you "revert" after
  // drifting from it, without keeping any ongoing live link to maintain.
  function handleCopyFrom( product )
  {
    const next = resolveSubstrateInfo( {}, product, contours )

    setSubstrateInfoState( next )
    setLabel( product.name )
    if( selectedId )
    {
      updateSelectedEntry( {
        outsideId: next.outsideId,
        insideId: next.insideId,
        rabbetId: next.rabbetId,
        width: next.width,
        height: next.height,
        border: next.border,
        label: product.name,
      } )
    }
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
      url.searchParams.set( 'current', encodeEntry( {...substrateInfo, label, settings} ) )

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
  }, [substrateInfo, label, settings, gallery, pinned] )

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
        title={<EditableLabel value={label} onChange={setEntryLabel} />}
        action={
          <Stack direction='row' spacing={2}>
            <CopyFromMenu substrateProducts={substrateProducts} onSelect={handleCopyFrom} />
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
              <Divider />
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
            <Tooltip title='Remove all lightbox entries'>
              <span>
                <IconButton size='small' onClick={clearLightbox} disabled={0 === gallery.length}>
                  <i className='ri-delete-bin-line' />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          {1 < gallery.length && (
            <Typography variant='body2' color='text.secondary' className='mbe-2'>
              Drag a thumbnail to reorder the lightbox.
            </Typography>
          )}
          <LightboxStrip
            gallery={gallery}
            contours={contours}
            selectedId={selectedId}
            onSelect={loadEntry}
            onRemove={removeFromLightbox}
            onReorder={reorderGallery}
          />
        </div>

        <ComparisonTable
          gallery={gallery}
          contours={contours}
          selectedId={selectedId}
          onSelectEntry={handleSelectFromTable}
          onReorder={applyGalleryOrder}
        />
      </CardContent>

      <SaveAsProductDialog open={saveOpen} onClose={() => setSaveOpen( false )} substrateInfo={substrateInfo} />
    </Card>
  )
}
