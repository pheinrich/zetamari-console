import Link from 'next/link'
import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { readSupplier } from '@/db/actions/supplier'
import { formatCurrency } from '../../products/productFormat'
import CustomAvatar from '@core/components/mui/Avatar'
import SupplierDetailActions from './SupplierDetailActions'

export default async function SupplierPage( {params} )
{
  const {id} = await params
  const supplier = await readSupplier( id, true )

  if( !supplier )
    return notFound()

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap items-center justify-between gap-6'>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light' color='primary' size={64} variant='rounded'>
                  <i className='ri-truck-line text-2xl' />
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h4'>{supplier.name}</Typography>
                  {supplier.email && <Typography color='text.secondary'>{supplier.email}</Typography>}
                </div>
              </div>
              <SupplierDetailActions supplier={supplier} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Details' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Phone</Typography>
                  <Typography>{supplier.phone || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant='body2' color='text.secondary'>Website</Typography>
                  <Typography>
                    {supplier.url ? <a href={supplier.url} target='_blank' rel='noreferrer'>{supplier.url}</a> : '—'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant='body2' color='text.secondary'>Address</Typography>
                  <Typography>{supplier.address || '—'}</Typography>
                </Grid>
                {supplier.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' color='text.secondary'>Notes</Typography>
                    <Typography>{supplier.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Products Priced by This Supplier' />
            <CardContent>
              {(!supplier.products || supplier.products.length === 0) ? (
                <Typography color='text.secondary'>Not linked to any products yet. Add pricing from a product&apos;s page.</Typography>
              ) : (
                <div className='flex flex-col gap-3'>
                  {supplier.products.map( (product) => (
                    <div key={product.SupplierProduct.id} className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex flex-col'>
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                        <Typography variant='caption' color='text.secondary'>{product.sku}</Typography>
                      </div>
                      <Typography color='text.secondary'>
                        {product.SupplierProduct.partNumber} · {formatCurrency( product.SupplierProduct.cost )}
                      </Typography>
                    </div>
                  ) )}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
