import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUser } from '@/lib/storage'
import {
  isActiveStrataSubscriber,
  invalidateStrataCache,
} from '@/lib/strata-membership'

export async function POST() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  // Don't override paying Stripe subscribers or admin-activated users.
  if (
    user.subscription_source === 'stripe' ||
    user.subscription_source === 'admin'
  ) {
    return NextResponse.json({
      activated: user.subscription_status === 'active',
      status: user.subscription_status,
    })
  }

  // Force a fresh query — bypass the 5-min cache since the user
  // just clicked "Recheck" and probably subscribed seconds ago.
  invalidateStrataCache(user.email)

  const check = await isActiveStrataSubscriber(user.email)

  if (check.isActiveSubscriber) {
    if (user.subscription_status !== 'active') {
      await updateUser(user.id, {
        subscription_status: 'active',
        subscription_source: 'strata_subscriber',
        subscription_activated_at: new Date().toISOString(),
        stripe_customer_id: check.stripeCustomerId,
      })
    }
    return NextResponse.json({ activated: true, status: 'active' })
  }

  // No active Strata sub found. If the user was previously activated
  // as a Strata subscriber but cancelled, revoke free access.
  if (
    user.subscription_source === 'strata_subscriber' &&
    user.subscription_status === 'active'
  ) {
    await updateUser(user.id, {
      subscription_status: 'trialing',
      subscription_activated_at: null,
    })
    return NextResponse.json({ activated: false, status: 'trialing' })
  }

  return NextResponse.json({
    activated: false,
    status: user.subscription_status,
  })
}
