import { readCustomers } from '@/db/actions/customer'
import { readProducts } from '@/db/actions/product'
import OrderForm from '../OrderForm'

export default async function NewOrderPage()
{
  const [customers, products] = await Promise.all( [readCustomers(), readProducts()] )

  // Order lines are sellable end items, not raw materials (Product is a
  // unified Product/Material table - see Product.js's doc comment).
  const productOptions = products.filter( p => p.sellable )

  return <OrderForm customerOptions={customers} productOptions={productOptions} />
}
