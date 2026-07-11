// Third-party Imports
import { auth } from '@/lib/auth'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children }) {
  const session = await auth()

  return <>{session ? children : <AuthRedirect />}</>
}
