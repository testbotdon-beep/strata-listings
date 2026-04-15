import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateUser } from '@/lib/storage'
import { isValidPromoCode } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const code = (body.code || '').trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Promo code is required' }, { status: 400 })
  }

  if (!isValidPromoCode(code)) {
    return NextResponse.json(
      { error: 'Invalid or expired promo code' },
      { status: 400 }
    )
  }

  // Activate the user via promo code
  const now = new Date().toISOString()
  const updated = await updateUser(session.user.id, {
    subscription_status: 'active',
    subscription_source: 'promo',
    promo_code_used: code,
    subscription_activated_at: now,
  })

  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  console.log(`[PROMO] ${session.user.id} activated with code ${code}`)

  return NextResponse.json({
    success: true,
    subscription_status: 'active',
    message: `Promo code "${code}" applied — your account is now active.`,
  })
}
