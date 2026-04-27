import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

// Auth-only gate. Quota enforcement (free=5 / strata=15 / $10 per extra) is
// handled at /api/listings POST so the user can fill the form and only hit
// the paywall on submit. This avoids redirect ping-pong if they have a card.
export default async function NewListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/listings/new')
  return <>{children}</>
}
