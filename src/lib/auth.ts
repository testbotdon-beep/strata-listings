import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import { getUserByEmail, getUserById, updateUser, saveUser, type StoredUser } from '@/lib/storage'
import { isActiveStrataSubscriber } from '@/lib/strata-membership'

/**
 * Try authenticating against the Strata Supabase project. Returns a Listings user
 * if the credentials match a Strata account (provisioning a Listings record on
 * the fly when one doesn't yet exist). Returns null otherwise.
 */
async function trySupabaseLogin(email: string, password: string): Promise<StoredUser | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null

  const supabase = createClient(url, anon, { auth: { persistSession: false } })
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data?.user) return null

  const normalized = email.toLowerCase().trim()
  let listingsUser = await getUserByEmail(normalized)
  if (!listingsUser) {
    const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>
    const name = (meta.full_name as string) || normalized.split('@')[0]
    const seed = encodeURIComponent(name.split(' ')[0])

    const strataCheck = await isActiveStrataSubscriber(normalized).catch(() => ({
      isActiveSubscriber: false,
      stripeCustomerId: null,
    }))

    listingsUser = {
      id: `agent_${data.user.id}`,
      email: normalized,
      // Random unmatchable hash. This user authenticates via Supabase, never bcrypt.
      password_hash: '$2b$10$strataAuthOnlyDoNotUseThisHashEver000000000000000000000',
      name,
      agency: '',
      phone: '',
      license_no: '',
      photo_url: `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4`,
      bio: '',
      strata_agent_id: null,
      subscription_status: strataCheck.isActiveSubscriber ? 'active' : 'trialing',
      subscription_source: strataCheck.isActiveSubscriber ? 'strata_subscriber' : null,
      stripe_customer_id: strataCheck.stripeCustomerId,
      stripe_subscription_id: null,
      subscription_activated_at: strataCheck.isActiveSubscriber ? new Date().toISOString() : null,
      subscription_ends_at: null,
      created_at: new Date().toISOString(),
    }
    await saveUser(listingsUser)
  }
  return listingsUser
}

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

        // 1. Try Strata (Supabase) first — single password works across the suite.
        // If it matches, we get/provision a Listings user record by email.
        const strataUser = await trySupabaseLogin(email, password)
        if (strataUser) {
          return {
            id: strataUser.id,
            name: strataUser.name,
            email: strataUser.email,
            image: strataUser.photo_url,
          }
        }

        // 2. Fallback: existing Listings-only account with bcrypt password.
        const user = await getUserByEmail(email)
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) return null

        // Re-check Strata subscription status on every sign-in. Catches two cases:
        //  (a) Agent subscribed to Strata AFTER registering on Listings → unlock
        //  (b) Agent cancelled Strata → revert to trialing (paywall)
        // Only acts when the user's current state disagrees with Stripe, to
        // avoid unnecessary writes. Never overrides an admin/stripe source.
        try {
          const strataCheck = await isActiveStrataSubscriber(user.email)
          const shouldBeActive = strataCheck.isActiveSubscriber
          const isStrataSource =
            user.subscription_source === 'strata_subscriber' ||
            user.subscription_source === null
          // Don't override a user who's paying Listings directly via Stripe,
          // or one who was manually activated by admin.
          if (
            isStrataSource &&
            shouldBeActive &&
            user.subscription_status !== 'active'
          ) {
            await updateUser(user.id, {
              subscription_status: 'active',
              subscription_source: 'strata_subscriber',
              subscription_activated_at: new Date().toISOString(),
              stripe_customer_id: strataCheck.stripeCustomerId,
            })
          } else if (
            user.subscription_source === 'strata_subscriber' &&
            !shouldBeActive &&
            user.subscription_status === 'active'
          ) {
            // Strata sub cancelled — revoke free Listings access
            await updateUser(user.id, {
              subscription_status: 'trialing',
              subscription_activated_at: null,
            })
          }
        } catch (err) {
          // Never fail the login because of a Strata check error
          console.error('[auth] Strata re-check failed:', err)
        }

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
