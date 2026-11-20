'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import { toggleProductSellable, toggleProductStatus } from '@/db/actions/product'
import { productTypeMeta } from '../ProductTypeMeta'
import EditProductSummaryDialog from './EditProductSummaryDialog'
import DeleteProductDialog from './DeleteProductDialog'

// Left-hand pane of the product page: picture (or type icon), name, SKU,
// type/visibility/sellability chips (the latter two click to toggle), and
// the description, with Edit/Duplicate/Delete under a corner menu -
// modeled on the template's apps/user/view UserDetails card.
export default function ProductHero( {product} )
{
  const router = useRouter()
  const [editOpen, setEditOpen] = useState( false )
  const [deleteOpen, setDeleteOpen] = useState( false )
  const [isToggling, startToggle] = useTransition()

  const meta = productTypeMeta( product.type )
  const visible = product.status !== 'hidden'

  function toggle( action, message )
  {
    if( isToggling )
      return

    startToggle( async () => {
      try
      {
        await action()
        router.refresh()
      }
      catch( err )
      {
        toast.error( message )
      }
    })
  }

  return (
    <Card className='relative'>
      <div className='absolute block-start-4 inline-end-4'>
        <OptionMenu
          iconButtonProps={{ size: 'medium' }}
          iconClassName='text-textSecondary text-[22px]'
          options={[
            {
              text: 'Edit',
              icon: 'ri-edit-box-line',
              menuItemProps: { className: 'gap-2', onClick: () => setEditOpen( true ) },
            },
            {
              text: 'Duplicate',
              icon: 'ri-file-copy-line',
              href: `/products/new?from=${product.id}`,
              // OptionMenu forces the MenuItem to p-0 when `href` is set, so
              // the spacing lives on the Link wrapper (see ProductListTable).
              linkProps: { className: 'flex items-center is-full gap-2 plb-2 pli-4' },
            },
            { divider: true },
            {
              text: 'Delete',
              icon: 'ri-delete-bin-7-line',
              menuItemProps: { className: 'gap-2 text-error', onClick: () => setDeleteOpen( true ) },
            },
          ]}
        />
      </div>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex items-center justify-center flex-col gap-4'>
          {product.primaryImage ? (
            <img
              src={product.primaryImage.url}
              alt={product.primaryImage.altText || product.name}
              width={120}
              height={120}
              className='rounded bg-actionHover object-cover'
            />
          ) : (
            <CustomAvatar skin='light' color={meta.color} size={120} variant='rounded'>
              <i className={classnames( meta.icon, 'text-[56px]' )} />
            </CustomAvatar>
          )}
          <div className='flex flex-col items-center gap-1'>
            <Typography variant='h5' className='text-center'>{product.name}</Typography>
            <Typography color='text.secondary'>{product.sku}</Typography>
          </div>
          <div className='flex flex-wrap justify-center gap-2'>
            <Chip label={meta.label} size='small' variant='tonal' color={meta.color ?? 'default'} />
            <Tooltip title={visible ? 'Click to hide' : 'Click to make visible'}>
              <Chip
                label={visible ? 'Visible' : 'Hidden'}
                size='small'
                variant='tonal'
                color={visible ? 'success' : 'secondary'}
                onClick={() => toggle( () => toggleProductStatus( product.id, !visible ), 'Failed to change visibility' )}
              />
            </Tooltip>
            <Tooltip title={product.sellable ? 'Click to make material only' : 'Click to make sellable'}>
              <Chip
                label={product.sellable ? 'Sellable' : 'Material Only'}
                size='small'
                variant='tonal'
                color={product.sellable ? 'primary' : 'secondary'}
                onClick={() => toggle( () => toggleProductSellable( product.id, !product.sellable ), 'Failed to change sellability' )}
              />
            </Tooltip>
          </div>
        </div>

        <div>
          <Divider className='mbe-4' />
          {product.description ? (
            <Typography className='whitespace-pre-line'>{product.description}</Typography>
          ) : (
            <Typography color='text.disabled'>No description.</Typography>
          )}
        </div>
      </CardContent>

      <EditProductSummaryDialog open={editOpen} setOpen={setEditOpen} product={product} />
      <DeleteProductDialog open={deleteOpen} setOpen={setDeleteOpen} product={product} />
    </Card>
  )
}
