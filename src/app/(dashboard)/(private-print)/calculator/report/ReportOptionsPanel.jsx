'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { updateSettings } from '@/db/actions/settings'

const SECTION_TITLES = ['Area', 'Weight', 'Pricing']

const DEFAULT_OPTIONS = {
  showDate: true,
  showCompany: false,
  showNotes: false,
  notes: '',
  consolidated: false,
  sections: {Area: true, Weight: true, Pricing: true},
}

function storageKey( reportKind )
{
  return `calculator-report-options-${reportKind}`
}

// Print-only options panel (hidden on print via Tailwind's print:hidden):
// lets the person generating a report choose what appears on it - date,
// company branding, notes, and either a consolidated stats table
// (working-panel report only) or per-section Area/Weight/Pricing toggles
// (lightbox report only, to help trim the comparison table down to fit
// one printed page) - before hitting Print.
//
// Toggle/notes choices persist to localStorage per report kind, so they
// don't need re-picking every visit. Company name/logo persist to the
// database instead (Settings/updateSettings) - that's meant to be entered
// once and reused on every future report from any device, not just
// remembered locally.
export default function ReportOptionsPanel( {reportKind, initialSettings, showConsolidatedToggle, showSectionToggles, onChange} )
{
  const [options, setOptions] = useState( DEFAULT_OPTIONS )
  const [companyName, setCompanyName] = useState( initialSettings?.companyName ?? '' )
  const [logoUrl, setLogoUrl] = useState( initialSettings?.logoUrl ?? '' )
  const [saving, setSaving] = useState( false )

  // Restore persisted toggle/notes choices once on mount - not folded
  // into the initial useState value, since localStorage isn't available
  // during server rendering.
  useEffect( () => {
    try
    {
      const stored = window.localStorage.getItem( storageKey( reportKind ) )
      if( stored )
        setOptions( prev => ({...prev, ...JSON.parse( stored )}) )
    }
    catch( err ) { /* malformed or unavailable storage - just keep defaults */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  useEffect( () => {
    onChange( {...options, companyName, logoUrl} )
    try { window.localStorage.setItem( storageKey( reportKind ), JSON.stringify( options ) ) }
    catch( err ) { /* storage unavailable (private browsing, quota, ...) */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, companyName, logoUrl] )

  function updateOption( patch )
  {
    setOptions( prev => ({...prev, ...patch}) )
  }

  function toggleSection( title, checked )
  {
    setOptions( prev => ({...prev, sections: {...prev.sections, [title]: checked}}) )
  }

  async function handleSaveBranding()
  {
    setSaving( true )
    try
    {
      await updateSettings( {companyName, logoUrl} )
    }
    finally
    {
      setSaving( false )
    }
  }

  return (
    <Box className='print:hidden' style={{border: '1px solid var(--mui-palette-divider)', borderRadius: 4, padding: 16}}>
      <Typography variant='subtitle1' className='mbe-2'>Report Options</Typography>
      <Stack spacing={3}>
        <FormControlLabel
          control={<Checkbox checked={options.showDate} onChange={evt => updateOption( {showDate: evt.target.checked} )} />}
          label='Show date generated'
        />

        <div>
          <FormControlLabel
            control={<Checkbox checked={options.showCompany} onChange={evt => updateOption( {showCompany: evt.target.checked} )} />}
            label='Show company name/logo'
          />
          {options.showCompany && (
            <Stack spacing={2} className='pis-8'>
              <TextField
                label='Company Name'
                size='small'
                value={companyName}
                onChange={evt => setCompanyName( evt.target.value )}
                onBlur={handleSaveBranding}
              />
              <TextField
                label='Logo URL'
                size='small'
                value={logoUrl}
                onChange={evt => setLogoUrl( evt.target.value )}
                onBlur={handleSaveBranding}
                helperText={saving ? 'Saving...' : 'Saved once, reused on every future report.'}
              />
            </Stack>
          )}
        </div>

        <div>
          <FormControlLabel
            control={<Checkbox checked={options.showNotes} onChange={evt => updateOption( {showNotes: evt.target.checked} )} />}
            label='Include notes'
          />
          {options.showNotes && (
            <TextField
              label='Notes'
              size='small'
              multiline
              minRows={3}
              fullWidth
              className='pis-8'
              value={options.notes}
              onChange={evt => updateOption( {notes: evt.target.value} )}
            />
          )}
        </div>

        {showConsolidatedToggle && (
          <FormControlLabel
            control={<Checkbox checked={options.consolidated} onChange={evt => updateOption( {consolidated: evt.target.checked} )} />}
            label='Consolidated data table (one table instead of three)'
          />
        )}

        {showSectionToggles && (
          <div>
            <Typography variant='body2' className='mbe-1'>Comparison table sections</Typography>
            <Stack className='pis-2'>
              {SECTION_TITLES.map( title => (
                <FormControlLabel
                  key={title}
                  control={
                    <Checkbox
                      checked={options.sections[title] ?? true}
                      onChange={evt => toggleSection( title, evt.target.checked )}
                    />
                  }
                  label={title}
                />
              ) )}
            </Stack>
          </div>
        )}

        <Button variant='contained' onClick={() => window.print()} startIcon={<i className='ri-printer-line' />}>
          Print
        </Button>
      </Stack>
    </Box>
  )
}
