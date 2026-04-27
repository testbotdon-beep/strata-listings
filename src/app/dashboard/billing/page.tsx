import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isStripeConfigured } from '@/lib/stripe'
import { getListingQuota, QUOTA_FREE, QUOTA_STRATA, PRICE_PER_EXTRA_LISTING_CENTS } from '@/lib/subscription'
import { BillingClient } from './billing-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    card_added?: string
    card_canceled?: string
    session_id?: string
    add_card?: string
  }>
}

export default async function BillingPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/billing')

  const params = await searchParams
  const quota = await getListingQuota(user)

  return (
    <BillingClient
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_status: user.subscription_status,
        subscription_source: user.subscription_source,
        stripe_customer_id: user.stripe_customer_id,
      }}
      quota={{
        used: quota.used,
        freeQuota: quota.freeQuota,
        isStrataSubscriber: quota.isStrataSubscriber,
        withinFreeQuota: quota.withinFreeQuota,
        nextChargeCents: quota.nextChargeCents,
      }}
      pricePerListingCents={PRICE_PER_EXTRA_LISTING_CENTS}
      quotaFree={QUOTA_FREE}
      quotaStrata={QUOTA_STRATA}
      stripeReady={isStripeConfigured()}
      cardAdded={params.card_added === '1'}
      cardCanceled={params.card_canceled === '1'}
      autoOpenAddCard={params.add_card === '1'}
      sessionId={params.session_id}
    />
  )
}
