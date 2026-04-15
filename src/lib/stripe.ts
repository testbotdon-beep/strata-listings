import 'server-only'
import Stripe from 'stripe'

/**
 * Lazily-initialised Stripe client. Returns null if STRIPE_SECRET_KEY is
 * not set — the rest of the app handles this gracefully (Stripe checkout
 * shows a friendly "not configured" message).
 */
let _stripe: Stripe | null | undefined

export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    _stripe = null
    return null
  }
  _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' })
  return _stripe
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRICE_ID
}
