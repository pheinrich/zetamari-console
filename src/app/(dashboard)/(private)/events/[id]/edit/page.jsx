import { notFound } from 'next/navigation'
import EventForm from '../../EventForm'
import { readEvent } from '@/db/actions/event'

export default async function EditEventPage( {params} )
{
  const {id} = await params
  const event = await readEvent( id )

  if( !event )
    return notFound()

  return <EventForm initialData={event} />
}
