import { NextRequest, NextResponse } from 'next/server'
import { buildListing, saveListing, getUserById, type NewListingPayload } from '@/lib/storage'
import type { ListingType, PropertyType, FurnishingLevel } from '@/types/listing'
import { auth } from '@/lib/auth'
import { getListingQuota, PRICE_PER_EXTRA_LISTING_CENTS } from '@/lib/subscription'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

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

  // Quota gate. 5 free for everyone, 15 free for Strata subs, $10/listing after.
  const user = await getUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const quota = await getListingQuota(user)
  let chargedCents = 0

  if (!quota.withinFreeQuota) {
    // Over the free quota: must charge before saving.
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Billing not available right now. Please try again later.', code: 'stripe_unavailable' },
        { status: 503 }
      )
    }
    if (!user.stripe_customer_id) {
      return NextResponse.json(
        {
          error: `You've used all ${quota.freeQuota} free listings. Add a card to publish more at $10 each.`,
          code: 'card_required',
          quota,
        },
        { status: 402 }
      )
    }

    const stripe = getStripe()!
    let customer
    try {
      customer = await stripe.customers.retrieve(user.stripe_customer_id)
    } catch {
      return NextResponse.json(
        { error: 'Could not load your billing profile.', code: 'card_required', quota },
        { status: 402 }
      )
    }
    const defaultPm =
      !customer.deleted && customer.invoice_settings?.default_payment_method
    if (!defaultPm) {
      return NextResponse.json(
        {
          error: `You've used all ${quota.freeQuota} free listings. Add a card to publish more at $10 each.`,
          code: 'card_required',
          quota,
        },
        { status: 402 }
      )
    }

    // Off-session charge for the next listing slot.
    try {
      const intent = await stripe.paymentIntents.create({
        amount: PRICE_PER_EXTRA_LISTING_CENTS,
        currency: 'sgd',
        customer: user.stripe_customer_id,
        payment_method: typeof defaultPm === 'string' ? defaultPm : defaultPm.id,
        off_session: true,
        confirm: true,
        description: `Listings — extra listing slot (#${quota.used + 1})`,
        metadata: {
          user_id: user.id,
          listing_index: String(quota.used + 1),
          product: 'strata-listings',
        },
      })
      if (intent.status !== 'succeeded') {
        return NextResponse.json(
          {
            error: 'Card was declined. Update your card on file and try again.',
            code: 'card_declined',
            quota,
          },
          { status: 402 }
        )
      }
      chargedCents = PRICE_PER_EXTRA_LISTING_CENTS
    } catch (err) {
      console.error('[api/listings] charge failed:', err)
      return NextResponse.json(
        {
          error: 'Card was declined. Update your card on file and try again.',
          code: 'card_declined',
          quota,
        },
        { status: 402 }
      )
    }
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
    available_from: body.available_from,
    lease_term_months: body.lease_term_months,
    pets_allowed: body.pets_allowed,
    cooking_allowed: body.cooking_allowed,
    hdb_type: body.hdb_type,
    negotiable: body.negotiable,
    facing: body.facing,
    parking_lots: body.parking_lots,
    balcony: body.balcony,
    property_condition: body.property_condition,
    listing_reference: body.listing_reference,
    co_broke: body.co_broke,
    status: body.status === 'draft' ? 'draft' : 'active',
  })

  try {
    await saveListing(listing)
  } catch (err) {
    console.error('[api/listings] save failed:', err)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }

  console.log(`[LISTING CREATED] ${listing.id} by ${agentId} charged=${chargedCents}c`)
  return NextResponse.json({ success: true, listing, charged_cents: chargedCents })
}
