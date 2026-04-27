import 'server-only'
import { getListingsByAgent, type StoredUser, type SubscriptionStatus } from '@/lib/storage'

/**
 * Plan pricing. Single source of truth — referenced by the billing page,
 * /for-agents page, Stripe Checkout, and marketing copy.
 */
export const PLAN = {
  priceMonthly: 30,
  priceMonthlyOriginal: 60,
  priceYearly: 324,
  currency: 'SGD',
  name: 'Strata Listings Pro',
  tagline: '15 listings on Singapore\'s newest property marketplace',
  yearlyDiscountPct: 10,
}

/**
 * Listing quotas. Free tier for everyone, paid tier for non-Strata, and
 * Strata subscribers get the same as the paid tier bundled.
 */
export const QUOTA_FREE = 5
export const QUOTA_PAID = 15
export const QUOTA_STRATA = 15

export type ListingQuota = {
  used: number
  max: number
  remaining: number
  isPaid: boolean
  isStrataSubscriber: boolean
  canPost: boolean
}

/**
 * Returns the user's listing quota — how many they've posted, what their cap is,
 * and whether they can publish another. Quotas:
 *   - Free user (no sub):       5
 *   - Listings paid sub:       15
 *   - Strata AI subscriber:    15  (bundled, no separate Listings charge)
 *
 * Counted across active + draft (anything they've created counts).
 */
export async function getListingQuota(
  user: Pick<StoredUser, 'id' | 'subscription_status' | 'subscription_source'> | null
): Promise<ListingQuota> {
  if (!user) {
    return {
      used: 0,
      max: 0,
      remaining: 0,
      isPaid: false,
      isStrataSubscriber: false,
      canPost: false,
    }
  }
  const listings = await getListingsByAgent(user.id)
  const used = listings.length
  const isStrataSubscriber =
    user.subscription_status === 'active' && user.subscription_source === 'strata_subscriber'
  const isPaid = user.subscription_status === 'active' && user.subscription_source === 'stripe'
  const max = isStrataSubscriber ? QUOTA_STRATA : isPaid ? QUOTA_PAID : QUOTA_FREE
  return {
    used,
    max,
    remaining: Math.max(0, max - used),
    isPaid,
    isStrataSubscriber,
    canPost: used < max,
  }
}

/**
 * Legacy gate — kept for compatibility. Now matches "can post at all", which is
 * always true under the quota model since free tier exists. Use `getListingQuota`
 * for actual enforcement.
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
      return 'Free tier'
    case 'past_due':
      return 'Payment overdue'
    case 'cancelled':
      return 'Cancelled'
  }
}
