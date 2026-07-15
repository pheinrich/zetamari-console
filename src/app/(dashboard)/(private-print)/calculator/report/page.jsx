import { readContours } from '@/db/actions/contour'
import { readSubstrateProducts } from '@/db/actions/product'
import { readSettings } from '@/db/actions/settings'

import { decodeInitialState } from '@/app/(dashboard)/(private)/calculator/urlCodec'
import { resolveEntryMirror, labelForEntry } from '@/app/(dashboard)/(private)/calculator/resolveEntryMirror'

import WorkingPanelReport from './WorkingPanelReport'

// Printable report for the calculator's working panel, reached from its
// "Print Report" menu item (?current=... encodes the exact shape/
// dimensions/settings shown at the time, same encoding as the calculator
// itself - see urlCodec.js). The geometry is resolved here, server-side,
// rather than in a client component - unlike the interactive calculator,
// this page never edits the shape, so there's no reason to ship the
// jsts geometry library to the browser for it.
export default async function CalculatorReportPage( {searchParams} )
{
  const params = await searchParams

  const [contours, substrateProducts, settings] = await Promise.all([
    readContours(),
    readSubstrateProducts(),
    readSettings(),
  ])

  const {current} = decodeInitialState( params, contours, substrateProducts )
  const mirror = resolveEntryMirror( current, contours )
  const label = labelForEntry( current )

  return (
    <WorkingPanelReport
      label={label}
      mirror={mirror}
      settings={current.settings}
      initialSettings={settings}
    />
  )
}
