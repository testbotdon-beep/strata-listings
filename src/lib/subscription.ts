import 'server-only'
import { getListingsByAgent, type StoredUser, type SubscriptionStatus } from '@/lib/storage'

/**
 * Listings pricing. Pay-per-listing model — no monthly subscription.
 *   - Free quota: 5 listings (everyone)
 *   - Strata subscribers: 15 listings (bundled with Strata $60/mo)
 *   - Beyond quota: $10 per extra listing, charged off-session at post time
 */
export const QUOTA_FREE = 5
export const QUOTA_STRATA = 15
export const PRICE_PER_EXTRA_LISTING_CENTS = 1000 // $10 SGD

export type ListingQuota = {
  used: number
  freeQuota: number
  isStrataSubscriber: boolean
  /** True when next listing falls inside the free quota. */
  withinFreeQuota: boolean
  /** Cents that will be charged for the next listing (0 if free, 1000 otherwise). */
  nextChargeCents: number
}

/**
 * Returns the user's listing quota state. Used by:
 *   - /api/listings POST to decide whether to charge before saving
 *   - dashboard banner to nudge agents to add a card
 *   - /api/quota for client-side display
 */
export async function getListingQuota(
  user: Pick<StoredUser, 'id' | 'subscription_status' | 'subscription_source'> | null
): Promise<ListingQuota> {
  if (!user) {
    return {
      used: 0,
      freeQuota: 0,
      isStrataSubscriber: false,
      withinFreeQuota: false,
      nextChargeCents: 0,
    }
  }
  const listings = await getListingsByAgent(user.id)
  const used = listings.length
  const isStrataSubscriber =
    user.subscription_status === 'active' && user.subscription_source === 'strata_subscriber'
  const freeQuota = isStrataSubscriber ? QUOTA_STRATA : QUOTA_FREE
  const withinFreeQuota = used < freeQuota
  return {
    used,
    freeQuota,
    isStrataSubscriber,
    withinFreeQuota,
    nextChargeCents: withinFreeQuota ? 0 : PRICE_PER_EXTRA_LISTING_CENTS,
  }
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
