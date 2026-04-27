'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  AlertCircle,
  ShieldCheck,
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
  stripe_customer_id: string | null
}

interface QuotaState {
  used: number
  freeQuota: number
  isStrataSubscriber: boolean
  withinFreeQuota: boolean
  nextChargeCents: number
}

interface CardStatus {
  hasCard: boolean
  brand?: string | null
  last4?: string | null
  exp_month?: number | null
  exp_year?: number | null
}

interface Props {
  user: BillingUser
  quota: QuotaState
  pricePerListingCents: number
  quotaFree: number
  quotaStrata: number
  stripeReady: boolean
  cardAdded: boolean
  cardCanceled: boolean
  autoOpenAddCard: boolean
  sessionId?: string
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

export function BillingClient({
  user,
  quota,
  pricePerListingCents,
  quotaFree,
  quotaStrata,
  stripeReady,
  cardAdded,
  cardCanceled,
  autoOpenAddCard,
  sessionId,
}: Props) {
  const router = useRouter()
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [cardStatus, setCardStatus] = useState<CardStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  const pricePerListing = formatPrice(pricePerListingCents)

  // Load card status
  useEffect(() => {
    let cancelled = false
    fetch('/api/billing/card-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        if (d) setCardStatus(d)
        setStatusLoading(false)
      })
      .catch(() => {
        if (!cancelled) setStatusLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // After Stripe Setup Checkout returns, finalize the card and clean URL
  useEffect(() => {
    if (!cardAdded || !sessionId) return
    fetch('/api/billing/finalize-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(() => fetch('/api/billing/card-status'))
      .then((r) => r.json())
      .then((d) => setCardStatus(d))
      .catch(() => {})
      .finally(() => {
        const t = setTimeout(() => router.replace('/dashboard/billing'), 200)
        return () => clearTimeout(t)
      })
  }, [cardAdded, sessionId, router])

  async function handleAddCard() {
    setSetupLoading(true)
    setSetupError(null)
    try {
      const res = await fetch('/api/billing/setup-card', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setSetupError(data.error || 'Could not open card setup')
        setSetupLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setSetupError('Network error. Please try again.')
      setSetupLoading(false)
    }
  }

  // Auto-open card setup if user landed here from a quota-exceeded redirect
  useEffect(() => {
    if (autoOpenAddCard && stripeReady && !cardAdded && cardStatus && !cardStatus.hasCard) {
      handleAddCard()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAddCard, stripeReady, cardStatus, cardAdded])

  const remainingFree = Math.max(0, quota.freeQuota - quota.used)

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Listings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pay only for the listings you publish past your free quota.
        </p>
      </div>

      {cardAdded && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900">Card added.</p>
            <p className="text-emerald-700 mt-0.5">
              You can now publish more listings — {pricePerListing} each.
            </p>
          </div>
        </div>
      )}
      {cardCanceled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Card setup canceled.</p>
            <p className="text-amber-700 mt-0.5">No card was saved. Try again when you&apos;re ready.</p>
          </div>
        </div>
      )}

      {/* Plan summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Plan</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {quota.isStrataSubscriber ? 'Strata bundle' : 'Free tier'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          {quota.isStrataSubscriber && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Strata AI subscriber
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Free this month</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {quota.freeQuota}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Used</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{quota.used}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          {quota.withinFreeQuota
            ? `${remainingFree} free listing${remainingFree === 1 ? '' : 's'} remaining. Beyond that, ${pricePerListing} per listing, charged to your card on file.`
            : `You've used all ${quota.freeQuota} free listings. Each new listing costs ${pricePerListing}, charged when you publish.`}
        </p>

        {!quota.isStrataSubscriber && (
          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm font-semibold text-slate-900">
              Strata AI subscribers get {quotaStrata} free listings included.
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              Strata is $60/month — comes with WhatsApp AI lead handling, free posting on PropReels, and 5 free reels/month on ReelMaker.
            </p>
            <a
              href="https://strata.uqlabs.co"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              Subscribe to Strata →
            </a>
          </div>
        )}
      </div>

      {/* Card on file */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">Card on file</h2>
        </div>

        {statusLoading ? (
          <div className="h-12 animate-pulse rounded bg-slate-100" />
        ) : cardStatus?.hasCard ? (
          <>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex h-8 w-12 items-center justify-center rounded bg-white border border-slate-200 text-xs font-bold uppercase">
                {cardStatus.brand}
              </div>
              <div className="text-sm">
                <p className="font-medium text-slate-900">•••• {cardStatus.last4}</p>
                <p className="text-xs text-slate-500">
                  Expires {String(cardStatus.exp_month).padStart(2, '0')}/{cardStatus.exp_year}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleAddCard}
              disabled={setupLoading || !stripeReady}
              className="mt-3 w-full h-10 gap-2"
            >
              {setupLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Opening secure checkout…</>
              ) : (
                <>Replace card</>
              )}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4">
              No card saved. Add one to publish more than {quota.freeQuota} listings. You won&apos;t be charged unless you publish over the free quota.
            </p>
            <Button
              onClick={handleAddCard}
              disabled={setupLoading || !stripeReady}
              className="w-full h-12 text-sm font-semibold gap-2"
            >
              {setupLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Opening secure checkout…</>
              ) : (
                <><CreditCard className="h-4 w-4" />Add card on file</>
              )}
            </Button>
            {!stripeReady && (
              <p className="mt-3 text-xs text-center text-slate-500">
                Card payment will be enabled shortly.
              </p>
            )}
          </>
        )}

        {setupError && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {setupError}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Card stored securely with Stripe. We never see your card details.
        </p>
      </div>
    </div>
  )
}
