import NextAuth, { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import User from '@/db/models/User.js'
import sequelize from '@/db/sequelize.js'

export const authOptions =
{
  providers:
  [
    CredentialsProvider(
      {
        name: 'Credentials',
        credentials:
        {
          email: {label: 'Email', type: 'email', placeholder: 'you@example.com'},
          password: {label: 'Password', type: 'password'}
      },
      async authorize( credentials )
      {
        if( !credentials?.email || !credentials?.password )
          throw new Error( 'Email and password are required' )
 
        await sequelize.sync()
        const user = await User.findOne( {where: {email: credentials.email}} )

        if( !user || !(await bcrypt.compare( credentials.password, user.password )) )
          throw new Error( 'Invalid credentials' )

        return {id: user.id, email: user.email, name: user.name}
      }
    })
  ],
  pages:
  {
    signIn: '/login', // Custom login page (optional)
  },
  callbacks:
  {
    async jwt( {token, user} )
    {
      if( user )
        token.id = user.id

      return token
    },
    async session( {session, token} )
    {
      if( token )
        session.user.id = token.id

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export function auth( ...args )
{
  return getServerSession( ...args, authOptions )
}

export const handler = NextAuth( authOptions )
