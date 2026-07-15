// Encodes/decodes the calculator's query params for the single-working-
// panel + lightbox gallery layout:
//   ?current=<entry>          - the main panel's live state
//   ?gallery=<entry>,<entry>  - the lightbox strip, in order
//   ?pinned=1                 - whether view settings are pinned (see
//                                MirrorCalculator's Pin/Unpin Settings)
//
// Each <entry> is outsideId:insideId:rabbetId:width:height:border:label:
// showBack:showDims:showGlass:zoom - the shape's contours plus dimensions,
// its editable label, and the view settings (toggles/zoom) that were
// active when it was captured, so clicking a lightbox thumbnail can
// restore all of it (unless settings are pinned - see MirrorCalculator).
// `label` is percent-encoded since it's freeform text that may itself
// contain the field/list separators.
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
import { resolveSubstrateInfo } from './resolveSubstrateInfo'
import { DEFAULT_SETTINGS } from './mirrorSettings'

const FIELD_SEP = ':'
const LIST_SEP = ','

// Current-format entries have 11 fields; the legacy productId-based
// format (still seen in old bookmarks/links) has 8. That count alone is
// enough to tell them apart unambiguously.
const LEGACY_FIELD_COUNT = 8

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
  ].join( FIELD_SEP )
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

  const [outsideId, insideId, rabbetId, width, height, border, label, showBack, showDims, showGlass, zoom] = fields

  return {
    outsideId: outsideId ? Number( outsideId ) : undefined,
    insideId: insideId ? Number( insideId ) : undefined,
    rabbetId: rabbetId ? Number( rabbetId ) : undefined,
    width: width ? Number( width ) : undefined,
    height: height ? Number( height ) : undefined,
    border: border ? Number( border ) : undefined,
    label: label ? decodeURIComponent( label ) : '',
    settings: decodeSettings( showBack, showDims, showGlass, zoom ),
  }
}

export function decodeEntryList( value, contours, substrateProducts )
{
  if( !value )
    return []

  return value.split( LIST_SEP ).filter( Boolean ).map( str => decodeEntry( str, contours, substrateProducts ) )
}

// Resolves {current, gallery, pinned} from whichever query params are
// present, oldest-format links still falling back gracefully.
export function decodeInitialState( params, contours, substrateProducts )
{
  if( params?.current )
  {
    return {
      current: decodeEntry( params.current, contours, substrateProducts ),
      gallery: decodeEntryList( params.gallery, contours, substrateProducts ),
      pinned: '1' === params?.pinned,
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
    }
  }

  // Legacy multi-panel link - the first panel becomes the working panel,
  // any others seed the gallery.
  if( params?.panels )
  {
    const [first, ...rest] = decodeEntryList( params.panels, contours, substrateProducts )
    if( first )
      return {current: first, gallery: rest, pinned: false}
  }

  const blank = resolveSubstrateInfo( {}, null, contours ?? [] )
  return {current: {...blank, label: '', settings: DEFAULT_SETTINGS}, gallery: [], pinned: false}
}
