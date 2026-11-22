import { readImages } from '@/db/actions/productImage'

import ImagesView from './ImagesView'

// Inventory -> Images: the shared pool of product images.
export default async function ImagesPage()
{
  const images = await readImages()

  return <ImagesView images={images} />
}
