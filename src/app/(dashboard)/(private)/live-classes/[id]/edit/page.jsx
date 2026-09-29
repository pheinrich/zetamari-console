import { notFound } from 'next/navigation'
import LiveClassForm from '../../LiveClassForm'
import { readLiveClass, readLiveClassLocations } from '@/db/actions/liveClass'

export default async function EditLiveClassPage( {params} )
{
  const {id} = await params

  const [liveClass, locationOptions] = await Promise.all([
    readLiveClass( id ),
    readLiveClassLocations(),
  ])

  if( !liveClass )
    return notFound()

  return <LiveClassForm initialData={liveClass} locationOptions={locationOptions} />
}
