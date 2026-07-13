// Encodes/decodes the calculator's query params for the single-working-
// panel + lightbox gallery layout:
//   ?current=<entry>          - the main panel's live state
//   ?gallery=<entry>,<entry>  - the lightbox strip, in order
//   ?pinned=1                 - whether view settings are pinned (see
//                                MirrorCalculator's Pin/Unpin Settings)
//
// Each <entry> is productId:width:height:border:showBack:showDims:
// showGlass:zoom - shape data plus the view settings (toggles/zoom) that
// were active when it was captured, so clicking a lightbox thumbnail can
// restore both (unless settings are pinned - see MirrorCalculator).
//
// Also still honors the older single-panel ?productId= link (e.g. a
// product's "Open in Calculator" button) and the even older multi-panel
// ?panels= link, both taking the first/only value as the working panel.
import { DEFAULT_SETTINGS } from './mirrorSettings'

const FIELD_SEP = ':'
const LIST_SEP = ','

export function encodeEntry( entry )
{
  const s = entry?.settings ?? DEFAULT_SETTINGS

  return [
    entry?.productId ?? '',
    entry?.width ?? '',
    entry?.height ?? '',
    entry?.border ?? '',
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

function decodeEntry( str )
{
  const [productId, width, height, border, showBack, showDims, showGlass, zoom] = str.split( FIELD_SEP )

  return {
    productId: productId ? Number( productId ) : undefined,
    width: width ? Number( width ) : undefined,
    height: height ? Number( height ) : undefined,
    border: border ? Number( border ) : undefined,
    settings: {
      showBack: '1' === showBack,
      showDims: showDims ? Number( showDims ) : 0,
      // Legacy 4-field entries (from the old ?panels= format) have no
      // showGlass field at all - default that (and only that) case to
      // true, matching DEFAULT_SETTINGS, rather than reading it as false.
      showGlass: (undefined === showGlass || '' === showGlass) ? true : '1' === showGlass,
      zoom: zoom ? Number( zoom ) : DEFAULT_SETTINGS.zoom,
    },
  }
}

export function decodeEntryList( value )
{
  if( !value )
    return []

  return value.split( LIST_SEP ).filter( Boolean ).map( decodeEntry )
}

// Resolves {current, gallery, pinned} from whichever query params are
// present, oldest-format links still falling back gracefully.
export function decodeInitialState( params )
{
  if( params?.current )
  {
    return {
      current: decodeEntry( params.current ),
      gallery: decodeEntryList( params.gallery ),
      pinned: '1' === params?.pinned,
    }
  }

  // Legacy single-panel link.
  if( params?.productId )
    return {current: {productId: Number( params.productId ), settings: DEFAULT_SETTINGS}, gallery: [], pinned: false}

  // Legacy multi-panel link - the first panel becomes the working panel,
  // any others seed the gallery.
  if( params?.panels )
  {
    const [first, ...rest] = decodeEntryList( params.panels )
    if( first )
      return {current: first, gallery: rest, pinned: false}
  }

  return {current: {settings: DEFAULT_SETTINGS}, gallery: [], pinned: false}
}
