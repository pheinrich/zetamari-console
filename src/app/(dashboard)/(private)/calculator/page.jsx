import { readContours } from '@/db/actions/contour'
import { readWoodenBaseProducts } from '@/db/actions/product'

import { decodeInitialState } from './urlCodec'
import MirrorCalculator from './MirrorCalculator'

// Entry points: /calculator (blank working panel), /calculator?current=...
// &gallery=...&pinned=1 (the full working-panel + lightbox state - see
// urlCodec.js), and three older links still honored for compatibility:
// the pre-"Copy From" ?current=... format (which identified a shape by
// productId rather than by contour ids + an editable label), the
// single-panel /calculator?productId=N (e.g. a product's "Open in
// Calculator" button), and the short-lived multi-panel /calculator?panels=.
// None of these tie the working panel to a product in an ongoing way -
// the calculator is exploratory local state; "Copy From..." (in the
// working panel's header) only ever copies a product's values in once,
// and the only persistence action is "Save as New Product" (in the ⋮
// menu), which forks the current values into a brand new Product.
//
// substrateProducts already carries every wooden base product's full
// WoodenBaseInfo (dimensions + outside/inside/rabbet contours), so no
// separate per-product fetch is needed here - decodeInitialState uses
// this same list (and contours) to resolve any of the legacy,
// productId-keyed link formats into the current contour-id-based shape.
// (Kept the `substrateProducts`/`substrateInfo` naming through the
// calculator subsystem below - it's this feature's own working-geometry
// vocabulary, not a direct reference to the renamed Product.type/model -
// see the 20260723000000-rename-product-types.js migration.)
export default async function CalculatorPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts] = await Promise.all([
    readContours(),
    readWoodenBaseProducts(),
  ])

  const initialState = decodeInitialState( params, contours, substrateProducts )

  return (
    // Keyed on the raw params so a genuinely different link (a fresh
    // ?current=...&gallery=..., or one of the legacy links, or browser
    // back/forward) remounts with fresh state. In-session edits sync the
    // URL via window.history.replaceState directly (see MirrorCalculator),
    // which never triggers Next's router/this page re-rendering - only
    // real navigations change `params`, so this key doesn't cause remounts
    // from the calculator's own updates.
    <MirrorCalculator
      key={params?.current ?? params?.gallery ?? params?.productId ?? params?.panels ?? 'blank'}
      initialState={initialState}
      contours={contours}
      substrateProducts={substrateProducts}
    />
  )
}
