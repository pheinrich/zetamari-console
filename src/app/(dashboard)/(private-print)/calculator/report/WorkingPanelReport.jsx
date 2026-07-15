'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import MirrorView from '@/app/(dashboard)/(private)/calculator/MirrorView'
import { DEFAULT_SETTINGS } from '@/app/(dashboard)/(private)/calculator/mirrorSettings'

import ReportOptionsPanel from './ReportOptionsPanel'
import ReportStatsTable from './ReportStatsTable'

// Small enough that a single-shape report comfortably fits one printed
// page (see the @page rule in globals.css) alongside its stats table.
const PREVIEW_SIZE = 320

// MirrorView takes an imageRef for the SnapshotDialog's PNG export -
// nothing on the report page needs that, so it just gets a static object
// MirrorView can attach to (and never read back from).
const NO_IMAGE_REF = {current: null}

export default function WorkingPanelReport( {label, mirror, settings, initialSettings} )
{
  // null until ReportOptionsPanel's first effect fires (restoring
  // persisted choices) - nothing renders as "on" prematurely for a beat.
  const [options, setOptions] = useState( null )

  return (
    <div className='p-4 flex flex-col gap-3' style={{maxWidth: 700, marginInline: 'auto'}}>
      <ReportOptionsPanel
        reportKind='working'
        initialSettings={initialSettings}
        showConsolidatedToggle
        onChange={setOptions}
      />

      {!mirror ? (
        <Typography>Nothing to report - no shape or dimensions were provided.</Typography>
      ) : (
        <Card variant='outlined'>
          <CardContent className='flex flex-col gap-3'>
            {options?.showCompany && (options.companyName || options.logoUrl) && (
              <Stack direction='row' spacing={2} alignItems='center'>
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied logo URL, can't be pre-registered with next/image */}
                {options.logoUrl && <img src={options.logoUrl} alt='' style={{height: 36}} />}
                {options.companyName && <Typography variant='h6'>{options.companyName}</Typography>}
              </Stack>
            )}

            <Typography variant='h5'>{label}</Typography>

            {options?.showDate && (
              <Typography variant='caption' color='text.secondary'>
                Generated {new Date().toLocaleDateString()}
              </Typography>
            )}

            <MirrorView mirror={mirror} settings={settings ?? DEFAULT_SETTINGS} imageRef={NO_IMAGE_REF} size={PREVIEW_SIZE} />

            <Divider />

            <ReportStatsTable mirror={mirror} consolidated={Boolean( options?.consolidated )} />

            {options?.showNotes && options.notes && (
              <>
                <Divider />
                <Typography variant='subtitle1'>Notes</Typography>
                <Typography variant='body2' style={{whiteSpace: 'pre-wrap'}}>{options.notes}</Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
