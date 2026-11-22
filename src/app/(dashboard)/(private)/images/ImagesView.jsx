'use client'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import ImageLibrary from '@/components/images/ImageLibrary'

export default function ImagesView( {images} )
{
  const router = useRouter()

  return (
    <Card>
      <CardHeader title='Images' subheader='Every product image. Images can be shared by several products; double-click one to open it.' />
      <CardContent>
        <ImageLibrary images={images} onChanged={() => router.refresh()} tableHeight={600} />
      </CardContent>
    </Card>
  )
}
