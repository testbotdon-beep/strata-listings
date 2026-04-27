'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubscriptionStatus } from '@/lib/storage'

interface BillingUser {
  id: string
  email: string
  name: string
  subscription_status: SubscriptionStatus
  subscription_source: 'strata_subscriber' | 'stripe' | 'admin' | null
  subscription_activated_at: string | null
}

interface Plan {
  priceMonthly: number
  priceMonthlyOriginal: number
  priceYearly: number
  currency: string
  name: string
  tagline: string
  yearlyDiscountPct: number
}

interface Props {
  user: BillingUser
  plan: Plan
  stripeReady: boolean
  success: boolean
  canceled: boolean
}

export function BillingClient({
  user,
  plan,
  stripeReady,
  success,
  canceled,
}: Props) {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [recheckLoading, setRecheckLoading] = useState(false)
  const [recheckResult, setRecheckResult] = useState<
    | { type: 'success'; message: string }
    | { type: 'info'; message: string }
    | null
  >(null)

  const isActive = user.subscription_status === 'active'

  // Clear the ?success=1 from URL after showing the success banner
  useEffect(() => {
    if (success || canceled) {
      const t = setTimeout(() => {
        router.replace('/dashboard/billing')
      }, 100)
      return () => clearTimeout(t)
    }
  }, [success, canceled, router])

  async function handleStripeCheckout() {
    setStripeLoading(true)
    setStripeError(null)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing_period: billingPeriod }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStripeError(data.error || 'Could not start checkout')
        setStripeLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setStripeError('Network error. Please try again.')
      setStripeLoading(false)
    }
  }

  async function handleRecheck() {
    setRecheckLoading(true)
    setRecheckResult(null)
    try {
      const res = await fetch('/api/billing/recheck', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.activated) {
        setRecheckResult({
          type: 'success',
          message: 'Strata subscription found! Your account is now active.',
        })
        setTimeout(() => router.refresh(), 700)
      } else if (res.ok && !data.activated) {
        setRecheckResult({
          type: 'info',
          message:
            'We couldn\'t find an active Strata subscription for this email. If you just subscribed, give it a minute and try again.',
        })
      } else {
        setRecheckResult({
          type: 'info',
          message: data.error || 'Could not check subscription status.',
        })
      }
    } catch {
      setRecheckResult({ type: 'info', message: 'Network error. Please try again.' })
    } finally {
      setRecheckLoading(false)
    }
  }

  const sourceLabel =
    user.subscription_source === 'strata_subscriber'
      ? 'Strata AI subscriber (free)'
      : user.subscription_source === 'stripe'
        ? 'Monthly subscription'
        : user.subscription_source === 'admin'
          ? 'Activated by admin'
          : '—'

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Plan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your Strata Listings subscription.
        </p>
      </div>

      {/* Success / Canceled banners from Stripe redirect */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900">Payment successful!</p>
            <p className="text-emerald-700 mt-0.5">
              Your subscription is active. You can now publish listings.
            </p>
          </div>
        </div>
      )}
      {canceled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Checkout canceled</p>
            <p className="text-amber-700 mt-0.5">
              No payment was taken. Try again when you&apos;re ready.
            </p>
          </div>
        </div>
      )}

      {/* Current status card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Current plan
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {isActive ? plan.name : 'No active subscription'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <span
            className={
              isActive
                ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                : 'inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
            }
          >
            {isActive ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                Activation required
              </>
            )}
          </span>
        </div>

        {isActive && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Activated</p>
              <p className="font-medium text-slate-900">
                {user.subscription_activated_at
                  ? new Date(user.subscription_activated_at).toLocaleDateString(
                      'en-SG',
                      { day: 'numeric', month: 'short', year: 'numeric' }
                    )
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Source</p>
              <p className="font-medium text-slate-900">{sourceLabel}</p>
            </div>
          </div>
        )}
      </div>

      {/* Activation section — only if not active */}
      {!isActive && (
        <>
          {/* Plan pricing card */}
          <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 p-5 sm:p-8">
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {plan.name}
                </p>
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  Launch price
                </span>
              </div>

              {/* Billing period toggle */}
              <div className="mt-4 inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={
                    billingPeriod === 'monthly'
                      ? 'rounded-full bg-white px-3 py-1.5 text-slate-900 shadow-sm'
                      : 'px-3 py-1.5 text-slate-500'
                  }
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={
                    billingPeriod === 'yearly'
                      ? 'rounded-full bg-white px-3 py-1.5 text-slate-900 shadow-sm inline-flex items-center gap-1.5'
                      : 'px-3 py-1.5 text-slate-500 inline-flex items-center gap-1.5'
                  }
                >
                  Yearly
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold">
                    -{plan.yearlyDiscountPct}%
                  </span>
                </button>
              </div>

              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                  $
                  {billingPeriod === 'yearly'
                    ? Math.round(plan.priceYearly / 12)
                    : plan.priceMonthly}
                </span>
                <span className="text-base text-slate-500">/month</span>
                <span className="text-xs text-slate-400 line-through">
                  ${plan.priceMonthlyOriginal}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {billingPeriod === 'yearly'
                  ? `Billed yearly at $${plan.priceYearly}/year — save ${plan.yearlyDiscountPct}%`
                  : 'Billed monthly. Switch to yearly for 10% off.'}
              </p>
              <p className="mt-2 text-sm text-slate-600">{plan.tagline}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {[
                '15 listings (vs 5 on the free tier)',
                'Agent profile page with all your listings',
                'WhatsApp click-to-chat on every listing',
                'Listing views + inquiry analytics',
                'SEO-optimised listing pages',
                'District, MRT, and PSF search placement',
                'No commission on closed deals',
                'Cancel anytime',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleStripeCheckout}
              disabled={stripeLoading || !stripeReady}
              className="w-full h-12 text-sm font-semibold gap-2"
            >
              {stripeLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to secure checkout…
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  {billingPeriod === 'yearly'
                    ? `Subscribe for $${plan.priceYearly}/year`
                    : `Subscribe for $${plan.priceMonthly}/month`}
                </>
              )}
            </Button>

            {!stripeReady && (
              <p className="mt-3 text-xs text-center text-slate-500">
                Card payment will be enabled shortly.
              </p>
            )}

            {stripeError && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {stripeError}
              </div>
            )}

            <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure payment via Stripe · Cancel anytime
            </p>
          </div>

          {/* Strata subscriber recheck card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-slate-900">
                Already paying for Strata AI?
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Strata Listings is included free with your Strata AI subscription.
              We check automatically using your email{' '}
              <span className="font-semibold text-slate-900">{user.email}</span>
              . If you just subscribed to Strata, click below to re-check.
            </p>

            {recheckResult && (
              <div
                className={
                  recheckResult.type === 'success'
                    ? 'mb-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800'
                    : 'mb-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700'
                }
              >
                {recheckResult.message}
              </div>
            )}

            <Button
              onClick={handleRecheck}
              disabled={recheckLoading}
              variant="outline"
              className="w-full h-10 gap-2"
            >
              {recheckLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking Stripe…
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Recheck Strata subscription
                </>
              )}
            </Button>

            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Not on Strata but using a different email?{' '}
              <a
                href="mailto:hello@strata-listings.sg?subject=Link%20Strata%20account"
                className="text-primary underline underline-offset-2"
              >
                Contact support
              </a>{' '}
              and we&apos;ll link your accounts manually.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
