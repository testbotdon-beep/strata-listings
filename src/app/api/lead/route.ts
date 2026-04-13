import { NextRequest, NextResponse } from 'next/server'

interface LeadPayload {
  source: 'listing-inquiry' | 'agent-contact' | 'general-contact' | 'newsletter'
  name?: string
  email?: string
  phone?: string
  message?: string
  subject?: string
  listingId?: string
  agentId?: string
  agentName?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: LeadPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Basic validation
  if (!body.source) {
    return NextResponse.json({ error: 'Missing source' }, { status: 400 })
  }

  if (body.source !== 'newsletter') {
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 })
    }
    if (!body.message || !body.message.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
  }

  if (!body.email || !isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  // Server-side log (visible in Vercel logs)
  const timestamp = new Date().toISOString()
  console.log(`[LEAD] ${timestamp} ${body.source}:`, JSON.stringify(body))

  // Forward to webhook if configured (Slack/Discord/Zapier/etc.)
  const webhookUrl = process.env.LEAD_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New ${body.source} lead from ${body.name || body.email}`,
          ...body,
          timestamp,
        }),
      })
    } catch (err) {
      // Don't fail the request if webhook fails — lead is still logged
      console.error('[LEAD] Webhook failed:', err)
    }
  }

  return NextResponse.json({ success: true, timestamp })
}
