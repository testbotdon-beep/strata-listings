import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { getUserById, updateUser } from '@/lib/storage'

/**
 * Creates a Stripe Checkout Session for the $79/mo subscription and
 * returns the session URL. Client redirects the browser to it.
 *
 * If Stripe isn't configured yet (no STRIPE_SECRET_KEY env var), returns
 * a 503 so the UI can show a friendly "coming soon" state.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured yet. Please contact support.',
      },
      { status: 503 }
    )
  }

  const stripe = getStripe()!
  const user = await getUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Resolve base URL from request
  const origin =
    request.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://listings.uqlabs.co'

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/billing?canceled=1`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          user_email: user.email,
        },
      },
    })

    // Save the customer id if Stripe created one (first session)
    if (checkoutSession.customer && typeof checkoutSession.customer === 'string') {
      await updateUser(user.id, {
        stripe_customer_id: checkoutSession.customer,
      })
    }

    return NextResponse.json({
      url: checkoutSession.url,
      session_id: checkoutSession.id,
    })
  } catch (err) {
    console.error('[api/billing/checkout] failed:', err)
    return NextResponse.json(
      { error: 'Could not create checkout session' },
      { status: 500 }
    )
  }
}
