import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.storage_KV_REST_API_URL!,
  token: process.env.storage_KV_REST_API_TOKEN!,
})

const MAX_SIZE = 500 * 1024 // 500KB after base64

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { data: string; name: string; type: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.data || !body.type) {
    return NextResponse.json({ error: 'Missing data or type' }, { status: 400 })
  }

  const base64 = body.data.replace(/^data:[^;]+;base64,/, '')
  if (base64.length > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Image too large. Please use images under 500KB.' },
      { status: 413 }
    )
  }

  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const key = `photo:${id}`

  await redis.set(key, JSON.stringify({ data: base64, type: body.type }), { ex: 365 * 24 * 60 * 60 })

  const url = `/api/photos/${id}`

  return NextResponse.json({ url })
}
