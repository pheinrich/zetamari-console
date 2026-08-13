import { notFound } from 'next/navigation'
import LiveClassForm from '../../LiveClassForm'
import { readLiveClass } from '@/db/actions/liveClass'

export default async function EditLiveClassPage( {params} )
{
  const {id} = await params
  const liveClass = await readLiveClass( id )

  if( !liveClass )
    return notFound()

  return <LiveClassForm initialData={liveClass} />
}
