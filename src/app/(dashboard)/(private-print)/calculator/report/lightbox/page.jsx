import { readContours } from '@/db/actions/contour'
import { readSubstrateProducts } from '@/db/actions/product'
import { readSettings } from '@/db/actions/settings'

import { decodeEntryList } from '@/app/(dashboard)/(private)/calculator/urlCodec'
import { resolveEntryMirror, labelForEntry } from '@/app/(dashboard)/(private)/calculator/resolveEntryMirror'

import LightboxReport from './LightboxReport'

// Printable report for the whole lightbox gallery, reached from the
// calculator's "Print Report" button next to the Lightbox heading
// (?gallery=... - same encoding urlCodec.js already uses for bookmarking).
// Geometry for the thumbnail grid is resolved here, server-side, same
// reasoning as the working-panel report (page.jsx one level up) - keeps
// jsts out of this page's client bundle. ComparisonTable still resolves
// its own rows client-side (it's reused as-is from the interactive
// calculator), so `gallery` is passed through in its raw encoded shape
// alongside the pre-resolved `entries` used for the thumbnail grid.
export default async function CalculatorLightboxReportPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts, settings] = await Promise.all([
    readContours(),
    readSubstrateProducts(),
    readSettings(),
  ])

  const gallery = decodeEntryList( params?.gallery ).map( (entry, i) => ({...entry, id: `g-${i}`}) )

  const entries = gallery.map( entry => ({
    id: entry.id,
    label: labelForEntry( entry, substrateProducts ),
    mirror: resolveEntryMirror( entry, contours, substrateProducts ),
    settings: entry.settings,
  }) )

  return (
    <LightboxReport
      entries={entries}
      gallery={gallery}
      contours={contours}
      substrateProducts={substrateProducts}
      initialSettings={settings}
    />
  )
}
