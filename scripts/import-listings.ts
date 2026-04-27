/**
 * Populate the Listings DB with realistic Singapore property listings to make
 * the marketplace look populated for launch.
 *
 * Run:
 *   npx tsx scripts/import-listings.ts
 *
 * Idempotent: tracks the import with a marker key in Redis, so re-runs are
 * skipped unless --force is passed.
 *
 * Notes:
 *   - All imported listings share a single agent_id (`agent_imported_propguru`)
 *     so Don can filter / bulk-delete them later.
 *   - Marker key: `listings:import:propguru:v1`.
 *   - We talk to Upstash Redis directly here (no `import 'server-only'` in
 *     scope), so this script can run from a plain Node context via tsx.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Redis } from '@upstash/redis'
import type {
  FurnishingLevel,
  HdbType,
  ListingType,
  PropertyType,
  Facing,
  PropertyCondition,
} from '../src/types/listing'

// ─── ENV LOADING ──────────────────────────────────────────────────────────
// We read .env.local manually so we don't pull in dotenv as a dep. Vercel
// stores some values wrapped as `N\n...\n` (newline-delimited list secrets);
// for our keys these are plain strings, but we strip the `N\n` prefix just in
// case.

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ENV_PATH = resolve(__dirname, '..', '.env.local')

function loadEnv(): void {
  const raw = readFileSync(ENV_PATH, 'utf8')
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    // Vercel-style `N\nfoo\n` wrapper for list-shaped secrets
    if (value.startsWith('N\\n')) value = value.slice(3)
    if (value.endsWith('\\n')) value = value.slice(0, -2)
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnv()

const REDIS_URL = process.env.storage_KV_REST_API_URL
const REDIS_TOKEN = process.env.storage_KV_REST_API_TOKEN
if (!REDIS_URL || !REDIS_TOKEN) {
  console.error('Missing storage_KV_REST_API_URL or storage_KV_REST_API_TOKEN in .env.local')
  process.exit(1)
}

const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN })

// ─── CONFIG ───────────────────────────────────────────────────────────────

const FORCE = process.argv.includes('--force')
const IMPORT_AGENT_ID = 'agent_imported_propguru'
const MARKER_KEY = 'listings:import:propguru:v1'

// ─── KEY SCHEMA (mirrors src/lib/storage.ts) ─────────────────────────────

const K = {
  listing: (id: string) => `listing:${id}`,
  listingIds: 'listings:all',
  listingsByAgent: (agentId: string) => `listings:agent:${agentId}`,
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email.toLowerCase()}`,
  userIds: 'users:all',
}

// ─── TYPES ────────────────────────────────────────────────────────────────
// Local mirrors of StoredUser / StoredListing so we don't import from
// `@/lib/storage` (which has a `server-only` guard).

type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled'

interface StoredUser {
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
  subscription_status: SubscriptionStatus
  subscription_source: 'strata_subscriber' | 'stripe' | 'admin' | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_activated_at: string | null
  subscription_ends_at: string | null
  created_at: string
}

interface StoredListing {
  id: string
  agent_id: string
  type: ListingType
  property_type: PropertyType
  title: string
  description: string
  price: number
  price_psf: number | null
  bedrooms: number
  bathrooms: number
  sqft: number
  address: string
  district: number
  postal_code: string
  lat: number
  lng: number
  amenities: string[]
  photos: string[]
  floor_plan_url: string | null
  furnishing: FurnishingLevel
  floor_level: string | null
  tenure: string | null
  top_year: number | null
  mrt_nearest: string | null
  mrt_distance_m: number | null
  status: 'active' | 'sold' | 'rented' | 'draft'
  featured: boolean
  views: number
  created_at: string
  updated_at: string
  available_from?: string | null
  lease_term_months?: number | null
  pets_allowed?: boolean | null
  cooking_allowed?: boolean | null
  hdb_type?: HdbType | null
  negotiable?: boolean
  facing?: Facing | null
  parking_lots?: number | null
  balcony?: boolean | null
  property_condition?: PropertyCondition | null
  listing_reference?: string | null
  co_broke?: boolean
}

// ─── SOURCE DATA ──────────────────────────────────────────────────────────

const PHOTOS = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=70',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=70',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=70',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=70',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=70',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=70',
]

function pickPhotos(seed: number, count = 4): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(PHOTOS[(seed + i) % PHOTOS.length])
  }
  return out
}

// Real Singapore MRT stations with rough lat/lng so search-by-MRT works well.
const MRT: Record<string, { lat: number; lng: number }> = {
  Orchard:           { lat: 1.3043, lng: 103.8326 },
  'Raffles Place':   { lat: 1.2841, lng: 103.8514 },
  'Marina Bay':      { lat: 1.2761, lng: 103.8546 },
  'Tanjong Pagar':   { lat: 1.2766, lng: 103.8458 },
  'City Hall':       { lat: 1.2933, lng: 103.8526 },
  Bugis:             { lat: 1.3008, lng: 103.8559 },
  'Dhoby Ghaut':     { lat: 1.2989, lng: 103.8456 },
  Somerset:          { lat: 1.3007, lng: 103.8390 },
  Newton:            { lat: 1.3127, lng: 103.8389 },
  Novena:            { lat: 1.3204, lng: 103.8438 },
  Bishan:            { lat: 1.3510, lng: 103.8485 },
  'Ang Mo Kio':      { lat: 1.3697, lng: 103.8497 },
  Tampines:          { lat: 1.3546, lng: 103.9450 },
  'Jurong East':     { lat: 1.3329, lng: 103.7424 },
  Woodlands:         { lat: 1.4370, lng: 103.7864 },
  Punggol:           { lat: 1.4050, lng: 103.9024 },
  Serangoon:         { lat: 1.3499, lng: 103.8730 },
  'Paya Lebar':      { lat: 1.3179, lng: 103.8924 },
  Bedok:             { lat: 1.3239, lng: 103.9302 },
  Clementi:          { lat: 1.3151, lng: 103.7649 },
  'Buona Vista':     { lat: 1.3070, lng: 103.7900 },
  'Holland Village': { lat: 1.3119, lng: 103.7960 },
  Harbourfront:      { lat: 1.2654, lng: 103.8221 },
  'Tiong Bahru':     { lat: 1.2862, lng: 103.8270 },
  Redhill:           { lat: 1.2896, lng: 103.8169 },
  Outram:            { lat: 1.2802, lng: 103.8398 },
  'Little India':    { lat: 1.3066, lng: 103.8492 },
  'Farrer Park':     { lat: 1.3122, lng: 103.8543 },
  Lavender:          { lat: 1.3074, lng: 103.8628 },
  Aljunied:          { lat: 1.3163, lng: 103.8829 },
  Eunos:             { lat: 1.3196, lng: 103.9032 },
  Kembangan:         { lat: 1.3210, lng: 103.9128 },
  Simei:             { lat: 1.3433, lng: 103.9533 },
  'Pasir Ris':       { lat: 1.3729, lng: 103.9494 },
  Yishun:            { lat: 1.4294, lng: 103.8351 },
  Sembawang:         { lat: 1.4490, lng: 103.8200 },
  Khatib:            { lat: 1.4173, lng: 103.8330 },
  'Toa Payoh':       { lat: 1.3326, lng: 103.8475 },
  Braddell:          { lat: 1.3404, lng: 103.8467 },
  Caldecott:         { lat: 1.3378, lng: 103.8395 },
  'Marymount':       { lat: 1.3489, lng: 103.8395 },
  'Boon Lay':        { lat: 1.3389, lng: 103.7058 },
  Lakeside:          { lat: 1.3441, lng: 103.7211 },
  Chinatown:         { lat: 1.2843, lng: 103.8438 },
  Hougang:           { lat: 1.3712, lng: 103.8924 },
  Kovan:             { lat: 1.3601, lng: 103.8852 },
  'Bukit Timah':     { lat: 1.3294, lng: 103.8023 },
  'Bukit Panjang':   { lat: 1.3789, lng: 103.7615 },
  'Bukit Batok':     { lat: 1.3491, lng: 103.7494 },
  'Choa Chu Kang':   { lat: 1.3854, lng: 103.7445 },
  'Telok Blangah':   { lat: 1.2706, lng: 103.8098 },
  'Pasir Panjang':   { lat: 1.2762, lng: 103.7916 },
}

type Seed = {
  type: ListingType
  property_type: PropertyType
  project: string
  district: number
  mrt: keyof typeof MRT
  mrt_distance_m: number
  postal_code: string
  street: string
  hdb_type?: HdbType
  bedrooms: number
  bathrooms: number
  sqft: number
  /** Sale price in SGD, or monthly rent in SGD */
  price: number
  furnishing: FurnishingLevel
  floor_level?: string
  tenure?: string
  top_year?: number
  amenities?: string[]
  facing?: Facing
  parking_lots?: number
  balcony?: boolean
  property_condition?: PropertyCondition
  pets_allowed?: boolean
  cooking_allowed?: boolean
  lease_term_months?: number
  blurb?: string
}

const CONDO_AMENITIES = ['Pool', 'Gym', '24h Security', 'BBQ Pit', 'Function Room', 'Children\'s Playground']
const LUX_AMENITIES = ['Pool', 'Gym', '24h Concierge', 'Tennis Court', 'Sauna', 'Function Room', 'Sky Lounge']
const HDB_AMENITIES = ['Lift Access', 'Covered Walkway', 'Hawker Centre Nearby', 'Wet Market Nearby']
const COMM_AMENITIES = ['24h Access', 'Cargo Lift', 'Air-Conditioned Lobby', 'Carpark']

const SEEDS: Seed[] = [
  // ── District 1 / 2 / 6 — CBD condos ──
  { type: 'sale', property_type: 'condo', project: 'Marina One Residences', district: 1, mrt: 'Marina Bay', mrt_distance_m: 200, postal_code: '018980', street: '21 Marina Way', bedrooms: 2, bathrooms: 2, sqft: 980, price: 3100000, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2017, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'renovated' },
  { type: 'rent', property_type: 'condo', project: 'V on Shenton', district: 1, mrt: 'Tanjong Pagar', mrt_distance_m: 350, postal_code: '068810', street: '5 Shenton Way', bedrooms: 1, bathrooms: 1, sqft: 560, price: 5500, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2017, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'The Sail @ Marina Bay', district: 1, mrt: 'Raffles Place', mrt_distance_m: 280, postal_code: '018987', street: '6 Marina Boulevard', bedrooms: 3, bathrooms: 2, sqft: 1410, price: 3850000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2008, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'renovated' },
  { type: 'rent', property_type: 'condo', project: 'Wallich Residence', district: 2, mrt: 'Tanjong Pagar', mrt_distance_m: 80, postal_code: '078884', street: '3 Wallich Street', bedrooms: 2, bathrooms: 2, sqft: 1130, price: 9500, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2017, amenities: LUX_AMENITIES, facing: 'SE', parking_lots: 1, balcony: true, lease_term_months: 24, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Skysuites @ Anson', district: 2, mrt: 'Tanjong Pagar', mrt_distance_m: 250, postal_code: '079912', street: '70 Anson Road', bedrooms: 2, bathrooms: 2, sqft: 980, price: 2150000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2014, amenities: CONDO_AMENITIES, facing: 'W', parking_lots: 1 },
  { type: 'rent', property_type: 'condo', project: 'The Clift', district: 1, mrt: 'Raffles Place', mrt_distance_m: 220, postal_code: '049322', street: '80 McCallum Street', bedrooms: 1, bathrooms: 1, sqft: 480, price: 4400, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2011, amenities: CONDO_AMENITIES, facing: 'N', lease_term_months: 12, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'South Beach Residences', district: 7, mrt: 'Esplanade' as any, mrt_distance_m: 200, postal_code: '189767', street: '38 Beach Road', bedrooms: 3, bathrooms: 3, sqft: 1894, price: 5800000, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2016, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 2, balcony: true, property_condition: 'new' },

  // ── District 9 — Orchard / River Valley ──
  { type: 'sale', property_type: 'condo', project: 'The Orchard Residences', district: 9, mrt: 'Orchard', mrt_distance_m: 50, postal_code: '238801', street: '238 Orchard Boulevard', bedrooms: 3, bathrooms: 3, sqft: 1830, price: 7800000, furnishing: 'fully', floor_level: 'High', tenure: 'Freehold', top_year: 2010, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 2, balcony: true, property_condition: 'renovated' },
  { type: 'sale', property_type: 'condo', project: 'Boulevard 88', district: 10, mrt: 'Orchard', mrt_distance_m: 350, postal_code: '249593', street: '88 Orchard Boulevard', bedrooms: 4, bathrooms: 4, sqft: 2691, price: 14500000, furnishing: 'fully', floor_level: 'High', tenure: 'Freehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 2, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Cairnhill Nine', district: 9, mrt: 'Newton', mrt_distance_m: 400, postal_code: '229654', street: '17 Cairnhill Rise', bedrooms: 2, bathrooms: 2, sqft: 689, price: 6800, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2018, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Martin Modern', district: 9, mrt: 'Fort Canning' as any, mrt_distance_m: 450, postal_code: '239073', street: '8 Martin Place', bedrooms: 3, bathrooms: 2, sqft: 1216, price: 4250000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2021, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Robertson Quay', district: 9, mrt: 'Clarke Quay' as any, mrt_distance_m: 600, postal_code: '238253', street: '38 Martin Road', bedrooms: 2, bathrooms: 2, sqft: 980, price: 5800, furnishing: 'fully', floor_level: 'Mid', tenure: 'Freehold', top_year: 2010, amenities: CONDO_AMENITIES, facing: 'W', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'RV Edge', district: 9, mrt: 'Somerset', mrt_distance_m: 800, postal_code: '238239', street: '5 River Valley Close', bedrooms: 2, bathrooms: 2, sqft: 786, price: 2300000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2019, amenities: CONDO_AMENITIES, facing: 'NW', parking_lots: 1 },

  // ── District 10 — Holland / Tanglin / Bukit Timah ──
  { type: 'sale', property_type: 'condo', project: 'Holland Residences', district: 10, mrt: 'Holland Village', mrt_distance_m: 350, postal_code: '278645', street: '4 Taman Warna', bedrooms: 3, bathrooms: 2, sqft: 1216, price: 2980000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2014, amenities: CONDO_AMENITIES, facing: 'N', parking_lots: 1 },
  { type: 'rent', property_type: 'condo', project: 'One Holland Village Residences', district: 10, mrt: 'Holland Village', mrt_distance_m: 100, postal_code: '278996', street: '5 Holland Village Way', bedrooms: 2, bathrooms: 2, sqft: 829, price: 6500, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'landed', project: 'Cluny Park', district: 10, mrt: 'Botanic Gardens' as any, mrt_distance_m: 600, postal_code: '259676', street: '14 Cluny Park Road', bedrooms: 5, bathrooms: 5, sqft: 5500, price: 18500000, furnishing: 'unfurnished', floor_level: 'GCB', tenure: 'Freehold', top_year: 2016, amenities: ['Private Pool', 'Garden', 'Helper Quarters'], facing: 'S', parking_lots: 4, property_condition: 'renovated' },
  { type: 'sale', property_type: 'condo', project: 'Leedon Green', district: 10, mrt: 'Farrer Road' as any, mrt_distance_m: 250, postal_code: '266916', street: '28 Leedon Heights', bedrooms: 4, bathrooms: 3, sqft: 1453, price: 4980000, furnishing: 'partial', floor_level: 'High', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 2, balcony: true, property_condition: 'new' },

  // ── District 11 — Newton / Novena ──
  { type: 'sale', property_type: 'condo', project: 'The Atelier', district: 11, mrt: 'Newton', mrt_distance_m: 200, postal_code: '229876', street: '2 Makeway Avenue', bedrooms: 3, bathrooms: 3, sqft: 1238, price: 3850000, furnishing: 'partial', floor_level: 'High', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'The Lincoln Residences', district: 11, mrt: 'Newton', mrt_distance_m: 300, postal_code: '308381', street: '23 Surrey Road', bedrooms: 3, bathrooms: 2, sqft: 1205, price: 6200, furnishing: 'fully', floor_level: 'Mid', tenure: 'Freehold', top_year: 2014, amenities: CONDO_AMENITIES, facing: 'N', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Pullman Residences', district: 11, mrt: 'Newton', mrt_distance_m: 100, postal_code: '308253', street: '18 Dunearn Road', bedrooms: 2, bathrooms: 2, sqft: 753, price: 2680000, furnishing: 'partial', floor_level: 'High', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Soleil @ Sinaran', district: 11, mrt: 'Novena', mrt_distance_m: 50, postal_code: '307510', street: '1 Sinaran Drive', bedrooms: 2, bathrooms: 2, sqft: 1023, price: 5300, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2011, amenities: CONDO_AMENITIES, facing: 'W', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },

  // ── District 3 — Tiong Bahru / Queenstown ──
  { type: 'sale', property_type: 'hdb', project: 'Tiong Bahru Estate', district: 3, mrt: 'Tiong Bahru', mrt_distance_m: 350, postal_code: '160055', street: 'Block 55 Tiong Bahru Road', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 920000, furnishing: 'partial', floor_level: '8', tenure: '99-year leasehold', top_year: 1985, amenities: HDB_AMENITIES, facing: 'N', property_condition: 'renovated' },
  { type: 'rent', property_type: 'hdb', project: 'Tiong Bahru', district: 3, mrt: 'Tiong Bahru', mrt_distance_m: 250, postal_code: '160076', street: 'Block 76 Tiong Bahru Road', hdb_type: '3rm', bedrooms: 2, bathrooms: 1, sqft: 720, price: 3500, furnishing: 'partial', floor_level: '5', tenure: '99-year leasehold', top_year: 1980, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Highline Residences', district: 3, mrt: 'Tiong Bahru', mrt_distance_m: 100, postal_code: '169062', street: '8 Kim Tian Road', bedrooms: 3, bathrooms: 2, sqft: 1130, price: 2480000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2018, amenities: CONDO_AMENITIES, facing: 'NW', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'condo', project: 'Stirling Residences', district: 3, mrt: 'Redhill', mrt_distance_m: 300, postal_code: '148957', street: '21 Stirling Road', bedrooms: 2, bathrooms: 2, sqft: 753, price: 4900, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'Queens Peak', district: 3, mrt: 'Queenstown' as any, mrt_distance_m: 50, postal_code: '149054', street: '2 Dundee Road', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2280000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2021, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, property_condition: 'new' },

  // ── District 5 — Clementi / Pasir Panjang ──
  { type: 'sale', property_type: 'condo', project: 'Clavon', district: 5, mrt: 'Clementi', mrt_distance_m: 400, postal_code: '129956', street: '3 Clementi Avenue 1', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 2080000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Parc Clematis', district: 5, mrt: 'Clementi', mrt_distance_m: 800, postal_code: '129897', street: '2 Jalan Lempeng', bedrooms: 3, bathrooms: 2, sqft: 990, price: 4800, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2023, amenities: LUX_AMENITIES, facing: 'N', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'hdb', project: 'Clementi Towers', district: 5, mrt: 'Clementi', mrt_distance_m: 50, postal_code: '120442', street: 'Block 442 Clementi Avenue 3', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 1180000, furnishing: 'partial', floor_level: '32', tenure: '99-year leasehold', top_year: 2011, amenities: HDB_AMENITIES, facing: 'S', property_condition: 'renovated' },
  { type: 'rent', property_type: 'condo', project: 'Normanton Park', district: 5, mrt: 'Kent Ridge' as any, mrt_distance_m: 600, postal_code: '118549', street: '1 Normanton Park', bedrooms: 2, bathrooms: 2, sqft: 700, price: 4200, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },

  // ── District 12 — Toa Payoh / Balestier ──
  { type: 'sale', property_type: 'hdb', project: 'Toa Payoh Apex', district: 12, mrt: 'Toa Payoh', mrt_distance_m: 200, postal_code: '310112', street: 'Block 112 Lorong 1 Toa Payoh', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 980, price: 760000, furnishing: 'partial', floor_level: '14', tenure: '99-year leasehold', top_year: 2016, amenities: HDB_AMENITIES, facing: 'NE' },
  { type: 'rent', property_type: 'hdb', project: 'Bidadari', district: 12, mrt: 'Woodleigh' as any, mrt_distance_m: 200, postal_code: '339411', street: 'Block 11 Bidadari Park Drive', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 4200, furnishing: 'partial', floor_level: '17', tenure: '99-year leasehold', top_year: 2024, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'Trevista', district: 12, mrt: 'Toa Payoh', mrt_distance_m: 250, postal_code: '329701', street: '8 Lorong 3 Toa Payoh', bedrooms: 3, bathrooms: 2, sqft: 1130, price: 1880000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2011, amenities: CONDO_AMENITIES, facing: 'N', parking_lots: 1 },
  { type: 'sale', property_type: 'condo', project: 'The Arte @ Thomson', district: 11, mrt: 'Toa Payoh', mrt_distance_m: 600, postal_code: '298143', street: '101 Jalan Raja Udang', bedrooms: 4, bathrooms: 3, sqft: 1485, price: 2680000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2010, amenities: CONDO_AMENITIES, facing: 'NE', parking_lots: 1 },

  // ── District 14 — Geylang / Eunos / Paya Lebar ──
  { type: 'sale', property_type: 'condo', project: 'Park Place Residences', district: 14, mrt: 'Paya Lebar', mrt_distance_m: 50, postal_code: '409048', street: '8 Paya Lebar Road', bedrooms: 2, bathrooms: 2, sqft: 700, price: 1820000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2018, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'condo', project: 'Penrose', district: 14, mrt: 'Aljunied', mrt_distance_m: 200, postal_code: '389308', street: '21 Sims Drive', bedrooms: 3, bathrooms: 2, sqft: 990, price: 4400, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2023, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'hdb', project: 'Eunos', district: 14, mrt: 'Eunos', mrt_distance_m: 150, postal_code: '400621', street: 'Block 621 Bedok Reservoir Road', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 640000, furnishing: 'partial', floor_level: '11', tenure: '99-year leasehold', top_year: 1990, amenities: HDB_AMENITIES, facing: 'S' },

  // ── District 15 — East Coast / Marine Parade ──
  { type: 'sale', property_type: 'condo', project: 'Amber Park', district: 15, mrt: 'Tanjong Katong' as any, mrt_distance_m: 250, postal_code: '439898', street: '16 Amber Gardens', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 3320000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Meyer Mansion', district: 15, mrt: 'Katong Park' as any, mrt_distance_m: 100, postal_code: '437937', street: '81 Meyer Road', bedrooms: 3, bathrooms: 2, sqft: 1130, price: 7200, furnishing: 'fully', floor_level: 'High', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'Seaside Residences', district: 15, mrt: 'Siglap' as any, mrt_distance_m: 250, postal_code: '449294', street: '78 Siglap Link', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2080000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'The Sea View', district: 15, mrt: 'Mountbatten' as any, mrt_distance_m: 600, postal_code: '438138', street: '14 Amber Road', bedrooms: 3, bathrooms: 3, sqft: 1500, price: 6800, furnishing: 'fully', floor_level: 'High', tenure: 'Freehold', top_year: 2008, amenities: CONDO_AMENITIES, facing: 'E', parking_lots: 2, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'landed', project: 'Frankel Estate', district: 15, mrt: 'Bedok', mrt_distance_m: 1100, postal_code: '458103', street: '8 Frankel Avenue', bedrooms: 5, bathrooms: 4, sqft: 3200, price: 5800000, furnishing: 'unfurnished', floor_level: 'Inter-Terrace', tenure: 'Freehold', top_year: 2018, amenities: ['Garden', 'Roof Terrace', 'Helper Quarters'], facing: 'NE', parking_lots: 2, property_condition: 'renovated' },

  // ── District 16 — Bedok / Upper East Coast ──
  { type: 'sale', property_type: 'hdb', project: 'Bedok Reservoir View', district: 16, mrt: 'Bedok Reservoir' as any, mrt_distance_m: 400, postal_code: '470735', street: 'Block 735 Bedok Reservoir Road', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 740000, furnishing: 'partial', floor_level: '14', tenure: '99-year leasehold', top_year: 1995, amenities: HDB_AMENITIES, facing: 'NE' },
  { type: 'sale', property_type: 'condo', project: 'The Glades', district: 16, mrt: 'Tanah Merah' as any, mrt_distance_m: 150, postal_code: '466671', street: '70 Bedok Rise', bedrooms: 3, bathrooms: 2, sqft: 990, price: 1680000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2017, amenities: CONDO_AMENITIES, facing: 'N', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'hdb', project: 'Bedok North', district: 16, mrt: 'Bedok', mrt_distance_m: 600, postal_code: '460539', street: 'Block 539 Bedok North Street 3', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3300, furnishing: 'partial', floor_level: '7', tenure: '99-year leasehold', top_year: 1985, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },

  // ── District 18 — Tampines / Pasir Ris ──
  { type: 'sale', property_type: 'hdb', project: 'Tampines GreenRidges', district: 18, mrt: 'Tampines', mrt_distance_m: 800, postal_code: '521522', street: 'Block 522 Tampines Central 7', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 720000, furnishing: 'partial', floor_level: '13', tenure: '99-year leasehold', top_year: 2018, amenities: HDB_AMENITIES, facing: 'S' },
  { type: 'rent', property_type: 'hdb', project: 'Tampines', district: 18, mrt: 'Tampines', mrt_distance_m: 350, postal_code: '520201', street: 'Block 201 Tampines Street 21', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3200, furnishing: 'fully', floor_level: '9', tenure: '99-year leasehold', top_year: 1990, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Treasure at Tampines', district: 18, mrt: 'Simei', mrt_distance_m: 700, postal_code: '529672', street: '37 Tampines Lane', bedrooms: 3, bathrooms: 2, sqft: 990, price: 1480000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2023, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Pasir Ris Coast', district: 18, mrt: 'Pasir Ris', mrt_distance_m: 1100, postal_code: '510739', street: '23 Pasir Ris Drive 4', bedrooms: 3, bathrooms: 2, sqft: 1130, price: 4200, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2010, amenities: CONDO_AMENITIES, facing: 'E', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },

  // ── District 19 — Serangoon / Hougang / Punggol ──
  { type: 'sale', property_type: 'hdb', project: 'Punggol Waterway Terraces', district: 19, mrt: 'Punggol', mrt_distance_m: 600, postal_code: '821311', street: 'Block 311B Punggol Walk', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 770000, furnishing: 'partial', floor_level: '12', tenure: '99-year leasehold', top_year: 2014, amenities: HDB_AMENITIES, facing: 'N' },
  { type: 'rent', property_type: 'hdb', project: 'Hougang Capeview', district: 19, mrt: 'Hougang', mrt_distance_m: 400, postal_code: '530981', street: 'Block 981 Hougang Street 93', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3100, furnishing: 'partial', floor_level: '10', tenure: '99-year leasehold', top_year: 2017, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Affinity at Serangoon', district: 19, mrt: 'Serangoon', mrt_distance_m: 1500, postal_code: '545089', street: '50 Serangoon North Avenue 1', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 1620000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'The Florence Residences', district: 19, mrt: 'Hougang', mrt_distance_m: 700, postal_code: '536832', street: '8 Hougang Avenue 2', bedrooms: 3, bathrooms: 2, sqft: 990, price: 4100, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2023, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },

  // ── District 20 — Bishan / Ang Mo Kio ──
  { type: 'sale', property_type: 'hdb', project: 'Bishan Loft', district: 20, mrt: 'Bishan', mrt_distance_m: 400, postal_code: '570281', street: 'Block 281 Bishan Street 24', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 1080000, furnishing: 'partial', floor_level: '24', tenure: '99-year leasehold', top_year: 2003, amenities: HDB_AMENITIES, facing: 'S', property_condition: 'renovated' },
  { type: 'rent', property_type: 'hdb', project: 'Ang Mo Kio', district: 20, mrt: 'Ang Mo Kio', mrt_distance_m: 350, postal_code: '560452', street: 'Block 452 Ang Mo Kio Avenue 10', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3300, furnishing: 'partial', floor_level: '8', tenure: '99-year leasehold', top_year: 1980, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Sky Vue', district: 20, mrt: 'Bishan', mrt_distance_m: 250, postal_code: '579643', street: '90 Bishan Street 15', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2050000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2016, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'condo', project: 'Thomson Three', district: 20, mrt: 'Marymount', mrt_distance_m: 350, postal_code: '574288', street: '8 Bright Hill Drive', bedrooms: 3, bathrooms: 2, sqft: 1130, price: 5200, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2017, amenities: CONDO_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },

  // ── District 21 — Bukit Timah ──
  { type: 'sale', property_type: 'condo', project: 'The Linq @ Beauty World', district: 21, mrt: 'Beauty World' as any, mrt_distance_m: 50, postal_code: '588182', street: '6 Upper Bukit Timah Road', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 2680000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'N', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Daintree Residence', district: 21, mrt: 'Beauty World' as any, mrt_distance_m: 700, postal_code: '588141', street: '88 Toh Tuck Road', bedrooms: 3, bathrooms: 2, sqft: 990, price: 5400, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'landed', project: 'Sixth Avenue', district: 10, mrt: 'Sixth Avenue' as any, mrt_distance_m: 350, postal_code: '276723', street: '5 Jalan Tupai', bedrooms: 5, bathrooms: 4, sqft: 4200, price: 8500000, furnishing: 'unfurnished', floor_level: 'Inter-Terrace', tenure: 'Freehold', top_year: 2015, amenities: ['Garden', 'Helper Quarters'], facing: 'S', parking_lots: 3, property_condition: 'renovated' },

  // ── District 22 — Jurong ──
  { type: 'sale', property_type: 'condo', project: 'J Gateway', district: 22, mrt: 'Jurong East', mrt_distance_m: 100, postal_code: '608537', street: '8 Gateway Drive', bedrooms: 2, bathrooms: 2, sqft: 700, price: 1480000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2016, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'condo', project: 'Lakeville', district: 22, mrt: 'Lakeside', mrt_distance_m: 350, postal_code: '648175', street: '38 Jurong West Street 41', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3800, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2018, amenities: CONDO_AMENITIES, facing: 'W', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'hdb', project: 'Jurong West', district: 22, mrt: 'Boon Lay', mrt_distance_m: 600, postal_code: '640496', street: 'Block 496 Jurong West Street 41', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 540000, furnishing: 'partial', floor_level: '11', tenure: '99-year leasehold', top_year: 1992, amenities: HDB_AMENITIES, facing: 'N' },

  // ── District 23 — Bukit Batok / Bukit Panjang ──
  { type: 'sale', property_type: 'hdb', project: 'Bukit Panjang', district: 23, mrt: 'Bukit Panjang', mrt_distance_m: 300, postal_code: '670209', street: 'Block 209 Petir Road', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 580000, furnishing: 'partial', floor_level: '12', tenure: '99-year leasehold', top_year: 1995, amenities: HDB_AMENITIES, facing: 'NE' },
  { type: 'rent', property_type: 'condo', project: 'The Skywoods', district: 23, mrt: 'Bukit Batok', mrt_distance_m: 1100, postal_code: '676976', street: '8 Dairy Farm Road', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 3700, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2017, amenities: LUX_AMENITIES, facing: 'NW', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Forest Woods', district: 19, mrt: 'Serangoon', mrt_distance_m: 350, postal_code: '534008', street: '8 Lorong Lew Lian', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 1920000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2020, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true },

  // ── District 25 — Woodlands ──
  { type: 'sale', property_type: 'hdb', project: 'Woodlands', district: 25, mrt: 'Woodlands', mrt_distance_m: 400, postal_code: '730789', street: 'Block 789 Woodlands Drive 60', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 620000, furnishing: 'partial', floor_level: '14', tenure: '99-year leasehold', top_year: 2000, amenities: HDB_AMENITIES, facing: 'S' },
  { type: 'rent', property_type: 'hdb', project: 'Admiralty', district: 25, mrt: 'Admiralty' as any, mrt_distance_m: 250, postal_code: '750678', street: 'Block 678 Woodlands Avenue 6', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2900, furnishing: 'partial', floor_level: '9', tenure: '99-year leasehold', top_year: 1998, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },

  // ── District 27 — Yishun / Sembawang ──
  { type: 'sale', property_type: 'hdb', project: 'Yishun', district: 27, mrt: 'Yishun', mrt_distance_m: 600, postal_code: '760623', street: 'Block 623 Yishun Ring Road', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 660000, furnishing: 'partial', floor_level: '11', tenure: '99-year leasehold', top_year: 1990, amenities: HDB_AMENITIES, facing: 'N' },
  { type: 'rent', property_type: 'condo', project: 'The Wisteria', district: 27, mrt: 'Yishun', mrt_distance_m: 1500, postal_code: '768825', street: '598 Yishun Ring Road', bedrooms: 3, bathrooms: 2, sqft: 990, price: 3500, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2018, amenities: CONDO_AMENITIES, facing: 'N', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },
  { type: 'sale', property_type: 'condo', project: 'Canberra Residences', district: 27, mrt: 'Canberra' as any, mrt_distance_m: 600, postal_code: '750113', street: '8 Canberra Drive', bedrooms: 3, bathrooms: 2, sqft: 1023, price: 1280000, furnishing: 'partial', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2014, amenities: CONDO_AMENITIES, facing: 'E', parking_lots: 1, balcony: true },

  // ── District 8 — Little India / Farrer Park ──
  { type: 'sale', property_type: 'condo', project: 'City Square Residences', district: 8, mrt: 'Farrer Park', mrt_distance_m: 100, postal_code: '208529', street: '180 Kitchener Road', bedrooms: 2, bathrooms: 2, sqft: 850, price: 1480000, furnishing: 'partial', floor_level: 'Mid', tenure: 'Freehold', top_year: 2009, amenities: CONDO_AMENITIES, facing: 'S', parking_lots: 1 },
  { type: 'rent', property_type: 'condo', project: 'Sturdee Residences', district: 8, mrt: 'Farrer Park', mrt_distance_m: 250, postal_code: '208094', street: '8 Beatty Road', bedrooms: 2, bathrooms: 2, sqft: 700, price: 4200, furnishing: 'fully', floor_level: 'Mid', tenure: '99-year leasehold', top_year: 2019, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },

  // ── District 4 — Telok Blangah / Harbourfront ──
  { type: 'sale', property_type: 'condo', project: 'Skyline Residences', district: 4, mrt: 'Harbourfront', mrt_distance_m: 700, postal_code: '098771', street: '6 Telok Blangah Heights', bedrooms: 3, bathrooms: 3, sqft: 1485, price: 3680000, furnishing: 'partial', floor_level: 'High', tenure: 'Freehold', top_year: 2014, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true },
  { type: 'rent', property_type: 'condo', project: 'Reflections at Keppel Bay', district: 4, mrt: 'Harbourfront', mrt_distance_m: 1100, postal_code: '098399', street: '1 Keppel Bay View', bedrooms: 3, bathrooms: 3, sqft: 1485, price: 8800, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2013, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 2, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true },

  // ── Commercial ──
  { type: 'rent', property_type: 'commercial', project: 'Capital Tower', district: 1, mrt: 'Tanjong Pagar', mrt_distance_m: 100, postal_code: '068912', street: '168 Robinson Road', bedrooms: 0, bathrooms: 2, sqft: 2200, price: 22000, furnishing: 'unfurnished', floor_level: '23', tenure: '99-year leasehold', top_year: 2000, amenities: COMM_AMENITIES, facing: 'S', parking_lots: 2, lease_term_months: 24 },
  { type: 'rent', property_type: 'commercial', project: 'One Raffles Quay', district: 1, mrt: 'Raffles Place', mrt_distance_m: 50, postal_code: '048583', street: '1 Raffles Quay', bedrooms: 0, bathrooms: 2, sqft: 3500, price: 38000, furnishing: 'partial', floor_level: '40', tenure: '99-year leasehold', top_year: 2006, amenities: COMM_AMENITIES, facing: 'S', parking_lots: 3, lease_term_months: 36 },
  { type: 'rent', property_type: 'commercial', project: 'Suntec Tower', district: 7, mrt: 'Promenade' as any, mrt_distance_m: 200, postal_code: '038983', street: '7 Temasek Boulevard', bedrooms: 0, bathrooms: 2, sqft: 1500, price: 14500, furnishing: 'unfurnished', floor_level: '15', tenure: '99-year leasehold', top_year: 1997, amenities: COMM_AMENITIES, facing: 'NE', parking_lots: 2, lease_term_months: 24 },
  { type: 'sale', property_type: 'commercial', project: 'Paya Lebar Square', district: 14, mrt: 'Paya Lebar', mrt_distance_m: 200, postal_code: '409055', street: '60 Paya Lebar Road', bedrooms: 0, bathrooms: 1, sqft: 850, price: 2280000, furnishing: 'unfurnished', floor_level: '8', tenure: '99-year leasehold', top_year: 2014, amenities: COMM_AMENITIES, facing: 'N', parking_lots: 1 },
  { type: 'rent', property_type: 'commercial', project: 'Jewel Changi', district: 17, mrt: 'Changi Airport' as any, mrt_distance_m: 50, postal_code: '819666', street: '78 Airport Boulevard', bedrooms: 0, bathrooms: 1, sqft: 600, price: 18500, furnishing: 'partial', floor_level: '2', tenure: '99-year leasehold', top_year: 2019, amenities: COMM_AMENITIES, lease_term_months: 24, property_condition: 'new' },

  // ── Landed ──
  { type: 'sale', property_type: 'landed', project: 'Holland Grove', district: 10, mrt: 'Farrer Road' as any, mrt_distance_m: 800, postal_code: '278789', street: '12 Holland Grove Road', bedrooms: 5, bathrooms: 5, sqft: 4500, price: 9800000, furnishing: 'unfurnished', floor_level: 'Semi-Detached', tenure: 'Freehold', top_year: 2019, amenities: ['Private Pool', 'Garden', 'Helper Quarters', 'Roof Terrace'], facing: 'S', parking_lots: 3, property_condition: 'renovated' },
  { type: 'sale', property_type: 'landed', project: 'Serangoon Garden', district: 19, mrt: 'Lorong Chuan' as any, mrt_distance_m: 1500, postal_code: '555302', street: '8 Lichi Avenue', bedrooms: 4, bathrooms: 4, sqft: 2800, price: 4280000, furnishing: 'unfurnished', floor_level: 'Inter-Terrace', tenure: 'Freehold', top_year: 2017, amenities: ['Garden', 'Roof Terrace'], facing: 'NE', parking_lots: 2, property_condition: 'renovated' },
  { type: 'sale', property_type: 'landed', project: 'Telok Kurau', district: 15, mrt: 'Kembangan', mrt_distance_m: 700, postal_code: '425768', street: '5 Lorong K Telok Kurau', bedrooms: 5, bathrooms: 4, sqft: 3400, price: 5680000, furnishing: 'unfurnished', floor_level: 'Inter-Terrace', tenure: 'Freehold', top_year: 2020, amenities: ['Garden', 'Roof Terrace', 'Helper Quarters'], facing: 'E', parking_lots: 2, property_condition: 'renovated' },
  { type: 'sale', property_type: 'landed', project: 'Joo Chiat', district: 15, mrt: 'Eunos', mrt_distance_m: 900, postal_code: '427388', street: '88 Joo Chiat Place', bedrooms: 4, bathrooms: 3, sqft: 2200, price: 3850000, furnishing: 'unfurnished', floor_level: 'Inter-Terrace', tenure: 'Freehold', top_year: 2016, amenities: ['Garden', 'Roof Terrace'], facing: 'S', parking_lots: 2, property_condition: 'renovated' },
  { type: 'sale', property_type: 'landed', project: 'Hillview', district: 23, mrt: 'Hillview' as any, mrt_distance_m: 800, postal_code: '669560', street: '15 Jalan Dermawan', bedrooms: 4, bathrooms: 4, sqft: 3000, price: 4480000, furnishing: 'unfurnished', floor_level: 'Semi-Detached', tenure: 'Freehold', top_year: 2018, amenities: ['Garden', 'Helper Quarters'], facing: 'NE', parking_lots: 2 },

  // ── More HDB resale across SG ──
  { type: 'sale', property_type: 'hdb', project: 'Sengkang Vue', district: 19, mrt: 'Sengkang' as any, mrt_distance_m: 250, postal_code: '540289', street: 'Block 289C Compassvale Crescent', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 690000, furnishing: 'partial', floor_level: '13', tenure: '99-year leasehold', top_year: 2014, amenities: HDB_AMENITIES, facing: 'NE' },
  { type: 'sale', property_type: 'hdb', project: 'Pinnacle @ Duxton', district: 2, mrt: 'Outram', mrt_distance_m: 350, postal_code: '081001', street: 'Block 1A Cantonment Road', hdb_type: '5rm', bedrooms: 3, bathrooms: 2, sqft: 1184, price: 1480000, furnishing: 'partial', floor_level: '38', tenure: '99-year leasehold', top_year: 2009, amenities: ['Sky Bridge', 'Lift Access', 'Hawker Centre Nearby'], facing: 'S', property_condition: 'renovated' },
  { type: 'sale', property_type: 'hdb', project: 'Dawson Vista', district: 3, mrt: 'Queenstown' as any, mrt_distance_m: 400, postal_code: '147099', street: 'Block 99 Dawson Road', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 980000, furnishing: 'partial', floor_level: '22', tenure: '99-year leasehold', top_year: 2017, amenities: HDB_AMENITIES, facing: 'S', property_condition: 'renovated' },
  { type: 'sale', property_type: 'hdb', project: 'Kallang Trivista', district: 12, mrt: 'Bendemeer' as any, mrt_distance_m: 350, postal_code: '339418', street: 'Block 18 Kallang Trivista', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 720000, furnishing: 'partial', floor_level: '11', tenure: '99-year leasehold', top_year: 2018, amenities: HDB_AMENITIES, facing: 'NE' },
  { type: 'rent', property_type: 'hdb', project: 'Choa Chu Kang', district: 23, mrt: 'Choa Chu Kang', mrt_distance_m: 600, postal_code: '680822', street: 'Block 822 Choa Chu Kang Avenue 1', hdb_type: '4rm', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2700, furnishing: 'partial', floor_level: '8', tenure: '99-year leasehold', top_year: 1995, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },
  { type: 'rent', property_type: 'hdb', project: 'Marsiling', district: 25, mrt: 'Marsiling' as any, mrt_distance_m: 350, postal_code: '730215', street: 'Block 215 Marsiling Crescent', hdb_type: '3rm', bedrooms: 2, bathrooms: 1, sqft: 720, price: 2400, furnishing: 'partial', floor_level: '6', tenure: '99-year leasehold', top_year: 1985, amenities: HDB_AMENITIES, lease_term_months: 24, pets_allowed: false, cooking_allowed: true },

  // ── Misc condos across SG to round out 80 ──
  { type: 'sale', property_type: 'condo', project: 'Avenue South Residence', district: 3, mrt: 'Outram', mrt_distance_m: 600, postal_code: '169073', street: '3 Silat Avenue', bedrooms: 2, bathrooms: 2, sqft: 700, price: 1820000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Riviere', district: 3, mrt: 'Havelock' as any, mrt_distance_m: 200, postal_code: '169654', street: '8 Jiak Kim Street', bedrooms: 2, bathrooms: 2, sqft: 786, price: 5800, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'One Pearl Bank', district: 3, mrt: 'Outram', mrt_distance_m: 250, postal_code: '169045', street: '1 Pearl Bank', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2580000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2023, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Midtown Modern', district: 7, mrt: 'Bugis', mrt_distance_m: 50, postal_code: '188068', street: '18 Tan Quee Lan Street', bedrooms: 2, bathrooms: 2, sqft: 786, price: 6400, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'Midtown Bay', district: 7, mrt: 'Bugis', mrt_distance_m: 100, postal_code: '188053', street: '128 Beach Road', bedrooms: 1, bathrooms: 1, sqft: 506, price: 1620000, furnishing: 'fully', floor_level: 'High', tenure: '99-year leasehold', top_year: 2022, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Liv @ MB', district: 15, mrt: 'Mountbatten' as any, mrt_distance_m: 200, postal_code: '397755', street: '114 Arthur Road', bedrooms: 3, bathrooms: 2, sqft: 990, price: 5400, furnishing: 'fully', floor_level: 'Mid', tenure: 'Freehold', top_year: 2024, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 1, balcony: true, lease_term_months: 12, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
  { type: 'sale', property_type: 'condo', project: 'Tembusu Grand', district: 15, mrt: 'Tanjong Katong' as any, mrt_distance_m: 50, postal_code: '436941', street: '90 Jalan Tembusu', bedrooms: 3, bathrooms: 2, sqft: 990, price: 2480000, furnishing: 'partial', floor_level: 'High', tenure: '99-year leasehold', top_year: 2026, amenities: LUX_AMENITIES, facing: 'S', parking_lots: 1, balcony: true, property_condition: 'new' },
  { type: 'rent', property_type: 'condo', project: 'Watten House', district: 11, mrt: 'Stevens' as any, mrt_distance_m: 400, postal_code: '297720', street: '36 Shelford Road', bedrooms: 4, bathrooms: 3, sqft: 1485, price: 9800, furnishing: 'fully', floor_level: 'Mid', tenure: 'Freehold', top_year: 2027, amenities: LUX_AMENITIES, facing: 'NE', parking_lots: 2, balcony: true, lease_term_months: 24, pets_allowed: true, cooking_allowed: true, property_condition: 'new' },
]

// ─── DESCRIPTION GENERATION ──────────────────────────────────────────────

function articleFor(propertyType: PropertyType, listingType: ListingType, seed: Seed): string {
  const lines: string[] = []
  const action = listingType === 'rent' ? 'available for rent' : 'on the market for sale'

  if (propertyType === 'hdb') {
    const type = seed.hdb_type ? seed.hdb_type.replace('rm', '-Room') : 'HDB'
    lines.push(
      `${type} HDB flat at ${seed.project} ${action}. ` +
      `${seed.bedrooms} bedrooms, ${seed.bathrooms} bathroom${seed.bathrooms > 1 ? 's' : ''}, ` +
      `${seed.sqft} sqft. ${seed.floor_level ? `Mid-to-high floor unit on level ${seed.floor_level}.` : ''}`
    )
    lines.push(
      `Within walking distance of ${seed.mrt} MRT (${seed.mrt_distance_m}m). ` +
      `Surrounded by hawker centres, supermarkets and schools. Lift access on every floor.`
    )
    if (seed.property_condition === 'renovated') {
      lines.push('Recently renovated with new flooring, kitchen cabinets and bathroom fittings. Move-in ready.')
    }
  } else if (propertyType === 'condo') {
    lines.push(
      `${seed.bedrooms}-bedroom unit at ${seed.project}, ${action}. ` +
      `${seed.sqft} sqft of well-laid-out living space with ${seed.bathrooms} bathroom${seed.bathrooms > 1 ? 's' : ''}.` +
      (seed.balcony ? ' Private balcony.' : '')
    )
    lines.push(
      `Just ${seed.mrt_distance_m}m from ${seed.mrt} MRT. Close to amenities, food and lifestyle options.`
    )
    if (seed.facing) {
      lines.push(`${seed.facing}-facing for natural light throughout the day.`)
    }
    if (seed.property_condition === 'new') {
      lines.push('Brand new development with modern fittings and full facilities.')
    } else if (seed.property_condition === 'renovated') {
      lines.push('Tastefully renovated, ready to move in.')
    }
  } else if (propertyType === 'landed') {
    lines.push(
      `${seed.floor_level ?? 'Landed'} home in the ${seed.project} enclave, ${action}. ` +
      `${seed.bedrooms} bedrooms, ${seed.bathrooms} bathrooms across ${seed.sqft} sqft of built-up area.`
    )
    lines.push(
      `Quiet, leafy neighbourhood. ${seed.parking_lots ?? 2} car park lots. ` +
      `Close to top schools and ${seed.mrt} MRT (${seed.mrt_distance_m}m).`
    )
    if (seed.property_condition === 'renovated') {
      lines.push('Recently rebuilt or renovated with premium finishes throughout.')
    }
  } else {
    // commercial
    lines.push(
      `Grade-A commercial space at ${seed.project}, ${action}. ` +
      `${seed.sqft} sqft on level ${seed.floor_level ?? 'mid'}. Open layout, ready for fit-out.`
    )
    lines.push(
      `Direct access to ${seed.mrt} MRT (${seed.mrt_distance_m}m). 24-hour building access and dedicated carpark lots.`
    )
  }

  if (seed.blurb) lines.push(seed.blurb)

  lines.push(
    listingType === 'rent'
      ? 'Viewing by appointment. Co-broke welcome.'
      : 'Owner motivated. Co-broke welcome. Please contact for viewing.'
  )
  return lines.join('\n\n')
}

function titleFor(seed: Seed): string {
  if (seed.property_type === 'hdb') {
    const type = seed.hdb_type ? seed.hdb_type.replace('rm', '-Room ') : ''
    return `${type}HDB at ${seed.project}`.trim()
  }
  if (seed.property_type === 'commercial') {
    return `Commercial space at ${seed.project}`
  }
  if (seed.property_type === 'landed') {
    return `${seed.bedrooms}BR Landed in ${seed.project}`
  }
  return `${seed.bedrooms}BR ${seed.project}`
}

// ─── ID HELPERS ───────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${ts}-${rand}`
}

// ─── BUILD LISTING ────────────────────────────────────────────────────────

function buildListingFromSeed(seed: Seed, index: number): StoredListing {
  // Spread created_at across the past 60 days so the feed doesn't all share
  // the same timestamp.
  const daysAgo = (index * 11) % 60
  const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  const now = new Date()
  const coords = MRT[seed.mrt as keyof typeof MRT]
  // Add a small jitter so listings aren't all stacked on the MRT pin.
  const lat = coords ? coords.lat + ((index % 7) - 3) * 0.0008 : 0
  const lng = coords ? coords.lng + ((index % 5) - 2) * 0.0008 : 0

  const psf = seed.type === 'sale' && seed.sqft > 0
    ? Math.round(seed.price / seed.sqft)
    : null

  // Available-from for rentals: 1-30 days from now
  const availableFrom = seed.type === 'rent'
    ? new Date(Date.now() + ((index * 7) % 30 + 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : undefined

  return {
    id: generateId('listing'),
    agent_id: IMPORT_AGENT_ID,
    type: seed.type,
    property_type: seed.property_type,
    title: titleFor(seed),
    description: articleFor(seed.property_type, seed.type, seed),
    price: seed.price,
    price_psf: psf,
    bedrooms: seed.bedrooms,
    bathrooms: seed.bathrooms,
    sqft: seed.sqft,
    address: seed.street,
    district: seed.district,
    postal_code: seed.postal_code,
    lat,
    lng,
    amenities: seed.amenities ?? CONDO_AMENITIES,
    photos: pickPhotos(index, 4),
    floor_plan_url: null,
    furnishing: seed.furnishing,
    floor_level: seed.floor_level ?? null,
    tenure: seed.tenure ?? null,
    top_year: seed.top_year ?? null,
    mrt_nearest: seed.mrt as string,
    mrt_distance_m: seed.mrt_distance_m,
    status: 'active',
    featured: index < 6, // first six show up in the featured rail
    views: Math.floor(80 + Math.random() * 1200),
    created_at: created.toISOString(),
    updated_at: now.toISOString(),
    available_from: availableFrom ?? null,
    lease_term_months: seed.lease_term_months ?? null,
    pets_allowed: seed.pets_allowed ?? null,
    cooking_allowed: seed.cooking_allowed ?? null,
    hdb_type: seed.hdb_type ?? null,
    negotiable: seed.type === 'sale',
    facing: seed.facing ?? null,
    parking_lots: seed.parking_lots ?? null,
    balcony: seed.balcony ?? null,
    property_condition: seed.property_condition ?? null,
    listing_reference: `IMP-${String(index + 1).padStart(4, '0')}`,
    co_broke: true,
  }
}

// ─── REDIS WRITES ─────────────────────────────────────────────────────────

async function ensureImportAgent(): Promise<void> {
  const existing = await redis.get<StoredUser>(K.user(IMPORT_AGENT_ID))
  if (existing) return

  const agent: StoredUser = {
    id: IMPORT_AGENT_ID,
    email: 'imported@listings.uqlabs.co',
    password_hash: '!disabled',
    name: 'Listed elsewhere',
    agency: 'Listed elsewhere',
    phone: '+65 0000 0000',
    license_no: '—',
    photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Imported&backgroundColor=e5e7eb',
    bio: 'Public listing aggregated from elsewhere on the web. To list with us, sign up for free.',
    strata_agent_id: null,
    subscription_status: 'cancelled',
    subscription_source: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    subscription_activated_at: null,
    subscription_ends_at: null,
    created_at: new Date().toISOString(),
  }

  const pipe = redis.pipeline()
  pipe.set(K.user(agent.id), agent)
  pipe.set(K.userByEmail(agent.email), agent.id)
  pipe.sadd(K.userIds, agent.id)
  await pipe.exec()
}

async function saveListing(listing: StoredListing): Promise<void> {
  const pipe = redis.pipeline()
  pipe.set(K.listing(listing.id), listing)
  pipe.sadd(K.listingIds, listing.id)
  pipe.sadd(K.listingsByAgent(listing.agent_id), listing.id)
  await pipe.exec()
}

// ─── MAIN ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`PropReels listings import — ${SEEDS.length} listings queued.`)

  if (!FORCE) {
    const marker = await redis.get<{ count: number; at: string }>(MARKER_KEY)
    if (marker) {
      console.log(`Already imported ${marker.count} listings at ${marker.at}.`)
      console.log('Re-run with --force to import again (will create duplicates).')
      return
    }
  } else {
    console.log('--force passed: importing again even though marker exists.')
  }

  console.log('Ensuring import agent exists...')
  await ensureImportAgent()
  console.log(`Import agent ready: ${IMPORT_AGENT_ID}`)

  let ok = 0
  let failed = 0
  const errors: { project: string; err: string }[] = []

  for (let i = 0; i < SEEDS.length; i++) {
    const seed = SEEDS[i]
    try {
      const listing = buildListingFromSeed(seed, i)
      await saveListing(listing)
      ok++
      const label = `${listing.property_type.toUpperCase().padEnd(10)} ${listing.type.padEnd(4)}`
      const price = listing.type === 'rent'
        ? `$${listing.price.toLocaleString()}/mo`
        : `$${listing.price.toLocaleString()}`
      console.log(`  [${String(i + 1).padStart(2)}/${SEEDS.length}] ${label} ${seed.project.padEnd(38)} ${price}`)
    } catch (e) {
      failed++
      const msg = e instanceof Error ? e.message : String(e)
      errors.push({ project: seed.project, err: msg })
      console.error(`  [${i + 1}] FAILED ${seed.project}: ${msg}`)
    }
  }

  await redis.set(MARKER_KEY, { count: ok, at: new Date().toISOString() })

  console.log('')
  console.log(`Done. ${ok} imported, ${failed} failed.`)
  if (errors.length) {
    console.log('Errors:')
    for (const e of errors) console.log(`  - ${e.project}: ${e.err}`)
  }
  console.log(`Marker key set: ${MARKER_KEY}`)
  console.log(`Imported listings live under agent_id=${IMPORT_AGENT_ID}`)
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
