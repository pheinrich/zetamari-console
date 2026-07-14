'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Shape names following a "Base (Variant)" convention (e.g. "Cora
// (Large)", "Mandala (Starlight) (Mini)" - see the
// 20260715020000-split-mandala-starlight.js migration) get nested under
// a "Base" submenu, so the top level doesn't end up with one entry per
// size of the same shape family.
//
// Only applied when the Variant is a recognized SIZE word - "Cora
// (Large)" groups under "Cora", but "Mandala (Avens)" is its own
// standalone family, not a "Mandala" group with an "Avens" variant, even
// though it matches the same "X (Y)" shape. A shape's Base can itself
// carry its own parenthetical ("Mandala (Starlight) (Mini)" - the
// (greedy) regex below captures the LAST "(...)" as Variant, so this
// parses as Base "Mandala (Starlight)", Variant "Mini"), which is how
// Starlight's own size variants group separately from Avens/Planet/Sonora.
const BASE_VARIANT = /^(.+) \((.+)\)$/
const SIZE_WORDS = new Set( ['Mini', 'Small', 'Medium', 'Large'] )

function parseBaseVariant( name )
{
  const m = BASE_VARIANT.exec( name )
  if( !m || !SIZE_WORDS.has( m[2] ) )
    return null
  return {base: m[1], variant: m[2]}
}

// The "family" name used for a copied product's working-panel label -
// the Base for a grouped shape ("Cora (Large)" -> "Cora"), or the shape's
// own name unchanged if it doesn't follow the Base (Variant) convention
// ("Circle", "Willow Leaf", "Mandala (Avens)"). Computed straight from
// the shape name rather than from menu/grouping state, so it comes out
// the same regardless of how the menu happens to list that product.
function familyNameFor( shapeName )
{
  return parseBaseVariant( shapeName )?.base ?? shapeName
}

// Products are identified by dimensions alone in this menu (the shape
// context is already established by the menu path to get there) - falls
// back to the product's own name if dimensions are somehow missing.
function dimensionLabel( product )
{
  const w = product.substrateInfo?.width
  const h = product.substrateInfo?.height
  return (w && h) ? `${Number( w )}"x${Number( h )}"` : product.name
}

// Numeric sort by dimensions (width, then height) rather than
// alphabetically by product name - leaves are displayed as dimensions in
// this menu, and string sort would put '10"x10"' before '7"x7"'.
function byDimensions( a, b )
{
  const wa = Number( a.substrateInfo?.width ) || 0
  const wb = Number( b.substrateInfo?.width ) || 0
  if( wa !== wb )
    return wa - wb
  return (Number( a.substrateInfo?.height ) || 0) - (Number( b.substrateInfo?.height ) || 0)
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
    entry.products.sort( byDimensions )

  return [...byName.values()]
}

// Builds the top-level menu items: standalone shapes (type 'shape'), plus
// nested groups (type 'group') for any Base shared by 2+ Variants. A
// group's own products are every product across every one of its size
// variants, flattened into one dimension-sorted list - there's no
// further submenu per size, just the group's full size range in one
// place (e.g. Mandala (Starlight)'s Mini/Small/Medium/Large all appear
// directly under "Mandala (Starlight)").
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
    byBase.get( parsed.base ).push( entry )
  }

  for( const [base, entries] of byBase )
  {
    if( 1 === entries.length )
    {
      items.push( {type: 'shape', label: entries[0].name, entry: entries[0]} )
      continue
    }

    const products = entries.flatMap( e => e.products ).sort( byDimensions )
    items.push( {type: 'group', label: base, products} )
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
// Two menu levels (top-level shape/group -> that shape's products); the
// top-level Button is click-opened, and the level-2 submenu opens on
// hover, like a flyout menu - only picking a leaf product is a click.
// `onSelect(product, label)` - the label is dimensions + family name
// (e.g. '30"x33" Leaf'), computed here since the Base (Variant) parsing
// this depends on lives in this file.
export default function CopyFromMenu( {substrateProducts, onSelect} )
{
  const [anchorEl, setAnchorEl] = useState( null )
  const [midAnchorEl, setMidAnchorEl] = useState( null )
  const [openTop, setOpenTop] = useState( null )

  const shapeEntries = groupByShape( substrateProducts )
  const topItems = buildTopItems( shapeEntries )
  const [basicItems, otherItems] = splitSections( topItems )

  function close()
  {
    setAnchorEl( null )
    setMidAnchorEl( null )
    setOpenTop( null )
  }

  function pick( product )
  {
    const shapeName = product.substrateInfo?.outside?.shape?.name || 'Shape'
    onSelect( product, `${dimensionLabel( product )} ${familyNameFor( shapeName )}` )
    close()
  }

  function openMid( evt, item )
  {
    setMidAnchorEl( evt.currentTarget )
    setOpenTop( item )
  }

  // Submenu opens on hover (onMouseEnter) rather than requiring a click.
  // onClick is kept alongside it (not replaced) purely so keyboard nav
  // (arrow keys + Enter, which fire onClick, not onMouseEnter) and touch
  // still work.
  function renderTopItem( item )
  {
    return (
      <MenuItem
        key={item.label}
        selected={openTop?.label === item.label}
        onMouseEnter={evt => openMid( evt, item )}
        onClick={evt => openMid( evt, item )}
      >
        <ListItemText>{item.label}</ListItemText>
        <i className='ri-arrow-right-s-line' />
      </MenuItem>
    )
  }

  const midProducts = 'shape' === openTop?.type ? openTop.entry.products : openTop?.products

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

      {/*
        Level 2: the hovered shape/group's products. hideBackdrop is the
        key piece here - Menu/Popover otherwise renders an invisible
        modal backdrop over the whole viewport while open, which sits
        above the top-level Menu's items and swallows their pointer
        events, so hovering off the first-opened item never reaches its
        siblings (the submenu looks "locked" open). With no backdrop of
        its own, clicks outside this submenu simply fall through to
        whatever's beneath them - typically another top-level item (hover
        opens its submenu instead) or the top Menu's own backdrop, which
        still closes everything as usual.
      */}
      <Menu
        anchorEl={midAnchorEl}
        open={Boolean( midAnchorEl )}
        onClose={close}
        hideBackdrop
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        {midProducts?.map( product => (
          <MenuItem key={product.id} onClick={() => pick( product )}>
            {dimensionLabel( product )}
          </MenuItem>
        ) )}
      </Menu>
    </>
  )
}
