import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { readProductOptions, readUnmatchedLines } from '@/db/actions/channelOrder'
import tableStyles from '@core/styles/table.module.css'
import { buyerLabel, channelLabel, money } from '../channelOrderFormat'
import LineProductPicker from '../LineProductPicker'

// Every unmatched line on a Channel Order still under review, across
// orders, ordered by channel SKU so repeats sit together - matching one
// with "remember" matches the rest with that SKU (see LineProductPicker).
export default async function UnmatchedLinesPage()
{
  const [lines, products] = await Promise.all( [readUnmatchedLines(), readProductOptions()] )

  return (
    <Card>
      <CardHeader
        title='Unmatched lines'
        subheader={`${lines.length} line${lines.length === 1 ? '' : 's'} on new channel orders with no product yet`}
        action={<Link href='/channel-orders'>All channel orders</Link>}
      />
      {lines.length ? (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr><th>Channel SKU</th><th>Description</th><th>Order</th><th>Qty</th><th>Unit price</th><th>Product</th></tr>
            </thead>
            <tbody>
              {lines.map( line => (
                <tr key={line.id}>
                  <td>{line.sku || '—'}</td>
                  <td>{line.description || '—'}</td>
                  <td>
                    <Link href={`/channel-orders/${line.ChannelOrder.id}`}>{channelLabel( line.ChannelOrder.channel )} #{line.ChannelOrder.externalOrderId}</Link>
                    <Typography variant='body2' color='text.secondary'>{buyerLabel( line.ChannelOrder )}</Typography>
                  </td>
                  <td>{line.quantity ?? '—'}</td>
                  <td>{money( line.unitPrice )}</td>
                  <td><LineProductPicker line={line} products={products} editable /></td>
                </tr>
              ) )}
            </tbody>
          </table>
        </div>
      ) : (
        <CardContent><Typography color='text.secondary'>Every line on a new channel order has a product.</Typography></CardContent>
      )}
    </Card>
  )
}
