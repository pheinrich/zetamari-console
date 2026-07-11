// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
import { auth } from '@/lib/auth'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports

const GuestOnlyRoute = async ({ children }) => {
  const session = await auth()

  if (session) {
    redirect(themeConfig.homePageUrl)
  }

  return <>{children}</>
}

export default GuestOnlyRoute
