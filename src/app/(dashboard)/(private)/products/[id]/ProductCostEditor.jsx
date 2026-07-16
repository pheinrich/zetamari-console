'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { setProductCostOverride, revertProductCostOverride } from '@/db/actions/productCost'
import { formatCurrency } from '../productFormat'
import tableStyles from '@core/styles/table.module.css'

const CATEGORY_LABELS = {material: 'Material', machine: 'Machine', labor: 'Labor'}
const CATEGORY_ORDER = ['material', 'machine', 'labor']

// Each factor's quantity is always shown as editable, pre-filled with the
// effective value (override if one exists, otherwise the computed
// default derived live from this product's geometry - see
// libs/costFactors.js). Committing a changed value always sets an
// override, even if it happens to match the computed default - Revert is
// the one way back to "let it track the computed value," which is why it
// only appears once an override actually exists.
export default function ProductCostEditor( {productId, costs} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleCommit( costFactorId, value )
  {
    const quantity = Number( value )
    if( !Number.isFinite( quantity ) || quantity < 0 )
      return

    startTransition( async () => {
      await setProductCostOverride( productId, costFactorId, quantity )
      router.refresh()
    })
  }

  function handleRevert( costFactorId )
  {
    startTransition( async () => {
      await revertProductCostOverride( productId, costFactorId )
      toast.success( 'Reverted to the computed value' )
      router.refresh()
    })
  }

  const byCategory = {}
  for( const row of costs.rows )
  {
    const category = row.factor.category || 'other'
    ;(byCategory[category] ??= []).push( row )
  }

  return (
    <div className='flex flex-col gap-6'>
      {CATEGORY_ORDER.filter( c => byCategory[c] ).map( category => (
        <div key={category} className='flex flex-col gap-2'>
          <Typography variant='subtitle1'>{CATEGORY_LABELS[category] || category}</Typography>
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Quantity</th>
                  <th>Wholesale</th>
                  <th>Retail</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {byCategory[category].map( row => {
                  const isOverridden = null !== row.overrideQuantity

                  return (
                    <tr key={row.factor.id}>
                      <td>{row.factor.label}</td>
                      <td>
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-2'>
                            <TextField
                              type='number'
                              size='small'
                              inputProps={{step: '0.0001', min: '0'}}
                              defaultValue={row.effectiveQuantity}
                              onBlur={e => handleCommit( row.factor.id, e.target.value )}
                              disabled={isPending}
                              className='is-28'
                            />
                            <Typography variant='body2' color='text.secondary'>{row.factor.unit}</Typography>
                          </div>
                          {isOverridden && (
                            <Typography variant='caption' color='text.secondary'>
                              computed: {row.computedQuantity.toFixed( 4 )}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td>{formatCurrency( row.wholesaleCost )}</td>
                      <td>{formatCurrency( row.retailCost )}</td>
                      <td>
                        {isOverridden && (
                          <Tooltip title='Revert to the computed value'>
                            <span>
                              <IconButton size='small' disabled={isPending} onClick={() => handleRevert( row.factor.id )}>
                                <i className='ri-arrow-go-back-line' />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  )
                } )}
              </tbody>
            </table>
          </div>
        </div>
      ) )}

      <div className='flex flex-wrap justify-end gap-6'>
        <Typography variant='body2' color='text.secondary'>
          Wholesale ({costs.wholesaleProfileName || 'Wholesale'}): <strong>{formatCurrency( costs.wholesaleTotal )}</strong>
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Retail ({costs.retailProfileName || 'Retail'}): <strong>{formatCurrency( costs.retailTotal )}</strong>
        </Typography>
      </div>
    </div>
  )
}
