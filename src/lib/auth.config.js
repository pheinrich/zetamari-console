// Edge-safe piece of the NextAuth (Auth.js v5) config: no providers, no
// database access. Kept separate from auth.js so that anything which only
// needs to *read* a session (and must stay Edge-compatible, e.g. future
// middleware) never pulls in Sequelize/mysql2, which use Node APIs the Edge
// runtime doesn't support. This project currently gates access via the
// AuthGuard/GuestOnlyRoute server components rather than middleware, but
// keeping this split avoids painting us into a corner if that changes.
export const authConfig = {
  pages: { signIn: '/login' },
  providers: [],
  session: { strategy: 'jwt' },
}
