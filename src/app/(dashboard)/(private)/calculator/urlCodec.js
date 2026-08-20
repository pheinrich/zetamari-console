// Encodes/decodes the calculator's query params for the single-working-
// panel + lightbox gallery layout:
//   ?current=<entry>          - the main panel's live state
//   ?gallery=<entry>,<entry>  - the lightbox strip, in order
//   ?pinned=1                 - whether view settings are pinned (see
//                                MirrorCalculator's Pin/Unpin Settings)
//   ?tabVisible=<keys>        - which StatsSummary tabs show (comma-list of
//                                visible TABS keys - see encodeFlagSet)
//   ?pricingColumns=<keys>    - which Pricing columns show (comma-list of
//                                visible PRICING_COLUMNS keys)
//
// Each <entry> is outsideId:insideId:rabbetId:width:height:border:label:
// showBack:showDims:showGlass:zoom:pricingState - the shape's contours
// plus dimensions, its editable label, the view settings (toggles/zoom)
// that were active when it was captured, and (per the 2026-08-19
// persistence revision) its own Pricing/Weight tab state - so clicking a
// lightbox thumbnail can restore all of it (settings/pricingState only
// when not pinned - see MirrorCalculator's loadEntry; pricingOverrides/
// weightOverrides always restore regardless of pin state, per that same
// revision - overrides are entry-specific, never shared via pinning).
// `label` is percent-encoded since it's freeform text that may itself
// contain the field/list separators; `pricingState` is a JSON blob (see
// encodePricingState/decodePricingState below) since include/
// pricingOverrides/weightOverrides are variable-shape maps, not a fixed
// handful of scalar fields the way everything else here is.
//
// Also still honors three older link formats, each resolved against a
// product (needing `contours`/`substrateProducts`, passed in from the
// server component that already fetched them) since older entries
// identified their shape by productId rather than by contour ids +
// label directly:
//   - the pre-Copy-From ?current=... format (8 fields: productId:width:
//     height:border:showBack:showDims:showGlass:zoom)
//   - the older single-panel ?productId= link (e.g. a product's "Open in
//     Calculator" button)
//   - the even older multi-panel ?panels= link
// A bookmarked 11-field link from before the 2026-08-19 revision (current
// format, but no pricingState field yet) still decodes fine too - see
// decodeEntry below.
import { TABS, PRICING_COLUMNS } from './configurationCost'
import { resolveSubstrateInfo } from './resolveSubstrateInfo'
import { DEFAULT_SETTINGS } from './mirrorSettings'

const FIELD_SEP = ':'
const LIST_SEP = ','

const TAB_KEYS = TABS.map( t => t.key )
const PRICING_COLUMN_KEYS = PRICING_COLUMNS.map( c => c.key )

// Current-format entries have 12 fields (11 before the 2026-08-19
// persistence revision added `pricingState`); the legacy productId-based
// format (still seen in old bookmarks/links) has 8. That count alone is
// enough to tell all three apart unambiguously.
const LEGACY_FIELD_COUNT = 8

function encodePricingState( entry )
{
  return encodeURIComponent( JSON.stringify( {
    preset: entry?.preset ?? 'all',
    include: entry?.include ?? {},
    pricingOverrides: entry?.pricingOverrides ?? {},
    weightOverrides: entry?.weightOverrides ?? {},
  } ) )
}

// Defensive against a hand-edited/truncated URL - falls back to "nothing
// carried" (every field undefined) rather than throwing, same spirit as
// the rest of this module's tolerant `? Number(x) : undefined` parsing.
function decodePricingState( str )
{
  if( !str )
    return {}

  try
  {
    return JSON.parse( decodeURIComponent( str ) )
  }
  catch( err )
  {
    return {}
  }
}

export function encodeEntry( entry )
{
  const s = entry?.settings ?? DEFAULT_SETTINGS

  return [
    entry?.outsideId ?? '',
    entry?.insideId ?? '',
    entry?.rabbetId ?? '',
    entry?.width ?? '',
    entry?.height ?? '',
    entry?.border ?? '',
    encodeURIComponent( entry?.label ?? '' ),
    s.showBack ? 1 : 0,
    s.showDims ?? 0,
    s.showGlass ? 1 : 0,
    s.zoom ?? '',
    encodePricingState( entry ),
  ].join( FIELD_SEP )
}

// Compact comma-list of whichever `allKeys` are currently "on" - used for
// tabVisible/pricingColumns (MirrorCalculator's View Settings toggles),
// which unlike per-entry pricing state (see encodePricingState above) are
// global to the whole Visualizer tab, not per-shape, so they live as their
// own top-level query params/Redux fields alongside `pinned` rather than
// inside every entry.
export function encodeFlagSet( flags, allKeys )
{
  return allKeys.filter( key => flags?.[key] ).join( LIST_SEP )
}

// `undefined` (the param was never set at all - a bare nav link, or one
// from before this flag set existed) defaults every key to `defaultValue`;
// an explicitly empty string (every flag was turned off) correctly decodes
// to all-false rather than falling back to the default.
export function decodeFlagSet( value, allKeys, defaultValue = true )
{
  if( undefined === value )
    return Object.fromEntries( allKeys.map( key => [key, defaultValue] ) )

  const onKeys = new Set( value ? value.split( LIST_SEP ) : [] )

  return Object.fromEntries( allKeys.map( key => [key, onKeys.has( key )] ) )
}

export function encodeEntryList( entries )
{
  return entries.map( encodeEntry ).join( LIST_SEP )
}

function decodeSettings( showBack, showDims, showGlass, zoom )
{
  return {
    showBack: '1' === showBack,
    showDims: showDims ? Number( showDims ) : 0,
    // Legacy 4-field entries (from the old ?panels= format) have no
    // showGlass field at all - default that (and only that) case to
    // true, matching DEFAULT_SETTINGS, rather than reading it as false.
    showGlass: (undefined === showGlass || '' === showGlass) ? true : '1' === showGlass,
    zoom: zoom ? Number( zoom ) : DEFAULT_SETTINGS.zoom,
  }
}

// Resolves a legacy productId-keyed entry (8 fields) into the current
// shape - contour ids + label come from looking the product up, same as
// a live "Copy From" action would produce.
function decodeLegacyEntry( fields, contours, substrateProducts )
{
  const [productIdStr, width, height, border, showBack, showDims, showGlass, zoom] = fields

  const productId = productIdStr ? Number( productIdStr ) : undefined
  const product = substrateProducts?.find( p => p.id === productId ) ?? null
  const resolved = resolveSubstrateInfo(
    {width: width ? Number( width ) : undefined, height: height ? Number( height ) : undefined, border: border ? Number( border ) : undefined},
    product,
    contours ?? [],
  )

  return {
    ...resolved,
    label: product?.name || 'Blank Shape',
    settings: decodeSettings( showBack, showDims, showGlass, zoom ),
  }
}

function decodeEntry( str, contours, substrateProducts )
{
  const fields = str.split( FIELD_SEP )

  if( LEGACY_FIELD_COUNT === fields.length )
    return decodeLegacyEntry( fields, contours, substrateProducts )

  // `pricingState` is `undefined` for a pre-2026-08-19 11-field bookmark -
  // decodePricingState(undefined) below returns {}, so `preset`/`include`/
  // `pricingOverrides`/`weightOverrides` all come back undefined too,
  // exactly like a fresh entry that's never had any of them set.
  const [outsideId, insideId, rabbetId, width, height, border, label, showBack, showDims, showGlass, zoom, pricingState] = fields
  const { preset, include, pricingOverrides, weightOverrides } = decodePricingState( pricingState )

  return {
    outsideId: outsideId ? Number( outsideId ) : undefined,
    insideId: insideId ? Number( insideId ) : undefined,
    rabbetId: rabbetId ? Number( rabbetId ) : undefined,
    width: width ? Number( width ) : undefined,
    height: height ? Number( height ) : undefined,
    border: border ? Number( border ) : undefined,
    label: label ? decodeURIComponent( label ) : '',
    settings: decodeSettings( showBack, showDims, showGlass, zoom ),
    preset,
    include,
    pricingOverrides,
    weightOverrides,
  }
}

export function decodeEntryList( value, contours, substrateProducts )
{
  if( !value )
    return []

  return value.split( LIST_SEP ).filter( Boolean ).map( str => decodeEntry( str, contours, substrateProducts ) )
}

// Resolves {current, gallery, pinned, tabVisible, pricingColumnVisible}
// from whichever query params are present, oldest-format links still
// falling back gracefully. tabVisible/pricingColumnVisible (per the
// 2026-08-19 persistence revision) are global to the whole Visualizer tab
// rather than per-entry (see encodeFlagSet above), so they're resolved
// once here and carried on every branch's return, independent of which
// `current`-format link (or lack of one) was actually present.
export function decodeInitialState( params, contours, substrateProducts )
{
  const tabVisible = decodeFlagSet( params?.tabVisible, TAB_KEYS )
  const pricingColumnVisible = decodeFlagSet( params?.pricingColumns, PRICING_COLUMN_KEYS )

  if( params?.current )
  {
    return {
      current: decodeEntry( params.current, contours, substrateProducts ),
      gallery: decodeEntryList( params.gallery, contours, substrateProducts ),
      pinned: '1' === params?.pinned,
      tabVisible,
      pricingColumnVisible,
    }
  }

  // Legacy single-panel link.
  if( params?.productId )
  {
    const productId = Number( params.productId )
    const product = substrateProducts?.find( p => p.id === productId ) ?? null
    const resolved = resolveSubstrateInfo( {}, product, contours ?? [] )

    return {
      current: {...resolved, label: product?.name || 'Blank Shape', settings: DEFAULT_SETTINGS},
      gallery: [],
      pinned: false,
      tabVisible,
      pricingColumnVisible,
    }
  }

  // Legacy multi-panel link - the first panel becomes the working panel,
  // any others seed the gallery.
  if( params?.panels )
  {
    const [first, ...rest] = decodeEntryList( params.panels, contours, substrateProducts )
    if( first )
      return {current: first, gallery: rest, pinned: false, tabVisible, pricingColumnVisible}
  }

  const blank = resolveSubstrateInfo( {}, null, contours ?? [] )
  return {current: {...blank, label: '', settings: DEFAULT_SETTINGS}, gallery: [], pinned: false, tabVisible, pricingColumnVisible}
}
