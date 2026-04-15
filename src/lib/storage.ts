import 'server-only'
import { Redis } from '@upstash/redis'
import type {
  Listing,
  ListingType,
  PropertyType,
  FurnishingLevel,
} from '@/types/listing'

// ─── UPSTASH CLIENT ────────────────────────────────────────
// Env vars use the `storage_` prefix set during Vercel Marketplace install.
const redis = new Redis({
  url: process.env.storage_KV_REST_API_URL!,
  token: process.env.storage_KV_REST_API_TOKEN!,
})

// ─── KEY SCHEMA ────────────────────────────────────────────
const K = {
  listing: (id: string) => `listing:${id}`,
  listingIds: 'listings:all',
  listingsByAgent: (agentId: string) => `listings:agent:${agentId}`,

  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email.toLowerCase()}`,
  userIds: 'users:all',

  inquiry: (id: string) => `inquiry:${id}`,
  inquiriesByAgent: (agentId: string) => `inquiries:agent:${agentId}`,
  inquiryIds: 'inquiries:all',
}

// ─── TYPES ─────────────────────────────────────────────────

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled'

export interface StoredUser {
  id: string
  email: string
  password_hash: string
  name: string
  agency: string
  phone: string
  license_no: string
  photo_url: string
  bio: string
  strata_agent_id: string | null
  // Billing / subscription
  subscription_status: SubscriptionStatus
  subscription_source: 'promo' | 'stripe' | null
  promo_code_used: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_activated_at: string | null
  subscription_ends_at: string | null
  created_at: string
}

export interface StoredListing extends Omit<Listing, 'agent'> {
  agent_id: string
}

export interface StoredInquiry {
  id: string
  listing_id: string | null
  agent_id: string | null
  agent_name: string | null
  source: 'listing-inquiry' | 'agent-contact' | 'general-contact' | 'newsletter' | 'new-listing'
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

// ─── USERS ──────────────────────────────────────────────────

export async function saveUser(user: StoredUser): Promise<void> {
  // Pipeline: write the user JSON, the email index, and add to the users set atomically
  const pipe = redis.pipeline()
  pipe.set(K.user(user.id), user)
  pipe.set(K.userByEmail(user.email), user.id)
  pipe.sadd(K.userIds, user.id)
  await pipe.exec()
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  return (await redis.get<StoredUser>(K.user(id))) ?? null
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const id = await redis.get<string>(K.userByEmail(email))
  if (!id) return null
  return getUserById(id)
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const ids = await redis.smembers(K.userIds)
  if (ids.length === 0) return []
  const results = await redis.mget<(StoredUser | null)[]>(...ids.map((i) => K.user(i)))
  return results.filter((u): u is StoredUser => u !== null)
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<StoredUser, 'id' | 'email' | 'password_hash' | 'created_at'>>
): Promise<StoredUser | null> {
  const current = await getUserById(id)
  if (!current) return null
  const updated: StoredUser = { ...current, ...patch }
  await saveUser(updated)
  return updated
}

// ─── LISTINGS ───────────────────────────────────────────────

export async function saveListing(listing: StoredListing): Promise<void> {
  const pipe = redis.pipeline()
  pipe.set(K.listing(listing.id), listing)
  pipe.sadd(K.listingIds, listing.id)
  pipe.sadd(K.listingsByAgent(listing.agent_id), listing.id)
  await pipe.exec()
}

export async function getStoredListing(id: string): Promise<StoredListing | null> {
  return (await redis.get<StoredListing>(K.listing(id))) ?? null
}

export async function getStoredListings(): Promise<StoredListing[]> {
  const ids = await redis.smembers(K.listingIds)
  if (ids.length === 0) return []
  const results = await redis.mget<(StoredListing | null)[]>(...ids.map((i) => K.listing(i)))
  return results.filter((l): l is StoredListing => l !== null)
}

export async function getListingsByAgent(agentId: string): Promise<StoredListing[]> {
  const ids = await redis.smembers(K.listingsByAgent(agentId))
  if (ids.length === 0) return []
  const results = await redis.mget<(StoredListing | null)[]>(...ids.map((i) => K.listing(i)))
  return results.filter((l): l is StoredListing => l !== null)
}

export async function deleteListing(id: string): Promise<void> {
  const listing = await getStoredListing(id)
  if (!listing) return
  const pipe = redis.pipeline()
  pipe.del(K.listing(id))
  pipe.srem(K.listingIds, id)
  pipe.srem(K.listingsByAgent(listing.agent_id), id)
  await pipe.exec()
}

// ─── INQUIRIES ──────────────────────────────────────────────

export async function saveInquiry(inquiry: StoredInquiry): Promise<void> {
  const pipe = redis.pipeline()
  pipe.set(K.inquiry(inquiry.id), inquiry)
  pipe.sadd(K.inquiryIds, inquiry.id)
  if (inquiry.agent_id) {
    pipe.sadd(K.inquiriesByAgent(inquiry.agent_id), inquiry.id)
  }
  await pipe.exec()
}

export async function getStoredInquiries(filter?: {
  agentId?: string
}): Promise<StoredInquiry[]> {
  const key = filter?.agentId
    ? K.inquiriesByAgent(filter.agentId)
    : K.inquiryIds
  const ids = await redis.smembers(key)
  if (ids.length === 0) return []
  const results = await redis.mget<(StoredInquiry | null)[]>(...ids.map((i) => K.inquiry(i)))
  return results
    .filter((i): i is StoredInquiry => i !== null)
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

// ─── ID GENERATION ─────────────────────────────────────────

export function generateId(prefix: string): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${ts}-${rand}`
}

// ─── BUILD A LISTING FROM FORM PAYLOAD ─────────────────────

export interface NewListingPayload {
  agent_id: string
  type: ListingType
  property_type: PropertyType
  title: string
  description: string
  price: number
  price_psf?: number
  bedrooms: number
  bathrooms: number
  sqft: number
  address: string
  district: number
  postal_code: string
  amenities: string[]
  photos: string[]
  furnishing: FurnishingLevel
  floor_level?: string
  tenure?: string
  top_year?: number
  mrt_nearest?: string
  mrt_distance_m?: number
  status: 'active' | 'draft'
  featured?: boolean
}

export function buildListing(payload: NewListingPayload): StoredListing {
  const now = new Date().toISOString()
  return {
    id: generateId('listing'),
    agent_id: payload.agent_id,
    type: payload.type,
    property_type: payload.property_type,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    price_psf: payload.price_psf ?? null,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    sqft: payload.sqft,
    address: payload.address,
    district: payload.district,
    postal_code: payload.postal_code,
    lat: 0,
    lng: 0,
    amenities: payload.amenities,
    photos:
      payload.photos.length > 0
        ? payload.photos
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
          ],
    floor_plan_url: null,
    furnishing: payload.furnishing,
    floor_level: payload.floor_level ?? null,
    tenure: payload.tenure ?? null,
    top_year: payload.top_year ?? null,
    mrt_nearest: payload.mrt_nearest ?? null,
    mrt_distance_m: payload.mrt_distance_m ?? null,
    status: payload.status,
    featured: payload.featured ?? false,
    views: 0,
    created_at: now,
    updated_at: now,
  }
}
