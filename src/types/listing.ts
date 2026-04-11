export type PropertyType = 'hdb' | 'condo' | 'landed' | 'commercial'
export type ListingType = 'rent' | 'sale'
export type ListingStatus = 'active' | 'sold' | 'rented' | 'draft'
export type FurnishingLevel = 'unfurnished' | 'partial' | 'fully'

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  agency: string
  license_no: string
  photo_url: string
  bio: string
  listings_count: number
  strata_agent_id: string | null
  created_at: string
}

export interface Listing {
  id: string
  agent_id: string
  agent: Agent
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
  status: ListingStatus
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  listing: Listing
  agent_id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'contacted' | 'converted'
  strata_lead_id: string | null
  created_at: string
}

export interface SearchFilters {
  type?: ListingType
  property_type?: PropertyType
  district?: number
  min_price?: number
  max_price?: number
  bedrooms?: number
  mrt?: string
  query?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  hdb: 'HDB',
  condo: 'Condo',
  landed: 'Landed',
  commercial: 'Commercial',
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  rent: 'For Rent',
  sale: 'For Sale',
}

export const FURNISHING_LABELS: Record<FurnishingLevel, string> = {
  unfurnished: 'Unfurnished',
  partial: 'Partially Furnished',
  fully: 'Fully Furnished',
}

export const SG_DISTRICTS: Record<number, string> = {
  1: 'Raffles Place, Marina',
  2: 'Tanjong Pagar, Chinatown',
  3: 'Queenstown, Tiong Bahru',
  4: 'Telok Blangah, Harbourfront',
  5: 'Pasir Panjang, Clementi',
  6: 'City Hall, Clarke Quay',
  7: 'Beach Road, Bugis',
  8: 'Little India, Farrer Park',
  9: 'Orchard, River Valley',
  10: 'Tanglin, Holland',
  11: 'Newton, Novena',
  12: 'Toa Payoh, Balestier',
  13: 'Macpherson, Potong Pasir',
  14: 'Geylang, Eunos',
  15: 'East Coast, Marine Parade',
  16: 'Bedok, Upper East Coast',
  17: 'Changi, Loyang',
  18: 'Tampines, Pasir Ris',
  19: 'Serangoon, Hougang',
  20: 'Bishan, Ang Mo Kio',
  21: 'Clementi, Upper Bukit Timah',
  22: 'Jurong, Boon Lay',
  23: 'Bukit Batok, Bukit Panjang',
  24: 'Lim Chu Kang, Tengah',
  25: 'Woodlands, Admiralty',
  26: 'Mandai, Upper Thomson',
  27: 'Yishun, Sembawang',
  28: 'Seletar, Yio Chu Kang',
}

export const POPULAR_MRTS = [
  'Orchard', 'Raffles Place', 'Marina Bay', 'Tanjong Pagar',
  'City Hall', 'Bugis', 'Dhoby Ghaut', 'Somerset',
  'Newton', 'Novena', 'Bishan', 'Ang Mo Kio',
  'Tampines', 'Jurong East', 'Woodlands', 'Punggol',
  'Serangoon', 'Paya Lebar', 'Bedok', 'Clementi',
  'Buona Vista', 'Holland Village', 'Harbourfront', 'Tiong Bahru',
]
