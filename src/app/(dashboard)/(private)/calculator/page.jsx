import { readContours } from '@/db/actions/contour'
import { readSubstrateProducts } from '@/db/actions/product'

import { decodePanelsParam } from './urlCodec'
import MirrorCalculator from './MirrorCalculator'

// Entry points: /calculator (one blank panel), /calculator?productId=N
// (legacy single-panel link, e.g. from a product's "Open in Calculator"
// button), and /calculator?panels=... (one or more panels, each carrying
// its own productId:width:height:border - see urlCodec.js). None of these
// edit a tied product in place - the calculator is exploratory local
// state; the only persistence action is each panel's "Save as New
// Product", which forks its current values into a brand new Product.
//
// substrateProducts already carries every substrate product's full
// SubstrateInfo (dimensions + outside/inside/rabbet contours), so no
// separate per-product fetch is needed here - MirrorCalculator resolves
// each panel's productId against this same list, both for the initial
// load and for later in-session product switches.
export default async function CalculatorPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts] = await Promise.all([
    readContours(),
    readSubstrateProducts(),
  ])

  const initialPanels = decodePanelsParam( params?.panels, params?.productId )

  return (
    // Keyed on the raw params so a genuinely different link (a fresh
    // ?panels=... or ?productId=... from elsewhere, or browser back/
    // forward) remounts the board with fresh state. In-session edits sync
    // the URL via window.history.replaceState directly (see
    // MirrorCalculator), which never triggers Next's router/this page
    // re-rendering - only real navigations change `params`, so this key
    // doesn't cause remounts from the board's own updates.
    <MirrorCalculator
      key={params?.panels ?? params?.productId ?? 'blank'}
      initialPanels={initialPanels}
      contours={contours}
      substrateProducts={substrateProducts}
    />
  )
}
