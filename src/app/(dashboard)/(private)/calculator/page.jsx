import { readContours } from '@/db/actions/contour'
import { readSubstrateProducts } from '@/db/actions/product'

import { decodeInitialState } from './urlCodec'
import MirrorCalculator from './MirrorCalculator'

// Entry points: /calculator (blank working panel), /calculator?current=...
// &gallery=...&pinned=1 (the full working-panel + lightbox state - see
// urlCodec.js), and two older links still honored for compatibility: the
// single-panel /calculator?productId=N (e.g. a product's "Open in
// Calculator" button) and the short-lived multi-panel /calculator?panels=.
// None of these edit a tied product in place - the calculator is
// exploratory local state; the only persistence action is "Save as New
// Product" (in the working panel's ⋮ menu), which forks the current
// values into a brand new Product.
//
// substrateProducts already carries every substrate product's full
// SubstrateInfo (dimensions + outside/inside/rabbet contours), so no
// separate per-product fetch is needed here - MirrorCalculator resolves
// the working panel's (and each lightbox entry's) productId against this
// same list.
export default async function CalculatorPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts] = await Promise.all([
    readContours(),
    readSubstrateProducts(),
  ])

  const initialState = decodeInitialState( params )

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
