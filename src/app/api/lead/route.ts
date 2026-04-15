import { NextRequest, NextResponse } from 'next/server'
import { saveInquiry, generateId, type StoredInquiry, getUserById, getStoredListing } from '@/lib/storage'
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

  // Strata integration: if the agent is a Strata subscriber (has strata_agent_id),
  // forward the inquiry to Strata's API so it creates a WhatsApp lead in their
  // pipeline for instant AI qualification. This is the lock-in perk.
  const strataApiUrl = process.env.STRATA_API_URL
  if (body.source === 'listing-inquiry' && agentId && strataApiUrl) {
    try {
      // Resolve agent — try mock data first, then real stored users
      let strataAgent = getAgentById(agentId)
      if (!strataAgent) {
        const storedUser = await getUserById(agentId)
        if (storedUser) strataAgent = { ...storedUser, listings_count: 0 } as unknown as typeof strataAgent
      }

      if (strataAgent?.strata_agent_id) {
        // Resolve listing title — try mock data first, then real stored listings
        let listingForTitle = body.listingId ? getListingById(body.listingId) : null
        if (!listingForTitle && body.listingId) {
          const storedListing = await getStoredListing(body.listingId)
          if (storedListing) listingForTitle = storedListing as unknown as typeof listingForTitle
        }

        await fetch(`${strataApiUrl}/api/inquiries/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STRATA_API_KEY ?? ''}`,
          },
          body: JSON.stringify({
            strata_agent_id: strataAgent.strata_agent_id,
            buyer_name: inquiry.name,
            buyer_email: inquiry.email,
            buyer_phone: inquiry.phone,
            message: inquiry.message,
            listing_title: listingForTitle?.title,
            listing_url: `https://listings.uqlabs.co/listing/${body.listingId}`,
            source: 'strata-listings',
            external_id: inquiry.id,
          }),
        })

        console.log(`[LEAD] Forwarded to Strata for agent ${agentId} (strata_agent_id: ${strataAgent.strata_agent_id})`)
      }
    } catch (err) {
      console.error('[LEAD] Strata forwarding failed (non-fatal):', err)
    }
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
