import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { getUserById } from '@/lib/storage'

/**
 * Called after the Setup Checkout returns. Reads the SetupIntent attached to
 * the session and stores its PaymentMethod as the customer's default.
 * Idempotent — safe to call multiple times.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const { session_id } = (await request.json().catch(() => ({}))) as { session_id?: string }
  if (!session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 })
  }

  const stripe = getStripe()!
  const user = await getUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['setup_intent'],
  })
  const setupIntent = checkoutSession.setup_intent
  if (!setupIntent || typeof setupIntent === 'string') {
    return NextResponse.json({ error: 'Setup not completed' }, { status: 400 })
  }
  const pmId =
    typeof setupIntent.payment_method === 'string'
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id
  if (!pmId) {
    return NextResponse.json({ error: 'No payment method captured' }, { status: 400 })
  }
  if (!user.stripe_customer_id) {
    return NextResponse.json({ error: 'No customer on file' }, { status: 400 })
  }
  await stripe.customers.update(user.stripe_customer_id, {
    invoice_settings: { default_payment_method: pmId },
  })

  return NextResponse.json({ success: true })
}
