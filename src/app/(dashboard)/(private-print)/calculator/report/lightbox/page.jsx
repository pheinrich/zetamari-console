import { readContours } from '@/db/actions/contour'
import { readWoodenBaseProducts } from '@/db/actions/product'
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
// `substrateProducts` is only needed here, for decodeEntryList()'s
// legacy (pre-Copy-From) link fallback - current-format entries carry
// their own contour ids/label directly, and nothing downstream needs it.
export default async function CalculatorLightboxReportPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts, settings] = await Promise.all([
    readContours(),
    readWoodenBaseProducts(),
    readSettings(),
  ])

  const gallery = decodeEntryList( params?.gallery, contours, substrateProducts ).map( (entry, i) => ({...entry, id: `g-${i}`}) )

  const entries = gallery.map( entry => ({
    id: entry.id,
    label: labelForEntry( entry ),
    mirror: resolveEntryMirror( entry, contours ),
    settings: entry.settings,
  }) )

  return (
    <LightboxReport
      entries={entries}
      gallery={gallery}
      contours={contours}
      initialSettings={settings}
    />
  )
}
