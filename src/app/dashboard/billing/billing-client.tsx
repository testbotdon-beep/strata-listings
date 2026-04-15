'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Ticket,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SubscriptionStatus } from '@/lib/storage'

interface BillingUser {
  id: string
  email: string
  name: string
  subscription_status: SubscriptionStatus
  subscription_source: 'promo' | 'stripe' | null
  promo_code_used: string | null
  subscription_activated_at: string | null
}

interface Plan {
  priceMonthly: number
  currency: string
  name: string
  tagline: string
}

interface Props {
  user: BillingUser
  plan: Plan
  stripeReady: boolean
  success: boolean
  canceled: boolean
}

export function BillingClient({ user, plan, stripeReady, success, canceled }: Props) {
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

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

  async function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError(null)
    setPromoSuccess(null)
    try {
      const res = await fetch('/api/billing/promo-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPromoError(data.error || 'Could not apply promo code')
      } else {
        setPromoSuccess(data.message || 'Promo code applied!')
        // Refresh server data so the rest of the dashboard unlocks
        setTimeout(() => router.refresh(), 600)
      }
    } catch {
      setPromoError('Network error. Please try again.')
    } finally {
      setPromoLoading(false)
    }
  }

  async function handleStripeCheckout() {
    setStripeLoading(true)
    setStripeError(null)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
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
              No payment was taken. You can try again or use a promo code below.
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
                  ? new Date(user.subscription_activated_at).toLocaleDateString('en-SG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Source</p>
              <p className="font-medium text-slate-900 capitalize">
                {user.subscription_source === 'promo'
                  ? `Promo code (${user.promo_code_used})`
                  : user.subscription_source === 'stripe'
                    ? 'Monthly subscription'
                    : '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Activation section — only if not active */}
      {!isActive && (
        <>
          {/* Plan pricing card */}
          <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50 p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {plan.name}
                </p>
                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-base text-slate-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{plan.tagline}</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {[
                'Unlimited listings',
                'Unlimited agent profile page',
                'WhatsApp click-to-chat on every listing',
                'Listing view + inquiry analytics',
                'SEO-optimised listing pages',
                'District, MRT, and PSF search placement',
                'No commission on closed deals',
                'Cancel anytime',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
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
                  Subscribe for ${plan.priceMonthly}/month
                </>
              )}
            </Button>

            {!stripeReady && (
              <p className="mt-3 text-xs text-center text-slate-500">
                Card payment will be enabled soon. In the meantime, use a promo code below to activate your account.
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

          {/* Promo code card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-slate-900">Have a promo code?</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              If you&apos;re already a{' '}
              <span className="font-semibold text-slate-900">Strata AI</span>{' '}
              subscriber, enter your code below to activate Strata Listings for free.
            </p>

            {promoSuccess ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-900">{promoSuccess}</p>
                  <p className="text-emerald-700 text-xs mt-0.5">
                    Refreshing your account…
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Label htmlFor="promo-code" className="sr-only">
                    Promo code
                  </Label>
                  <Input
                    id="promo-code"
                    type="text"
                    placeholder="Enter code e.g. STRATA"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase())
                      if (promoError) setPromoError(null)
                    }}
                    className="h-11 uppercase tracking-wider font-mono"
                    autoComplete="off"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={promoLoading || !promoCode.trim()}
                  className="h-11 font-semibold gap-2 sm:w-auto"
                >
                  {promoLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Applying…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Apply code
                    </>
                  )}
                </Button>
              </form>
            )}

            {promoError && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {promoError}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
