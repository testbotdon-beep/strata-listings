import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactPayload {
  name?: string
  email?: string
  message?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: ContactPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim()
  const message = body.message?.trim()

  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  // Server-side log — visible in Vercel logs so nothing is ever lost,
  // even if Resend is down or not yet configured.
  console.log(`[CONTACT] ${new Date().toISOString()} from ${name} <${email}>: ${message}`)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Still succeed so the user sees a friendly confirmation — the message
    // is captured in Vercel logs and we can recover it if needed.
    console.warn('[CONTACT] RESEND_API_KEY not set; message logged only')
    return NextResponse.json({ success: true })
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'Strata Listings <noreply@uqlabs.co>',
      to: ['kevan@uqlabs.co'],
      replyTo: email,
      subject: `New contact form — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;color:#0f172a">
          <h2 style="margin:0 0 16px;font-size:18px">New contact form submission</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 16px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <div style="padding:16px;background:#f8fafc;border-left:3px solid #3b82f6;border-radius:6px;white-space:pre-wrap">${escapeHtml(message)}</div>
          <p style="margin:24px 0 0;font-size:12px;color:#64748b">Sent from listings.uqlabs.co/contact</p>
        </div>
      `,
    })

    if (error) {
      console.error('[CONTACT] Resend error:', error)
      return NextResponse.json(
        { error: 'Could not send message. Please email kevan@uqlabs.co directly.' },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error('[CONTACT] Resend exception:', err)
    return NextResponse.json(
      { error: 'Could not send message. Please email kevan@uqlabs.co directly.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
