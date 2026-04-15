import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail, getUserById } from '@/lib/storage'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null

        const user = await getUserByEmail(email)
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.photo_url,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: copy user id into token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Make user id available on session
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

/**
 * Helper to get the currently authenticated user's full profile from storage.
 * Returns null if not signed in.
 */
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return getUserById(session.user.id)
}
