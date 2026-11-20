'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { deleteProductAlias } from '@/db/actions/productAlias'
import { channelLabel } from '../channel-orders/channelOrderFormat'

// Channel SKUs that also mean this product (Product Aliases), learned when
// a channel order line is matched by hand. Removing one only stops future
// matches - lines it already matched keep their product.
export default function ProductAliasesCard( {aliases} )
{
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function remove( alias )
  {
    startTransition( async () => {
      await deleteProductAlias( alias.id )
      toast.success( `${alias.sku} no longer matches this product` )
      router.refresh()
    } )
  }

  return (
    <Card>
      <CardHeader title='Channel SKUs' subheader='Other SKUs channel orders use for this product' />
      <CardContent className='flex flex-wrap gap-2'>
        {aliases.length
          ? aliases.map( alias => (
            <Chip
              key={alias.id}
              variant='tonal'
              label={alias.sku}
              title={alias.channel ? `First seen on ${channelLabel( alias.channel )}` : undefined}
              onDelete={isPending ? undefined : () => remove( alias )}
            />
          ) )
          : <Typography color='text.secondary'>None</Typography>}
      </CardContent>
    </Card>
  )
}
