import { NextRequest, NextResponse } from 'next/server'
import { auth, getCurrentUser } from '@/lib/auth'
import { updateUser } from '@/lib/storage'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { password_hash: _ph, ...safe } = user
  void _ph
  return NextResponse.json(safe)
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Whitelist editable fields
  const patch: {
    name?: string; agency?: string; phone?: string;
    license_no?: string; bio?: string; photo_url?: string;
  } = {}

  if (typeof body.name === 'string') {
    if (!body.name.trim()) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
    patch.name = body.name.trim()
  }
  if (typeof body.agency === 'string') {
    if (!body.agency.trim()) return NextResponse.json({ error: 'Agency cannot be empty' }, { status: 400 })
    patch.agency = body.agency.trim()
  }
  if (typeof body.phone === 'string') {
    if (!body.phone.trim()) return NextResponse.json({ error: 'Phone cannot be empty' }, { status: 400 })
    patch.phone = body.phone.trim()
  }
  if (typeof body.license_no === 'string') patch.license_no = body.license_no.trim()
  if (typeof body.bio === 'string') patch.bio = body.bio.trim()
  if (typeof body.photo_url === 'string') patch.photo_url = body.photo_url.trim()

  const updated = await updateUser(session.user.id, patch)
  if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { password_hash: _ph, ...safe } = updated
  void _ph
  return NextResponse.json(safe)
}
