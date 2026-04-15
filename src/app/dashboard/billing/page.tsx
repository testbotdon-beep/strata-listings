import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isStripeConfigured } from '@/lib/stripe'
import { PLAN } from '@/lib/subscription'
import { BillingClient } from './billing-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    success?: string
    canceled?: string
    session_id?: string
  }>
}

export default async function BillingPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/billing')

  const params = await searchParams

  return (
    <BillingClient
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_status: user.subscription_status,
        subscription_source: user.subscription_source,
        promo_code_used: user.promo_code_used,
        subscription_activated_at: user.subscription_activated_at,
      }}
      plan={PLAN}
      stripeReady={isStripeConfigured()}
      success={params.success === '1'}
      canceled={params.canceled === '1'}
    />
  )
}
