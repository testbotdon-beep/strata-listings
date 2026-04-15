import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getAllUsers, updateUser } from '@/lib/storage'

/**
 * Stripe webhook receiver. Handles subscription lifecycle events so the
 * user's subscription_status in Redis stays in sync with Stripe.
 *
 * Events we care about:
 * - checkout.session.completed    → mark user 'active'
 * - customer.subscription.updated → update status
 * - customer.subscription.deleted → mark 'cancelled'
 * - invoice.payment_failed        → mark 'past_due'
 * - invoice.payment_succeeded     → mark 'active' (if was past_due)
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!whSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 })
  }

  const body = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[webhook] received: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id || session.metadata?.user_id
        if (!userId) {
          console.warn('[webhook] checkout.session.completed with no user_id')
          break
        }
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id ?? null

        await updateUser(userId, {
          subscription_status: 'active',
          subscription_source: 'stripe',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_activated_at: new Date().toISOString(),
        })
        console.log(`[webhook] activated user ${userId} via Stripe`)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) break
        const status =
          sub.status === 'active' || sub.status === 'trialing'
            ? 'active'
            : sub.status === 'past_due'
              ? 'past_due'
              : 'cancelled'
        await updateUser(userId, {
          subscription_status: status,
          stripe_subscription_id: sub.id,
        })
        console.log(`[webhook] user ${userId} → ${status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (userId) {
          await updateUser(userId, {
            subscription_status: 'cancelled',
            subscription_ends_at: new Date().toISOString(),
          })
        } else {
          // Fallback: search by subscription id
          const users = await getAllUsers()
          const target = users.find((u) => u.stripe_subscription_id === sub.id)
          if (target) {
            await updateUser(target.id, {
              subscription_status: 'cancelled',
              subscription_ends_at: new Date().toISOString(),
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        if (customerId) {
          const users = await getAllUsers()
          const target = users.find((u) => u.stripe_customer_id === customerId)
          if (target) {
            await updateUser(target.id, { subscription_status: 'past_due' })
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        if (customerId) {
          const users = await getAllUsers()
          const target = users.find((u) => u.stripe_customer_id === customerId)
          if (target && target.subscription_status === 'past_due') {
            await updateUser(target.id, { subscription_status: 'active' })
          }
        }
        break
      }
    }
  } catch (err) {
    console.error('[webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
