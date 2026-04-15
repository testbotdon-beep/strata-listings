import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, saveUser, generateId, type StoredUser } from '@/lib/storage'

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

  const user: StoredUser = {
    id: generateId('agent'),
    email: email.toLowerCase().trim(),
    password_hash,
    name: name.trim(),
    agency: agency.trim(),
    phone: phone.trim(),
    license_no: license_no?.trim() || '',
    photo_url,
    bio: '',
    strata_agent_id: null,
    created_at: new Date().toISOString(),
  }

  try {
    await saveUser(user)
  } catch (err) {
    console.error('[api/register] saveUser failed:', err)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }

  console.log(`[REGISTER] New agent: ${user.email} (${user.id})`)

  // Don't return password_hash
  const { password_hash: _ph, ...safe } = user
  void _ph
  return NextResponse.json({ success: true, user: safe })
}
