import { NextRequest, NextResponse } from 'next/server'
import { saveInquiry, generateId, type StoredInquiry } from '@/lib/storage'
import { getListingById, getAgentById } from '@/lib/data'

interface LeadPayload {
  source: 'listing-inquiry' | 'agent-contact' | 'general-contact' | 'newsletter' | 'new-listing'
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

  // Resolve agent_id from listingId if not provided directly
  let agentId = body.agentId ?? null
  if (!agentId && body.listingId) {
    const listing = getListingById(body.listingId)
    if (listing) agentId = listing.agent_id
  }
  // Default to agent-1 (Sarah Chen) for general contact / newsletter so they
  // appear in *some* dashboard during demo
  if (!agentId && body.source !== 'newsletter') {
    agentId = 'agent-1'
  }

  // Resolve agent name for display
  let agentName = body.agentName ?? null
  if (!agentName && agentId) {
    const agent = getAgentById(agentId)
    if (agent) agentName = agent.name
  }

  const inquiry: StoredInquiry = {
    id: generateId('inq'),
    listing_id: body.listingId ?? null,
    agent_id: agentId,
    agent_name: agentName,
    source: body.source,
    name: body.name ?? '(newsletter signup)',
    email: body.email,
    phone: body.phone ?? null,
    message: body.message ?? '(no message)',
    created_at: new Date().toISOString(),
  }

  // Server-side log (visible in Vercel logs)
  console.log(`[LEAD] ${inquiry.created_at} ${body.source}:`, JSON.stringify(inquiry))

  // Persist to Blob storage (so it shows up in agent dashboard)
  try {
    await saveInquiry(inquiry)
  } catch (err) {
    console.error('[api/lead] saveInquiry failed:', err)
    // Don't fail the request — still log + webhook
  }

  // Forward to webhook if configured (Slack/Discord/Zapier)
  const webhookUrl = process.env.LEAD_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New ${body.source} from ${inquiry.name}`,
          ...inquiry,
        }),
      })
    } catch (err) {
      console.error('[LEAD] Webhook failed:', err)
    }
  }

  return NextResponse.json({ success: true, id: inquiry.id })
}
