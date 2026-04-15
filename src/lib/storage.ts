import 'server-only'
import { put, list, del } from '@vercel/blob'
import type { Listing, Inquiry, ListingType, PropertyType, FurnishingLevel } from '@/types/listing'

// Vercel Blob is used as a simple JSON document store.
// Each entity is stored at a deterministic path:
//   listings/<id>.json
//   inquiries/<id>.json
//
// Reads list and fetch all blobs (acceptable for low volume — pre-launch
// inventory will be measured in the dozens). Writes are upsert via `put`.
//
// The data here PERSISTS across requests and deployments — unlike the
// in-memory mock data in lib/data.ts which we still merge with for seed
// content until real agents fill the catalogue.

const LISTINGS_PREFIX = 'listings/'
const INQUIRIES_PREFIX = 'inquiries/'
const USERS_PREFIX = 'users/'
const USERS_BY_EMAIL_PREFIX = 'users-by-email/'

// ─── USERS (AUTH) ──────────────────────────────────────────

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
  created_at: string
}

export async function saveUser(user: StoredUser): Promise<void> {
  // Write by id and by email (email lowercased) for lookup
  const byId = `${USERS_PREFIX}${user.id}.json`
  const byEmail = `${USERS_BY_EMAIL_PREFIX}${encodeURIComponent(user.email.toLowerCase())}.json`
  const payload = JSON.stringify(user)
  await Promise.all([
    put(byId, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    }),
    put(byEmail, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    }),
  ])
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  // Vercel Blob `list()` is eventually consistent — a just-written blob may
  // not appear for ~1 second. This is critical for register → auto-sign-in
  // flows. Retry twice with short backoff.
  const prefix = `${USERS_BY_EMAIL_PREFIX}${encodeURIComponent(email.toLowerCase())}`
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { blobs } = await list({ prefix })
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: 'no-store' })
        if (res.ok) return (await res.json()) as StoredUser
      }
    } catch (err) {
      console.error('[storage] getUserByEmail attempt', attempt, 'failed:', err)
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
  }
  return null
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  try {
    const { blobs } = await list({ prefix: `${USERS_PREFIX}${id}` })
    if (blobs.length === 0) return null
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as StoredUser
  } catch (err) {
    console.error('[storage] getUserById failed:', err)
    return null
  }
}

export async function getAllUsers(): Promise<StoredUser[]> {
  try {
    const { blobs } = await list({ prefix: USERS_PREFIX })
    if (blobs.length === 0) return []
    const results = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url, { cache: 'no-store' })
          if (!res.ok) return null
          return (await res.json()) as StoredUser
        } catch {
          return null
        }
      })
    )
    return results.filter((u): u is StoredUser => u !== null)
  } catch {
    return []
  }
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

// ─── LISTINGS ──────────────────────────────────────────────

export async function saveListing(listing: StoredListing): Promise<void> {
  const path = `${LISTINGS_PREFIX}${listing.id}.json`
  await put(path, JSON.stringify(listing), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function getStoredListings(): Promise<StoredListing[]> {
  try {
    const { blobs } = await list({ prefix: LISTINGS_PREFIX })
    if (blobs.length === 0) return []
    const results = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url, { cache: 'no-store' })
          if (!res.ok) return null
          return (await res.json()) as StoredListing
        } catch {
          return null
        }
      })
    )
    return results.filter((l): l is StoredListing => l !== null)
  } catch (err) {
    console.error('[storage] getStoredListings failed:', err)
    return []
  }
}

export async function getStoredListing(id: string): Promise<StoredListing | null> {
  const all = await getStoredListings()
  return all.find((l) => l.id === id) ?? null
}

export async function deleteListing(id: string): Promise<void> {
  const path = `${LISTINGS_PREFIX}${id}.json`
  try {
    await del(path)
  } catch (err) {
    console.error('[storage] deleteListing failed:', err)
  }
}

// ─── INQUIRIES ─────────────────────────────────────────────

export async function saveInquiry(inquiry: StoredInquiry): Promise<void> {
  const path = `${INQUIRIES_PREFIX}${inquiry.id}.json`
  await put(path, JSON.stringify(inquiry), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function getStoredInquiries(filter?: { agentId?: string }): Promise<StoredInquiry[]> {
  try {
    const { blobs } = await list({ prefix: INQUIRIES_PREFIX })
    if (blobs.length === 0) return []
    const results = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url, { cache: 'no-store' })
          if (!res.ok) return null
          return (await res.json()) as StoredInquiry
        } catch {
          return null
        }
      })
    )
    let inquiries = results.filter((i): i is StoredInquiry => i !== null)
    if (filter?.agentId) {
      inquiries = inquiries.filter((i) => i.agent_id === filter.agentId)
    }
    return inquiries.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (err) {
    console.error('[storage] getStoredInquiries failed:', err)
    return []
  }
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<StoredUser, 'id' | 'email' | 'password_hash' | 'created_at'>>
): Promise<StoredUser | null> {
  const current = await getUserById(id)
  if (!current) return null
  const updated: StoredUser = { ...current, ...patch }
  // Write to both by-id and by-email paths (email key is stable since we don't let it change)
  await saveUser(updated)
  return updated
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
    photos: payload.photos.length > 0
      ? payload.photos
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
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
