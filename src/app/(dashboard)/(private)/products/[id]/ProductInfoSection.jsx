'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { productTypeMeta } from '../ProductTypeMeta'
import EditProductInfoDialog from './EditProductInfoDialog'

// The Overview tab's "<Type> Details" section: the server-rendered view
// (`children`) when the product has details recorded, an empty state
// otherwise, and an Add/Edit button opening the details popup.
export default function ProductInfoSection( {product, info, contourList, children} )
{
  const [open, setOpen] = useState( false )
  // Bumped on each open to remount the popup - see EditProductInfoDialog.
  const [openCount, setOpenCount] = useState( 0 )
  const label = productTypeMeta( product.type ).label

  function handleOpen()
  {
    setOpenCount( (n) => n + 1 )
    setOpen( true )
  }

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <Typography variant='h6'>{label} Details</Typography>
        <Button
          variant='outlined'
          size='small'
          onClick={handleOpen}
          startIcon={<i className={info ? 'ri-edit-box-line' : 'ri-add-line'} />}
        >
          {info ? 'Edit' : 'Add Details'}
        </Button>
      </div>
      <Divider className='mlb-4' />
      {info ? children : (
        <Typography color='text.secondary'>No {label.toLowerCase()} details recorded yet.</Typography>
      )}
      <EditProductInfoDialog
        key={openCount}
        open={open}
        setOpen={setOpen}
        product={product}
        info={info}
        contourList={contourList}
      />
    </div>
  )
}
