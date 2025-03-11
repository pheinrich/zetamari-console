import AuthProvider from '@/components/AuthProvider'

export default function RootLayout( {children} )
{
  return (
    <AuthProvider>
      <html lang='en'>
        <body>{children}</body>
      </html>
    </AuthProvider>
  )
}
