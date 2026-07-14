'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Shape names following a "Base (Variant)" convention (e.g. "Cora
// (Large)", "Mandala (Starlight, Mini)" - see the
// 20260715010000-rename-mandala-shape-types.js migration) get nested
// under a "Base" submenu with just the Variant as the leaf label, so the
// top level doesn't end up with one entry per size/flavor of the same
// shape family. Only applied when 2+ shapes actually share a base - a
// lone "X (Y)" with no siblings stays a single flat entry, since a
// one-item submenu isn't worth the extra click.
const BASE_VARIANT = /^(.+) \((.+)\)$/

function parseBaseVariant( name )
{
  const m = BASE_VARIANT.exec( name )
  return m ? {base: m[1], variant: m[2]} : null
}

// One entry per distinct outside-contour shape (see Contour.js's `shape`
// association / @/db/models/ShapeType), with every substrate product
// that uses it.
function groupByShape( substrateProducts )
{
  const byName = new Map()

  for( const product of substrateProducts )
  {
    const shape = product.substrateInfo?.outside?.shape
    const name = shape?.name || 'Other'

    if( !byName.has( name ) )
      byName.set( name, {name, key: shape?.key ?? null, products: []} )
    byName.get( name ).products.push( product )
  }

  for( const entry of byName.values() )
    entry.products.sort( (a, b) => a.name.localeCompare( b.name ) )

  return [...byName.values()]
}

// Builds the top-level menu items: standalone shapes (type 'shape'), plus
// nested groups (type 'group') for any Base shared by 2+ Variants.
function buildTopItems( shapeEntries )
{
  const byBase = new Map()
  const items = []

  for( const entry of shapeEntries )
  {
    const parsed = parseBaseVariant( entry.name )
    if( !parsed )
    {
      items.push( {type: 'shape', label: entry.name, entry} )
      continue
    }

    if( !byBase.has( parsed.base ) )
      byBase.set( parsed.base, [] )
    byBase.get( parsed.base ).push( {label: parsed.variant, entry} )
  }

  for( const [base, variants] of byBase )
  {
    if( 1 === variants.length )
      items.push( {type: 'shape', label: variants[0].entry.name, entry: variants[0].entry} )
    else
      items.push( {
        type: 'group',
        label: base,
        variants: variants.sort( (a, b) => a.label.localeCompare( b.label ) ),
      } )
  }

  return items
}

// Splits the top-level items into "Basic Shapes" (the parametric shapes
// buildFromType() knows how to draw - always a flat single entry, since
// only custom shapes ever use the Base (Variant) naming convention) and
// "Other Shapes" (everything else - custom svgData shapes, standalone or
// grouped), each alphabetized.
function splitSections( items )
{
  const basic = []
  const other = []

  for( const item of items )
    ('shape' === item.type && item.entry.key ? basic : other).push( item )

  const byLabel = (a, b) => a.label.localeCompare( b.label )
  return [basic.sort( byLabel ), other.sort( byLabel )]
}

// "Copy From..." replaces both the old Prototype dropdown and the
// Revert-to-Prototype-Dimensions menu item: picking a product here always
// initializes the working panel's dimensions/contours/label fresh from
// that product, so re-picking the same product later is how you "revert"
// after drifting from it - there's no ongoing live link to maintain.
// Up to three click-through menu levels (top-level shape/group -> group's
// variants -> products) rather than a hover flyout, to match the app's
// other click-opened menus and work on touch.
export default function CopyFromMenu( {substrateProducts, onSelect} )
{
  const [anchorEl, setAnchorEl] = useState( null )
  const [midAnchorEl, setMidAnchorEl] = useState( null )
  const [openTop, setOpenTop] = useState( null )
  const [subAnchorEl, setSubAnchorEl] = useState( null )
  const [openVariant, setOpenVariant] = useState( null )

  const shapeEntries = groupByShape( substrateProducts )
  const topItems = buildTopItems( shapeEntries )
  const [basicItems, otherItems] = splitSections( topItems )

  function close()
  {
    setAnchorEl( null )
    setMidAnchorEl( null )
    setOpenTop( null )
    setSubAnchorEl( null )
    setOpenVariant( null )
  }

  function pick( product )
  {
    onSelect( product )
    close()
  }

  function openMid( evt, item )
  {
    setMidAnchorEl( evt.currentTarget )
    setOpenTop( item )
    setSubAnchorEl( null )
    setOpenVariant( null )
  }

  function openSub( evt, variant )
  {
    setSubAnchorEl( evt.currentTarget )
    setOpenVariant( variant )
  }

  function renderTopItem( item )
  {
    return (
      <MenuItem key={item.label} selected={openTop?.label === item.label} onClick={evt => openMid( evt, item )}>
        <ListItemText>{item.label}</ListItemText>
        <i className='ri-arrow-right-s-line' />
      </MenuItem>
    )
  }

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        onClick={evt => setAnchorEl( evt.currentTarget )}
        disabled={0 === substrateProducts.length}
        startIcon={<i className='ri-file-copy-line' />}
      >
        Copy From...
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean( anchorEl )} onClose={close}>
        {basicItems.map( renderTopItem )}
        {0 < basicItems.length && 0 < otherItems.length && <Divider key='section-divider' />}
        {otherItems.map( renderTopItem )}
      </Menu>

      {/* Level 2: a standalone shape's products, or a group's size/flavor variants */}
      <Menu
        anchorEl={midAnchorEl}
        open={Boolean( midAnchorEl )}
        onClose={close}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        {'shape' === openTop?.type && openTop.entry.products.map( product => (
          <MenuItem key={product.id} onClick={() => pick( product )}>
            {product.name}
          </MenuItem>
        ) )}
        {'group' === openTop?.type && openTop.variants.map( variant => (
          <MenuItem
            key={variant.label}
            selected={openVariant?.label === variant.label}
            onClick={evt => openSub( evt, variant )}
          >
            <ListItemText>{variant.label}</ListItemText>
            <i className='ri-arrow-right-s-line' />
          </MenuItem>
        ) )}
      </Menu>

      {/* Level 3: a group's variant's products */}
      <Menu
        anchorEl={subAnchorEl}
        open={Boolean( subAnchorEl )}
        onClose={close}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        {openVariant?.entry.products.map( product => (
          <MenuItem key={product.id} onClick={() => pick( product )}>
            {product.name}
          </MenuItem>
        ) )}
      </Menu>
    </>
  )
}
