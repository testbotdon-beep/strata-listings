import { NextResponse } from 'next/server'

// Photo upload is temporarily disabled.
// It previously used Vercel Blob, but we've migrated primary storage to
// Upstash Redis (the Blob free-tier quota was exhausted by testing).
// Image hosting needs a dedicated object store — that's a follow-up.
// Until then, new listings use a placeholder image.
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Photo upload is temporarily disabled while we migrate storage. Listings will use a default image for now.',
    },
    { status: 503 }
  )
}
