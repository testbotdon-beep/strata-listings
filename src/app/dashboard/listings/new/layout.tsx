import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getListingQuota } from '@/lib/subscription'

// Quota gate for the new-listing form. Free users get 5, paid get 15, Strata
// subs get 15. Anyone over their cap gets bounced to billing.
export default async function NewListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/listings/new')
  const quota = await getListingQuota(user)
  if (!quota.canPost) redirect('/dashboard/billing?quota_full=1')
  return <>{children}</>
}
