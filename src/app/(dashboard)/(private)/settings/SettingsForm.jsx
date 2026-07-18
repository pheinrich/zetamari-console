'use client'

import { z } from 'zod'
import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useFormSubmit } from '@/utils/formSubmitHook'
import { updateSettings, updateCostFactorRates } from '@/db/actions/settings'
import tableStyles from '@core/styles/table.module.css'

const CATEGORY_LABELS = {material: 'Material', machine: 'Machine', labor: 'Labor'}
const CATEGORY_ORDER = ['material', 'machine', 'labor']

const optionalString = z.preprocess( (val) => (val === '' ? undefined : val), z.string().optional() )
const optionalNumber = z.preprocess( (val) => (val === '' || val == null ? undefined : val), z.coerce.number().min( 0 ).optional() )

// These process constants are typically entered with several digits
// after the decimal point, where the native up/down spinner increments
// by a whole step that's rarely the adjustment anyone wants - hidden on
// every numeric field below.
const noSpinnerSx = {
  '& input[type=number]': {MozAppearance: 'textfield'},
  '& input[type=number]::-webkit-outer-spin-button': {WebkitAppearance: 'none', margin: 0},
  '& input[type=number]::-webkit-inner-spin-button': {WebkitAppearance: 'none', margin: 0},
}

const schema = z.object({
  companyName: optionalString,
  logoUrl: optionalString,
  feedRateInPerMin: optionalNumber,
  powerDrawKwh: optionalNumber,
  electricityRatePerKwh: optionalNumber,
  sandingRateSqInPerHr: optionalNumber,
  glueingRateSqInPerHr: optionalNumber,
  groutingRateSqInPerHr: optionalNumber,
  wholesaleMultiplier: optionalNumber,
  retailMultiplier: optionalNumber,

  // Only ever populated from the Cost Factor Rates table below - one
  // {id, rate} per CostFactor, saved together with the rest of this form
  // in a single submit rather than a separate save action (this is the
  // "folded into Settings" replacement for the old per-profile Rate
  // Profile Editor).
  rates: z.array( z.object({
    id: z.coerce.number().int(),
    rate: z.coerce.number(),
  }) ).optional(),
})

// Singleton form - there's only ever one Settings row (see db/models/
// Settings.js), so unlike SupplierForm/ProductForm there's no create/edit
// branching, just a single always-update submit. `costFactors` is every
// CostFactor (see db/actions/settings.js's readCostFactors), rendered as
// an editable rate table alongside the process constants.
export default function SettingsForm( {initialData={}, costFactors=[]} )
{
  const { handleSubmit, loading, errors } = useFormSubmit({
    schema,
    onSubmit: async ( data ) => {
      await updateSettings( data )
      if( data.rates?.length )
        await updateCostFactorRates( data.rates )
      toast.success( 'Settings saved' )
    },
  })

  const byCategory = {}
  for( const factor of costFactors )
  {
    const category = factor.category || 'other'
    ;(byCategory[category] ??= []).push( factor )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4'>Settings</Typography>
            <Button type='submit' variant='contained' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Grid>

        {errors && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='error'>
              <pre className='whitespace-pre-wrap font-sans m-0'>{JSON.stringify( errors, null, 2 )}</pre>
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Branding' subheader='Shown on printed calculator reports' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Company Name' name='companyName' defaultValue={initialData?.companyName || ''} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label='Logo URL' name='logoUrl' defaultValue={initialData?.logoUrl || ''} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title='Machine'
              subheader='Converts a product’s cut distance into machine run-time, which feeds the Utilities and CNC Labor cost factors'
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Feed Rate'
                    name='feedRateInPerMin'
                    defaultValue={initialData?.feedRateInPerMin ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>in/min</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Power Draw'
                    name='powerDrawKwh'
                    defaultValue={initialData?.powerDrawKwh ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>kWh</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Electricity Rate'
                    name='electricityRatePerKwh'
                    defaultValue={initialData?.electricityRatePerKwh ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>$/kWh</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title='Labor Heuristics'
              subheader='Seed the Sanding/Glueing/Grouting labor-hour defaults, scaled by a product’s mosaic surface area'
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Sanding Rate'
                    name='sandingRateSqInPerHr'
                    defaultValue={initialData?.sandingRateSqInPerHr ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>sq-in/hr</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Glueing Rate'
                    name='glueingRateSqInPerHr'
                    defaultValue={initialData?.glueingRateSqInPerHr ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>sq-in/hr</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Grouting Rate'
                    name='groutingRateSqInPerHr'
                    defaultValue={initialData?.groutingRateSqInPerHr ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>sq-in/hr</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title='Pricing'
              subheader='Scale a product’s COGS cost total (Cost Factor Rates below x its effective quantities) into Wholesale/Retail cost-breakdown figures'
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Wholesale Multiplier'
                    name='wholesaleMultiplier'
                    defaultValue={initialData?.wholesaleMultiplier ?? 1}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>x COGS</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Retail Multiplier'
                    name='retailMultiplier'
                    defaultValue={initialData?.retailMultiplier ?? 1}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>x COGS</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Cost Factor Rates' subheader='The $ COGS rate charged per unit of each cost factor' />
            <CardContent className='flex flex-col gap-6'>
              {CATEGORY_ORDER.filter( c => byCategory[c] ).map( category => (
                <div key={category} className='flex flex-col gap-2'>
                  <Typography variant='subtitle1'>{CATEGORY_LABELS[category] || category}</Typography>
                  <div className='overflow-x-auto'>
                    <table className={tableStyles.table}>
                      <thead>
                        <tr>
                          <th>Factor</th>
                          <th>Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byCategory[category].map( (factor, i) => {
                          const index = costFactors.indexOf( factor )
                          return (
                            <tr key={factor.id}>
                              <td>{factor.label}</td>
                              <td>
                                <TextField
                                  type='number'
                                  size='small'
                                  inputProps={{step: 'any', min: '0'}}
                                  name={`rates.${index}.rate`}
                                  defaultValue={factor.rate ?? 0}
                                  InputProps={{
                                    startAdornment: '$',
                                    endAdornment: <span className='whitespace-nowrap'>/ {factor.rateUnit || factor.unit}</span>,
                                  }}
                                  sx={noSpinnerSx}
                                  className='is-40'
                                />
                                <input type='hidden' name={`rates.${index}.id`} value={factor.id} />
                              </td>
                            </tr>
                          )
                        } )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}
