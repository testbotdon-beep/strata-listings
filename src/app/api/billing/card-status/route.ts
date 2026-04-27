import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { getUserById } from '@/lib/storage'

/** Returns whether the current user has a default payment method on file. */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const user = await getUserById(session.user.id)
  if (!user) return NextResponse.json({ hasCard: false })
  if (!isStripeConfigured() || !user.stripe_customer_id) {
    return NextResponse.json({ hasCard: false })
  }
  const stripe = getStripe()!
  try {
    const customer = await stripe.customers.retrieve(user.stripe_customer_id)
    if (customer.deleted) return NextResponse.json({ hasCard: false })
    const pm = customer.invoice_settings?.default_payment_method
    if (!pm) return NextResponse.json({ hasCard: false })
    const pmObj = typeof pm === 'string' ? await stripe.paymentMethods.retrieve(pm) : pm
    const card = pmObj.card
    return NextResponse.json({
      hasCard: true,
      brand: card?.brand ?? null,
      last4: card?.last4 ?? null,
      exp_month: card?.exp_month ?? null,
      exp_year: card?.exp_year ?? null,
    })
  } catch {
    return NextResponse.json({ hasCard: false })
  }
}
