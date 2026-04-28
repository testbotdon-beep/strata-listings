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

    // Prefer the customer's default PM; fall back to any card on file.
    // Strata subs come out of subscription checkout with a PM attached to
    // the subscription but no customer-level default. We treat either as
    // 'has card' so the listing-charge route can use it later.
    let pmObj: import('stripe').Stripe.PaymentMethod | null = null
    const defaultPm = customer.invoice_settings?.default_payment_method
    if (defaultPm) {
      pmObj =
        typeof defaultPm === 'string'
          ? await stripe.paymentMethods.retrieve(defaultPm)
          : (defaultPm as import('stripe').Stripe.PaymentMethod)
    } else {
      const pms = await stripe.paymentMethods.list({
        customer: user.stripe_customer_id,
        type: 'card',
        limit: 1,
      })
      if (pms.data.length > 0) pmObj = pms.data[0]
    }

    if (!pmObj) return NextResponse.json({ hasCard: false })
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
