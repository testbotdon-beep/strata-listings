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
  tagline: 'Unlimited listings on Singapore\'s newest property marketplace',
}

/**
 * Is this user allowed to publish listings right now?
 * Active means: paid via Stripe, or activated via promo code.
 */
export function hasActiveSubscription(user: Pick<StoredUser, 'subscription_status'> | null): boolean {
  if (!user) return false
  return user.subscription_status === 'active'
}

/**
 * Parse PROMO_CODES env var into a Set of uppercase codes.
 * Format: `CODE1,CODE2,CODE3` (comma-separated, whitespace-trimmed).
 * Default fallback: the STRATA demo code so the system works even if env
 * var isn't set.
 */
export function getValidPromoCodes(): Set<string> {
  const raw = process.env.PROMO_CODES || 'STRATA,STRATADEMO'
  return new Set(
    raw
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean)
  )
}

export function isValidPromoCode(code: string): boolean {
  const codes = getValidPromoCodes()
  return codes.has(code.trim().toUpperCase())
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
