import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, updateUser } from '@/lib/storage'

/**
 * Manual activation for edge cases where an agent's Listings email
 * differs from their Strata email. Gated by ADMIN_TOKEN header.
 *
 * POST /api/admin/activate
 * Header: x-admin-token: <ADMIN_TOKEN>
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin endpoint not configured' },
      { status: 503 }
    )
  }

  const providedToken = request.headers.get('x-admin-token')
  if (providedToken !== adminToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const updated = await updateUser(user.id, {
    subscription_status: 'active',
    subscription_source: 'admin',
    subscription_activated_at: new Date().toISOString(),
  })

  console.log(`[admin/activate] Manually activated ${email}`)

  return NextResponse.json({
    success: true,
    user: {
      id: updated?.id,
      email: updated?.email,
      subscription_status: updated?.subscription_status,
      subscription_source: updated?.subscription_source,
    },
  })
}
