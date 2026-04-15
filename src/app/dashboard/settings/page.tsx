import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in?callbackUrl=/dashboard/settings')

  const { password_hash: _ph, ...safe } = user
  void _ph
  return <SettingsForm user={safe} />
}
