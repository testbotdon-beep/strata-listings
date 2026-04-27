import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import { getUserByEmail, saveUser, generateId, type StoredUser } from '@/lib/storage'
import { isActiveStrataSubscriber } from '@/lib/strata-membership'

/**
 * Mirror the Listings signup into the shared Strata Supabase project so
 * the same email + password works across the whole ecosystem.
 * Failures are non-fatal — Listings account still created. Cross-product
 * SSO can be backfilled later if Supabase is unreachable at this moment.
 */
async function mirrorToSupabase(email: string, password: string, name: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return
  const supabase = createClient(url, anon, { auth: { persistSession: false } })
  try {
    await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
  } catch (err) {
    console.error('[register] Supabase mirror failed:', err)
  }
}

interface RegisterPayload {
  email?: string
  password?: string
  name?: string
  agency?: string
  phone?: string
  license_no?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: RegisterPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, password, name, agency, phone, license_no } = body

  // Validation
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  if (!agency || !agency.trim()) {
    return NextResponse.json({ error: 'Agency required' }, { status: 400 })
  }
  if (!phone || !phone.trim()) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 })
  }

  // Check uniqueness
  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists' },
      { status: 409 }
    )
  }

  const password_hash = await bcrypt.hash(password, 10)

  // Generate an avatar URL from the name seed
  const seed = encodeURIComponent(name.split(' ')[0])
  const photo_url = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4`

  const normalizedEmail = email.toLowerCase().trim()

  // Check if this email belongs to an active Strata subscriber.
  // If yes, auto-activate their Listings account free — they're paying for
  // Strata so they get Listings bundled. Real-time check against Stripe,
  // cached for 5 minutes.
  const strataCheck = await isActiveStrataSubscriber(normalizedEmail)
  const isStrataSubscriber = strataCheck.isActiveSubscriber

  const user: StoredUser = {
    id: generateId('agent'),
    email: normalizedEmail,
    password_hash,
    name: name.trim(),
    agency: agency.trim(),
    phone: phone.trim(),
    license_no: license_no?.trim() || '',
    photo_url,
    bio: '',
    strata_agent_id: null,
    // If this email matches a paying Strata subscriber, activate immediately.
    // Otherwise they land in 'trialing' and must subscribe to $79/mo Listings.
    subscription_status: isStrataSubscriber ? 'active' : 'trialing',
    subscription_source: isStrataSubscriber ? 'strata_subscriber' : null,
    stripe_customer_id: strataCheck.stripeCustomerId,
    stripe_subscription_id: null,
    subscription_activated_at: isStrataSubscriber ? new Date().toISOString() : null,
    subscription_ends_at: null,
    created_at: new Date().toISOString(),
  }

  try {
    await saveUser(user)
  } catch (err) {
    console.error('[api/register] saveUser failed:', err)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }

  // Mirror to Supabase so the same email+password works on Strata/PropReels/ReelMaker.
  // Non-fatal: if it fails, the Listings account still works; SSO back-fills next attempt.
  void mirrorToSupabase(normalizedEmail, password, user.name)

  console.log(`[REGISTER] New agent: ${user.email} (${user.id})`)

  // Don't return password_hash
  const { password_hash: _ph, ...safe } = user
  void _ph
  return NextResponse.json({ success: true, user: safe })
}
