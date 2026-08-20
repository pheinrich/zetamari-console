import { readContours } from '@/db/actions/contour'
import { readProducts, readWoodenBaseProducts } from '@/db/actions/product'
import { readShapeTypes } from '@/db/actions/shapeType'
import { readSettings, readCostFactors } from '@/db/actions/settings'

import { decodeInitialState } from './urlCodec'
import MirrorCalculator from './MirrorCalculator'

// Entry points: /calculator (blank working panel), /calculator?current=...
// &gallery=...&pinned=1 (the full working-panel + lightbox state - see
// urlCodec.js), and three older links still honored for compatibility:
// the pre-"Copy From" ?current=... format (which identified a shape by
// productId rather than by contour ids + an editable label), the
// single-panel /calculator?productId=N (e.g. a product's "Open in
// Visualizer" button), and the short-lived multi-panel /calculator?panels=.
// None of these tie the working panel to a product in an ongoing way -
// the Visualizer is exploratory local state; "Copy From..." (in the
// working panel's header) only ever copies a product's values in once,
// and the only persistence action is the Pricing tab's "Create New
// Product..." button (see StatsSummary.jsx/CreateNewProductDialog.jsx,
// which replaced the old ⋮ menu's "Save New Wooden Base.../Save New
// Mirror Glass..." items), which forks the current shape/dimensions -
// plus a Bill of Materials line for each Pricing-tab Material row
// currently checked "Include" - into a brand new, hidden draft Product.
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
//
// `products` is the full catalog (every type) - CreateNewProductDialog's
// per-category Bill of Materials pickers filter it client-side, same as
// BomEditor.jsx's own material picker already does on the product edit
// page.
export default async function CalculatorPage( {searchParams} )
{
  const params = await searchParams

  // settings/costFactors feed the new configurationCost.js pipeline (see
  // StatsSummary.jsx) - the same Settings/CostFactor data the real
  // product-costing system reads, fetched once here (server-side, like
  // everything else on this page) rather than per-render in the client
  // component below.
  const [contours, substrateProducts, products, shapeTypes, settings, costFactors] = await Promise.all([
    readContours(),
    readWoodenBaseProducts(),
    readProducts(),
    readShapeTypes(),
    readSettings(),
    readCostFactors(),
  ])

  const initialState = decodeInitialState( params, contours, substrateProducts )

  // Whether this request actually named a shape (current/productId/panels)
  // versus landing here bare - e.g. the sidebar/nav "visualizer" link,
  // which is a plain /calculator href with no query string at all. Passed
  // through so MirrorCalculator knows an explicit link should always win
  // over the Redux snapshot's `current` - see visualizer.js and
  // MirrorCalculator's `fromExplicitLink` handling.
  const fromExplicitLink = Boolean( params?.current || params?.productId || params?.panels )

  // Whether this request's format is actually *capable* of specifying a
  // gallery. The legacy ?productId= link (e.g. a product's "Open in
  // Visualizer" button) predates the lightbox entirely - decodeInitialState
  // always resolves it to an empty gallery, not because the user asked for
  // an empty lightbox, but because that URL shape has nowhere to put one.
  // Treating that the same as a real explicit gallery (like ?current=...&
  // gallery=...) would silently wipe out whatever prototypes were already
  // saved in this tab every time someone opens a product this way - so
  // only current/panels (both of which can genuinely carry gallery data)
  // count as an explicit gallery; productId-only falls back to the Redux
  // snapshot's gallery/pinned instead, same as a bare nav link would.
  const galleryFromExplicitLink = Boolean( params?.current || params?.panels )

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
      products={products}
      shapeTypes={shapeTypes}
      shopSettings={settings}
      costFactors={costFactors}
      fromExplicitLink={fromExplicitLink}
      galleryFromExplicitLink={galleryFromExplicitLink}
    />
  )
}
