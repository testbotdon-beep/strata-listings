import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getListingQuota } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const quota = await getListingQuota(user)
  return NextResponse.json(quota)
}
