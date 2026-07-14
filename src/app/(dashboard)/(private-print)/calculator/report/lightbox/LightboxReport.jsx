'use client'

import { useState } from 'react'

import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import MirrorView from '@/app/(dashboard)/(private)/calculator/MirrorView'
import { DEFAULT_SETTINGS } from '@/app/(dashboard)/(private)/calculator/mirrorSettings'
import ComparisonTable from '@/app/(dashboard)/(private)/calculator/ComparisonTable'

import ReportOptionsPanel from '../ReportOptionsPanel'

const THUMB_SIZE = 220

// See WorkingPanelReport.jsx - MirrorView takes an imageRef only for
// SnapshotDialog's PNG export, unused here.
const NO_IMAGE_REF = {current: null}

export default function LightboxReport( {entries, gallery, contours, substrateProducts, initialSettings} )
{
  const [options, setOptions] = useState( null )

  const ready = entries.filter( e => e.mirror )

  return (
    <div className='p-6 flex flex-col gap-6' style={{maxWidth: 1100, marginInline: 'auto'}}>
      <ReportOptionsPanel
        reportKind='lightbox'
        initialSettings={initialSettings}
        showConsolidatedToggle={false}
        onChange={setOptions}
      />

      {options?.showCompany && (options.companyName || options.logoUrl) && (
        <Stack direction='row' spacing={3} alignItems='center'>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied logo URL, can't be pre-registered with next/image */}
          {options.logoUrl && <img src={options.logoUrl} alt='' style={{height: 48}} />}
          {options.companyName && <Typography variant='h5'>{options.companyName}</Typography>}
        </Stack>
      )}

      <Typography variant='h4'>Lightbox Comparison</Typography>

      {options?.showDate && (
        <Typography variant='body2' color='text.secondary'>
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
              gap: 24,
            }}
          >
            {ready.map( entry => (
              <div key={entry.id} className='flex flex-col gap-2 items-center' style={{breakInside: 'avoid'}}>
                <MirrorView
                  mirror={entry.mirror}
                  settings={{...(entry.settings ?? DEFAULT_SETTINGS), showDims: 0}}
                  imageRef={NO_IMAGE_REF}
                  size={THUMB_SIZE}
                />
                <Typography variant='body2'>{entry.label}</Typography>
              </div>
            ) )}
          </div>

          <Divider />

          {/* defaultExpanded: a collapsed Accordion's contents wouldn't print */}
          <ComparisonTable gallery={gallery} contours={contours} substrateProducts={substrateProducts} defaultExpanded />
        </>
      )}

      {options?.showNotes && options.notes && (
        <>
          <Divider />
          <Typography variant='subtitle1'>Notes</Typography>
          <Typography style={{whiteSpace: 'pre-wrap'}}>{options.notes}</Typography>
        </>
      )}
    </div>
  )
}
