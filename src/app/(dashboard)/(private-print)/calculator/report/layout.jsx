import Providers from '@components/Providers'
import AuthGuard from '@/hocs/AuthGuard'

// Applies to /calculator/report and /calculator/report/lightbox. These
// pages live in a sibling route group to (private) - not inside it -
// because (private)/layout.jsx bakes the dashboard chrome (nav, navbar,
// footer via LayoutWrapper/VerticalLayout) together with the auth check
// in one file; a nested layout under (private) can only add more
// wrapping, it can't remove what the parent already applied. Report
// pages are meant to print cleanly (and not show dashboard chrome even
// on screen), so this layout reuses the same Providers (MUI theme, Redux,
// NextAuth session context) and AuthGuard as (private) - same login
// requirement - but skips LayoutWrapper/VerticalLayout/Navigation/Navbar/
// Footer entirely rather than trying to hide them with print CSS.
export default async function ReportLayout( {children} )
{
  return (
    <Providers direction='ltr'>
      <AuthGuard>
        {children}
      </AuthGuard>
    </Providers>
  )
}
