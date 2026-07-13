// Encodes/decodes the calculator's `panels` query param, e.g.
// ?panels=7:8:10:0.75,:6:6:1 - two panels: one tied to product 7 shown at
// 8x10 with a 0.75 border, one blank at 6x6/1. Each panel's width/height/
// border travel in the URL (not just its product id) so a bookmarked or
// shared link reproduces edits made after loading a product, not just that
// product's originally saved values.
const FIELD_SEP = ':'
const PANEL_SEP = ','

export function encodePanels( panels )
{
  return panels
    .map( p => [p.productId ?? '', p.width ?? '', p.height ?? '', p.border ?? ''].join( FIELD_SEP ) )
    .join( PANEL_SEP )
}

function decodePanelsString( value )
{
  return value
    .split( PANEL_SEP )
    .filter( Boolean )
    .map( entry => {
      const [productId, width, height, border] = entry.split( FIELD_SEP )

      return {
        productId: productId ? Number( productId ) : undefined,
        width: width ? Number( width ) : undefined,
        height: height ? Number( height ) : undefined,
        border: border ? Number( border ) : undefined,
      }
    })
}

// `panelsParam` is the raw ?panels= value, if present. `legacyProductId` is
// the older single-panel ?productId= link (still used by e.g. a product's
// "Open in Calculator" button) - only honored when panels isn't present,
// since panels is the newer, more complete format and takes precedence.
export function decodePanelsParam( panelsParam, legacyProductId )
{
  if( panelsParam )
  {
    const panels = decodePanelsString( panelsParam )
    if( panels.length )
      return panels
  }

  if( legacyProductId )
    return [{productId: Number( legacyProductId )}]

  return [{}]
}
