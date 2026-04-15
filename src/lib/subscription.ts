import 'server-only'
import type { StoredUser, SubscriptionStatus } from '@/lib/storage'

/**
 * Plan pricing. Single source of truth — referenced by the billing page,
 * /for-agents page, Stripe Checkout, and marketing copy.
 */
export const PLAN = {
  priceMonthly: 79,
  currency: 'SGD',
  name: 'Strata Listings Pro',
  tagline: "Unlimited listings on Singapore's newest property marketplace",
}

/**
 * Is this user allowed to publish listings right now?
 * Active means: paid via Stripe, activated via Strata subscription, or
 * manually activated by admin.
 */
export function hasActiveSubscription(
  user: Pick<StoredUser, 'subscription_status'> | null
): boolean {
  if (!user) return false
  return user.subscription_status === 'active'
}

/**
 * Human-readable subscription status for UI.
 */
export function subscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'Active'
    case 'trialing':
      return 'Activation required'
    case 'past_due':
      return 'Payment overdue'
    case 'cancelled':
      return 'Cancelled'
  }
}
