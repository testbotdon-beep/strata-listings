import 'server-only'
import { getStripe } from '@/lib/stripe'

/**
 * Checks whether an email belongs to an actively-paying Strata AI subscriber.
 *
 * How: queries Stripe's customer database (Strata and Strata Listings both
 * bill through the same Stripe account). If we find a customer with that
 * email AND they have an active subscription to one of Strata's price IDs
 * (listed in STRATA_STRIPE_PRICE_IDS), they're an eligible Strata subscriber.
 *
 * This is the single source of truth — there's no whitelist, no promo code,
 * no way to fake it. If you're paying Strata, you're in. If you're not,
 * you're not. Cancelling Strata automatically revokes free Listings access.
 */

interface StrataCheckResult {
  isActiveSubscriber: boolean
  stripeCustomerId: string | null
  matchedPriceId: string | null
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { result: StrataCheckResult; at: number }>()

/**
 * Parse STRATA_STRIPE_PRICE_IDS env var. Format: comma-separated price IDs.
 * Strips any stray whitespace or literal "\n" sequences.
 */
function getStrataPriceIds(): Set<string> {
  const raw = process.env.STRATA_STRIPE_PRICE_IDS || ''
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().replace(/\\n$/, ''))
      .filter((s) => s.startsWith('price_'))
  )
}

export async function isActiveStrataSubscriber(
  email: string
): Promise<StrataCheckResult> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) {
    return { isActiveSubscriber: false, stripeCustomerId: null, matchedPriceId: null }
  }

  // Cache
  const cached = cache.get(normalized)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.result
  }

  const stripe = getStripe()
  if (!stripe) {
    // Stripe not configured — can't check, assume not a subscriber
    return { isActiveSubscriber: false, stripeCustomerId: null, matchedPriceId: null }
  }

  const strataPriceIds = getStrataPriceIds()
  if (strataPriceIds.size === 0) {
    // No Strata price IDs configured — can't check
    return { isActiveSubscriber: false, stripeCustomerId: null, matchedPriceId: null }
  }

  try {
    // 1. Find the Stripe customer by email
    const customers = await stripe.customers.list({
      email: normalized,
      limit: 5, // emails can technically have multiple customer records
    })

    if (customers.data.length === 0) {
      const result: StrataCheckResult = {
        isActiveSubscriber: false,
        stripeCustomerId: null,
        matchedPriceId: null,
      }
      cache.set(normalized, { result, at: Date.now() })
      return result
    }

    // 2. Check each customer's active subscriptions for a Strata price id
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 10,
      })

      for (const sub of subs.data) {
        for (const item of sub.items.data) {
          const priceId = item.price.id
          if (strataPriceIds.has(priceId)) {
            const result: StrataCheckResult = {
              isActiveSubscriber: true,
              stripeCustomerId: customer.id,
              matchedPriceId: priceId,
            }
            cache.set(normalized, { result, at: Date.now() })
            return result
          }
        }
      }
    }

    // Customer exists but no active Strata subscription
    const result: StrataCheckResult = {
      isActiveSubscriber: false,
      stripeCustomerId: customers.data[0].id,
      matchedPriceId: null,
    }
    cache.set(normalized, { result, at: Date.now() })
    return result
  } catch (err) {
    console.error('[strata-membership] Stripe query failed:', err)
    // On error, fail CLOSED — don't grant free access
    return { isActiveSubscriber: false, stripeCustomerId: null, matchedPriceId: null }
  }
}

/** Invalidate cache for a specific email (e.g. after admin actions) */
export function invalidateStrataCache(email: string): void {
  cache.delete(email.trim().toLowerCase())
}
