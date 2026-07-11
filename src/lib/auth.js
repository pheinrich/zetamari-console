// Auth.js v5 config. Route handlers and server components (all Node.js
// runtime, unlike middleware) import from here. The Credentials provider
// keeps calling the existing /api/login route rather than querying
// Sequelize directly - that route already does the real bcrypt-backed
// check against the Users table (src/app/api/login/route.js), so this
// preserves exactly what was already working rather than duplicating it.

import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { authConfig } from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize( credentials )
      {
        const { email, password } = credentials

        try
        {
          const res = await fetch( `${process.env.API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { email, password } ),
          })

          const data = await res.json()

          if( res.status === 401 )
            throw new Error( JSON.stringify( data ) )

          if( res.status === 200 )
            return data

          return null
        }
        catch( e )
        {
          throw new Error( e.message )
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt( {token, user} )
    {
      if( user )
      {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }

      return token
    },
    async session( {session, token} )
    {
      if( session.user )
      {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
      }

      return session
    },
  },
})
