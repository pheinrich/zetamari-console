import LiveClassForm from '../LiveClassForm'
import { readLocations } from '@/db/actions/liveClass'

export default async function NewLiveClassPage()
{
  const locationOptions = await readLocations()

  return <LiveClassForm locationOptions={locationOptions} />
}
