'use client'

import { useState } from 'react'

import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import MirrorView from '@/app/(dashboard)/(private)/calculator/MirrorView'
import { DEFAULT_SETTINGS } from '@/app/(dashboard)/(private)/calculator/mirrorSettings'
import ComparisonTable from '@/app/(dashboard)/(private)/calculator/ComparisonTable'

import ReportOptionsPanel from '../ReportOptionsPanel'

// Small enough that a typical gallery's thumbnail grid plus the full
// three-section comparison table has a real shot at fitting one printed
// page (see the @page rule in globals.css) - THUMB_SIZE in particular
// drove most of the old layout's height, since MirrorView's aspect-ratio
// box scales everything else (labels, gaps) along with it.
const THUMB_SIZE = 130

// See WorkingPanelReport.jsx - MirrorView takes an imageRef only for
// SnapshotDialog's PNG export, unused here.
const NO_IMAGE_REF = {current: null}

export default function LightboxReport( {entries, gallery, contours, initialSettings} )
{
  const [options, setOptions] = useState( null )

  const ready = entries.filter( e => e.mirror )

  return (
    <div className='p-4 flex flex-col gap-3' style={{maxWidth: 900, marginInline: 'auto'}}>
      <ReportOptionsPanel
        reportKind='lightbox'
        initialSettings={initialSettings}
        showSectionToggles
        onChange={setOptions}
      />

      {options?.showCompany && (options.companyName || options.logoUrl) && (
        <Stack direction='row' spacing={2} alignItems='center'>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied logo URL, can't be pre-registered with next/image */}
          {options.logoUrl && <img src={options.logoUrl} alt='' style={{height: 36}} />}
          {options.companyName && <Typography variant='h6'>{options.companyName}</Typography>}
        </Stack>
      )}

      <Typography variant='h5'>Lightbox Comparison</Typography>

      {options?.showDate && (
        <Typography variant='caption' color='text.secondary'>
          Generated {new Date().toLocaleDateString()}
        </Typography>
      )}

      {0 === ready.length ? (
        <Typography>No saved prototypes to report.</Typography>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_SIZE}px, 1fr))`,
              gap: 12,
            }}
          >
            {ready.map( entry => (
              <div key={entry.id} className='flex flex-col gap-1 items-center' style={{breakInside: 'avoid'}}>
                <MirrorView
                  mirror={entry.mirror}
                  settings={{...(entry.settings ?? DEFAULT_SETTINGS), showDims: 0}}
                  imageRef={NO_IMAGE_REF}
                  size={THUMB_SIZE}
                />
                <Typography variant='caption'>{entry.label}</Typography>
              </div>
            ) )}
          </div>

          <Divider />

          {/* defaultExpanded: a collapsed Accordion's contents wouldn't
              print at all. sections/dense come from the options panel's
              per-section toggles - un-consolidated (still the regular
              Area/Weight/Pricing sections, just individually
              includable/excludable) and shrunk down, both in service of
              fitting the whole gallery on one printed page. */}
          <ComparisonTable
            gallery={gallery}
            contours={contours}
            defaultExpanded
            sections={options?.sections}
            dense
          />
        </>
      )}

      {options?.showNotes && options.notes && (
        <>
          <Divider />
          <Typography variant='subtitle1'>Notes</Typography>
          <Typography variant='body2' style={{whiteSpace: 'pre-wrap'}}>{options.notes}</Typography>
        </>
      )}
    </div>
  )
}
