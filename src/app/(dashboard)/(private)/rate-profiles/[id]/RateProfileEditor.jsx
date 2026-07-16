'use client'

import { useState, useTransition } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { updateRateProfile, deleteRateProfile } from '@/db/actions/rateProfile'
import tableStyles from '@core/styles/table.module.css'

const KIND_LABELS = {wholesale: 'Wholesale', retail: 'Retail', custom: 'Custom'}
const CATEGORY_LABELS = {material: 'Material', machine: 'Machine', labor: 'Labor'}
const CATEGORY_ORDER = ['material', 'machine', 'labor']

// Name and every factor's rate are edited together and saved in one call
// - there's no separate read-only detail view for a rate profile, since
// the rate table is the whole point of the page. `kind` is never
// editable (it's fixed at creation - see rateProfile.js) so it's shown
// as a plain chip, not a field.
export default function RateProfileEditor( {profile} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState( profile.name )
  const [rates, setRates] = useState(
    () => Object.fromEntries( profile.rates.map( r => [r.costFactorId, r.rate] ) )
  )
  const [error, setError] = useState( null )

  const isStandard = 'custom' !== profile.kind

  function handleRateChange( costFactorId, value )
  {
    setRates( prev => ({...prev, [costFactorId]: value}) )
  }

  function handleSave()
  {
    setError( null )
    startTransition( async () => {
      const result = await updateRateProfile({
        id: profile.id,
        name,
        rates: Object.entries( rates ).map( ([costFactorId, rate]) => ({costFactorId: Number( costFactorId ), rate: Number( rate ) || 0}) ),
      })

      if( result?.error )
        setError( result.error )
      else
      {
        toast.success( 'Rate profile saved' )
        router.refresh()
      }
    })
  }

  function handleDelete()
  {
    if( !confirm( `Delete the "${profile.name}" rate profile?` ) )
      return

    startTransition( async () => {
      const result = await deleteRateProfile( profile.id )
      if( result?.error )
        toast.error( result.error )
      else
      {
        toast.success( 'Rate profile deleted' )
        router.push( '/rate-profiles' )
      }
    })
  }

  const byCategory = {}
  for( const rate of profile.rates )
  {
    const category = rate.factor.category || 'other'
    ;(byCategory[category] ??= []).push( rate )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <Typography variant='h4'>{profile.name}</Typography>
            <Chip label={KIND_LABELS[profile.kind] || profile.kind} variant='tonal' color='primary' size='small' />
          </div>
          <div className='flex flex-wrap gap-4'>
            <Button variant='outlined' color='secondary' component={NextLink} href='/rate-profiles'>
              Back
            </Button>
            {!isStandard && (
              <Button variant='outlined' color='error' disabled={isPending} onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button variant='contained' disabled={isPending} onClick={handleSave}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Grid>

      {error && (
        <Grid size={{ xs: 12 }}>
          <Typography color='error'>{error}</Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Profile Name' />
          <CardContent>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Name'
                  value={name}
                  onChange={e => setName( e.target.value )}
                  disabled={isStandard}
                  helperText={isStandard ? 'The standard Wholesale/Retail profiles keep their name.' : undefined}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Rates' subheader='$ charged per unit of each cost factor under this profile' />
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
                      {byCategory[category].map( r => (
                        <tr key={r.costFactorId}>
                          <td>{r.factor.label}</td>
                          <td>
                            <TextField
                              type='number'
                              size='small'
                              inputProps={{step: '0.0001', min: '0'}}
                              value={rates[r.costFactorId] ?? 0}
                              onChange={e => handleRateChange( r.costFactorId, e.target.value )}
                              InputProps={{
                                startAdornment: '$',
                                endAdornment: <span className='whitespace-nowrap'>/ {r.factor.unit}</span>,
                              }}
                              className='is-40'
                            />
                          </td>
                        </tr>
                      ) )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
