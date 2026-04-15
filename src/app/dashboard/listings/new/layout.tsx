import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { hasActiveSubscription } from '@/lib/subscription'

// Subscription gate for the new-listing form. Unpaid agents get redirected
// to the billing page where they can subscribe.
export default async function NewListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/listings/new')
  if (!hasActiveSubscription(user)) redirect('/dashboard/billing')
  return <>{children}</>
}
