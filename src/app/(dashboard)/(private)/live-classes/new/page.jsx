import LiveClassForm from '../LiveClassForm'
import { readLiveClassLocations } from '@/db/actions/liveClass'

export default async function NewLiveClassPage()
{
  const locationOptions = await readLiveClassLocations()

  return <LiveClassForm locationOptions={locationOptions} />
}
