import { NextRequest, NextResponse } from 'next/server'
import { buildListing, saveListing, getUserById, type NewListingPayload } from '@/lib/storage'
import type { ListingType, PropertyType, FurnishingLevel } from '@/types/listing'
import { auth } from '@/lib/auth'
import { hasActiveSubscription } from '@/lib/subscription'

const VALID_TYPES: ListingType[] = ['rent', 'sale']
const VALID_PROPERTY_TYPES: PropertyType[] = ['hdb', 'condo', 'landed', 'commercial']
const VALID_FURNISHING: FurnishingLevel[] = ['unfurnished', 'partial', 'fully']

// POST /api/listings
// Creates a new listing in Vercel Blob storage.
// Currently uses agent_id from the request (no auth yet — Supabase Auth is the next step).
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Subscription gate — only active agents can publish listings
  const user = await getUserById(session.user.id)
  if (!hasActiveSubscription(user)) {
    return NextResponse.json(
      {
        error:
          'Your account is not active. Subscribe or apply a promo code to publish listings.',
        code: 'subscription_required',
      },
      { status: 402 }
    )
  }

  let body: Partial<NewListingPayload>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Validation
  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!body.description || body.description.length < 20) {
    return NextResponse.json(
      { error: 'Description is required (min 20 chars)' },
      { status: 400 }
    )
  }
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    return NextResponse.json(
      { error: 'type must be "rent" or "sale"' },
      { status: 400 }
    )
  }
  if (!body.property_type || !VALID_PROPERTY_TYPES.includes(body.property_type)) {
    return NextResponse.json({ error: 'Invalid property_type' }, { status: 400 })
  }
  if (!body.price || body.price <= 0) {
    return NextResponse.json({ error: 'price must be positive' }, { status: 400 })
  }
  if (typeof body.bedrooms !== 'number' || body.bedrooms < 0) {
    return NextResponse.json({ error: 'bedrooms required' }, { status: 400 })
  }
  if (typeof body.bathrooms !== 'number' || body.bathrooms < 0) {
    return NextResponse.json({ error: 'bathrooms required' }, { status: 400 })
  }
  if (!body.sqft || body.sqft <= 0) {
    return NextResponse.json({ error: 'sqft required' }, { status: 400 })
  }
  if (!body.address || !body.address.trim()) {
    return NextResponse.json({ error: 'address required' }, { status: 400 })
  }
  if (!body.district || body.district < 1 || body.district > 28) {
    return NextResponse.json({ error: 'district must be 1-28' }, { status: 400 })
  }
  if (!body.furnishing || !VALID_FURNISHING.includes(body.furnishing)) {
    return NextResponse.json({ error: 'Invalid furnishing' }, { status: 400 })
  }

  // Authenticated agent id from session (can't be spoofed by the client)
  const agentId = session.user.id

  const listing = buildListing({
    agent_id: agentId,
    type: body.type,
    property_type: body.property_type,
    title: body.title.trim(),
    description: body.description.trim(),
    price: body.price,
    price_psf: body.price_psf,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    sqft: body.sqft,
    address: body.address.trim(),
    district: body.district,
    postal_code: body.postal_code || '',
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
    photos: Array.isArray(body.photos) ? body.photos : [],
    furnishing: body.furnishing,
    floor_level: body.floor_level,
    tenure: body.tenure,
    top_year: body.top_year,
    mrt_nearest: body.mrt_nearest,
    mrt_distance_m: body.mrt_distance_m,
    status: body.status === 'draft' ? 'draft' : 'active',
  })

  try {
    await saveListing(listing)
  } catch (err) {
    console.error('[api/listings] save failed:', err)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }

  console.log(`[LISTING CREATED] ${listing.id} by ${agentId}`)
  return NextResponse.json({ success: true, listing })
}
