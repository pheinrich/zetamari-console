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

// The two rate-holder CostFactor rows added by the
// 20260725000000-owner-assistant-labor.js migration (item 13) - unlike
// every other Labor row, their Rate ($/hr) is what's actually used in
// cost math (see db/actions/productCost.js's resolveLaborRates()), and
// they don't have a Default % Owner of their own to edit.
const LABOR_RATE_HOLDER_KEYS = new Set( ['laborOwner', 'laborAssistant'] )

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
  tesseraeWeightPerSqIn: optionalNumber,
  mirrorGlassWeightPerSqIn: optionalNumber,
  groutWeightPerSqIn: optionalNumber,
  woodenBaseWeightPerSqIn: optionalNumber,

  // Only ever populated from the Cost Factor Rates table below - one
  // {id, rate} per CostFactor, saved together with the rest of this form
  // in a single submit rather than a separate save action (this is the
  // "folded into Settings" replacement for the old per-profile Rate
  // Profile Editor). `defaultOwnerSharePercent` is only submitted for
  // the six Labor stage rows (item 13) - see the table below.
  rates: z.array( z.object({
    id: z.coerce.number().int(),
    rate: z.coerce.number(),
    defaultOwnerSharePercent: optionalNumber,
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
              subheader='COGS = (Material + Machine cost) x Materials Markup + Assistant labor cost. Wholesale = COGS + Owner labor cost. Retail = Wholesale x Wholesale-to-Retail Multiplier.'
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Materials Markup'
                    name='wholesaleMultiplier'
                    defaultValue={initialData?.wholesaleMultiplier ?? 1}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>x Material+Machine</InputAdornment>}}
                    helperText='Applied to Material/Machine cost only - Labor is added at cost, not marked up here'
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Wholesale-to-Retail Multiplier'
                    name='retailMultiplier'
                    defaultValue={initialData?.retailMultiplier ?? 1}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>x Wholesale</InputAdornment>}}
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
              title='Material Weight'
              subheader='Converts each area-based Material cost factor’s computed sq-in into a weight contribution - see Product weight’s “Copy from Computed Weight” button'
            />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Tesserae'
                    name='tesseraeWeightPerSqIn'
                    defaultValue={initialData?.tesseraeWeightPerSqIn ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>/sq-in</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Mirror Glass'
                    name='mirrorGlassWeightPerSqIn'
                    defaultValue={initialData?.mirrorGlassWeightPerSqIn ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>/sq-in</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Grout'
                    name='groutWeightPerSqIn'
                    defaultValue={initialData?.groutWeightPerSqIn ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>/sq-in</InputAdornment>}}
                    sx={noSpinnerSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Wooden Base'
                    name='woodenBaseWeightPerSqIn'
                    defaultValue={initialData?.woodenBaseWeightPerSqIn ?? ''}
                    inputProps={{step: 'any', min: '0'}}
                    InputProps={{endAdornment: <InputAdornment position='end'>/sq-in</InputAdornment>}}
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
              title='Cost Factor Rates'
              subheader='The $ COGS rate charged per unit of each cost factor. Labor stages instead default to a % Owner split of their time, billed at the Owner Labor/Assistant Labor rates below (item 13)'
            />
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
                          {'labor' === category && <th>Default % Owner</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {byCategory[category].map( factor => {
                          const index = costFactors.indexOf( factor )
                          const isRateHolder = LABOR_RATE_HOLDER_KEYS.has( factor.key )
                          const isLaborStage = 'labor' === category && !isRateHolder

                          return (
                            <tr key={factor.id}>
                              <td>{factor.label}</td>
                              <td>
                                {isLaborStage ? (
                                  <>
                                    <Typography color='text.secondary'>— (see % Owner)</Typography>
                                    <input type='hidden' name={`rates.${index}.rate`} value={factor.rate ?? 0} />
                                  </>
                                ) : (
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
                                )}
                                <input type='hidden' name={`rates.${index}.id`} value={factor.id} />
                              </td>
                              {'labor' === category && (
                                <td>
                                  {isLaborStage && (
                                    <TextField
                                      type='number'
                                      size='small'
                                      inputProps={{step: 'any', min: '0', max: '100'}}
                                      name={`rates.${index}.defaultOwnerSharePercent`}
                                      defaultValue={factor.defaultOwnerSharePercent ?? 100}
                                      InputProps={{endAdornment: '%'}}
                                      sx={noSpinnerSx}
                                      className='is-28'
                                    />
                                  )}
                                </td>
                              )}
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
