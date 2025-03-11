import { auth } from '@/lib/auth'

export default async function Dashboard()
{
  const session = await auth()

  if( !session )
    return <p>You must be logged in to view this page.</p>
  
  return <h1>Welcome, {session.user.name}!</h1>
}
