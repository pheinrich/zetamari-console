'use client'

import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { TABS, PRICING_COLUMNS } from './configurationCost'

// Bundles the three purely-visual kebab-menu controls (Show Tabs/Pricing
// Columns checklists, Pin Settings toggle) that used to be scattered
// directly across MirrorCalculator's kebab Menu into one dedicated dialog,
// opened via a single "View Settings..." item - per the 2026-08-04
// revision. Unlike the kebab's other item (Print Report, which acts on the
// data), none of these touch substrateInfo/
// the gallery - they only control how the existing data is displayed - so
// grouping them here keeps the kebab menu itself short. All state
// (tabVisible/pricingColumnVisible/pinned) still lives in MirrorCalculator,
// same as before; this component is purely presentational.
export default function ViewSettingsDialog( {
  open,
  onClose,
  tabVisible,
  onToggleTab,
  pricingColumnVisible,
  onTogglePricingColumn,
  pinned,
  onTogglePinned,
} )
{
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle className='flex items-center justify-between'>
        View Settings
        <IconButton onClick={onClose}>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack gap={4} className='pbs-2'>
          <Stack direction='row' gap={6}>
            <div className='flex-1'>
              <Typography variant='subtitle2' className='mbe-2'>Show Tabs</Typography>
              <Stack>
                {TABS.map( t => (
                  <FormControlLabel
                    key={t.key}
                    control={
                      <Checkbox
                        size='small'
                        checked={Boolean( tabVisible[t.key] )}
                        onChange={() => onToggleTab( t.key )}
                      />
                    }
                    label={t.label}
                  />
                ) )}
              </Stack>
            </div>
            <div className='flex-1'>
              <Typography variant='subtitle2' className='mbe-2'>Pricing Columns</Typography>
              <Stack>
                {PRICING_COLUMNS.map( c => (
                  <FormControlLabel
                    key={c.key}
                    control={
                      <Checkbox
                        size='small'
                        checked={Boolean( pricingColumnVisible[c.key] )}
                        onChange={() => onTogglePricingColumn( c.key )}
                      />
                    }
                    label={c.label}
                  />
                ) )}
              </Stack>
            </div>
          </Stack>
          <Divider />
          <FormControlLabel
            control={<Checkbox checked={Boolean( pinned )} onChange={onTogglePinned} />}
            label='Pin Settings (keep view settings when switching lightbox entries)'
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
