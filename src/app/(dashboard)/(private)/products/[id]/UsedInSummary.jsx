'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import UsedInReviewDialog from './UsedInReviewDialog'

// "Used as a material in N products" line on the Overview tab, with a
// Review button that opens the checklist popup.
export default function UsedInSummary( {product, count} )
{
  const [open, setOpen] = useState( false )

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <Typography>
        {count === 0
          ? 'Not listed in any other product’s bill of materials.'
          : `Listed in the bill of materials of ${count} other product${count === 1 ? '' : 's'}.`}
      </Typography>
      <Button variant='outlined' size='small' onClick={() => setOpen( true )} startIcon={<i className='ri-list-check-3' />}>
        Review
      </Button>
      <UsedInReviewDialog open={open} setOpen={setOpen} product={product} />
    </div>
  )
}
