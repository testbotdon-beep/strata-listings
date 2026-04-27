import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { getUserById, updateUser } from '@/lib/storage'

/**
 * Stripe Checkout Session in `setup` mode — captures a card, doesn't charge.
 * The card becomes the customer's default PaymentMethod, then any future
 * over-quota listing creation charges $10 off-session.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const stripe = getStripe()!
  const user = await getUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Reuse or create Stripe customer
  let customerId = user.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { user_id: user.id, product: 'strata-listings' },
    })
    customerId = customer.id
    await updateUser(user.id, { stripe_customer_id: customerId })
  }

  const origin =
    request.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://listings.uqlabs.co'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'setup',
    payment_method_types: ['card'],
    customer: customerId,
    success_url: `${origin}/dashboard/billing?card_added=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/billing?card_canceled=1`,
    metadata: { user_id: user.id, product: 'strata-listings' },
  })

  return NextResponse.json({ url: checkoutSession.url, session_id: checkoutSession.id })
}
