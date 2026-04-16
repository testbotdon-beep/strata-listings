import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.storage_KV_REST_API_URL!,
  token: process.env.storage_KV_REST_API_TOKEN!,
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const raw = await redis.get<string>(`photo:${id}`)
  if (!raw) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let parsed: { data: string; type: string }
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw as unknown as { data: string; type: string }
  } catch {
    return NextResponse.json({ error: 'Corrupt data' }, { status: 500 })
  }

  const buffer = Buffer.from(parsed.data, 'base64')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': parsed.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
