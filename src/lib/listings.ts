import 'server-only'
import {
  getListings as getMockListings,
  getFeaturedListings as getMockFeatured,
  getAgentById,
  getAgents,
} from '@/lib/data'
import {
  getStoredListings,
  getStoredInquiries,
  getUserById,
  getListingsByAgent,
} from '@/lib/storage'
import type { Listing, SearchFilters, Agent, Inquiry } from '@/types/listing'

// Build an Agent object from a stored real user (from signup via /api/register)
async function agentFromStoredUser(userId: string): Promise<Agent | null> {
  const user = await getUserById(userId)
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    agency: user.agency,
    license_no: user.license_no,
    photo_url: user.photo_url,
    bio: user.bio || 'Property specialist on Strata Listings.',
    listings_count: 0,
    strata_agent_id: user.strata_agent_id,
    created_at: user.created_at,
  }
}

// Resolve an agent from either mock seed data or from the users store.
export async function resolveAgent(agentId: string): Promise<Agent | null> {
  const mock = getAgentById(agentId)
  if (mock) return mock
  return agentFromStoredUser(agentId)
}

// ─── LISTINGS ──────────────────────────────────────────────

/**
 * Returns ALL active listings, merging Blob-stored (real) listings with the
 * seed mock data. Stored listings appear first (newest by default).
 *
 * Server-only — uses Vercel Blob.
 */
export async function getAllListings(filters?: SearchFilters): Promise<Listing[]> {
  const stored = await getStoredListings()
  // Hydrate each stored listing with its agent (mock OR real stored user)
  const storedHydrated: Listing[] = (
    await Promise.all(
      stored
        .filter((l) => l.status === 'active')
        .map(async (l) => {
          const agent = (await resolveAgent(l.agent_id)) ?? getAgents()[0]
          return { ...l, agent }
        })
    )
  )

  const mock = getMockListings()
  // Avoid duplicate IDs if any
  const storedIds = new Set(storedHydrated.map((l) => l.id))
  const merged = [...storedHydrated, ...mock.filter((l) => !storedIds.has(l.id))]

  return applyFilters(merged, filters)
}

export async function getFeaturedListingsAll(): Promise<Listing[]> {
  const all = await getAllListings()
  return all.filter((l) => l.featured)
}

export async function getListingByIdAsync(id: string): Promise<Listing | undefined> {
  const all = await getAllListings()
  return all.find((l) => l.id === id)
}

export async function getAgentListingsAsync(agentId: string): Promise<Listing[]> {
  // Fast path: agent's listings are indexed by agent_id in Redis (Set membership)
  const stored = await getListingsByAgent(agentId)
  const storedHydrated: Listing[] = await Promise.all(
    stored.map(async (l) => {
      const agent = (await resolveAgent(l.agent_id)) ?? getAgents()[0]
      return { ...l, agent }
    })
  )
  // Also include any mock-seeded listings for this agent (seed agents like agent-1)
  const mockForAgent = getMockListings().filter((l) => l.agent_id === agentId)
  return [...storedHydrated, ...mockForAgent]
}

// ─── INQUIRIES ─────────────────────────────────────────────

/**
 * Returns inquiries for a given agent, merging Blob-stored (real submitted
 * inquiries from the live site) with the seed mock data.
 */
export async function getInquiriesForAgent(agentId: string): Promise<Inquiry[]> {
  const [stored, mockListings] = await Promise.all([
    getStoredInquiries({ agentId }),
    getAllListings(),
  ])

  const hydrated: Inquiry[] = stored.map((s) => {
    const listing = mockListings.find((l) => l.id === s.listing_id) ?? mockListings[0]
    return {
      id: s.id,
      listing_id: s.listing_id ?? '',
      listing,
      agent_id: s.agent_id ?? agentId,
      name: s.name,
      email: s.email,
      phone: s.phone ?? '',
      message: s.message,
      status: 'new' as const,
      strata_lead_id: null,
      created_at: s.created_at,
    }
  })

  // Mock inquiries for the seeded agent (Sarah Chen / agent-1)
  const { getInquiriesByAgent: getMockInquiries } = await import('@/lib/data')
  const mockForAgent = getMockInquiries(agentId)

  return [...hydrated, ...mockForAgent].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const stored = await getStoredInquiries()
  const mockListings = await getAllListings()

  return stored.map((s) => {
    const listing = mockListings.find((l) => l.id === s.listing_id) ?? mockListings[0]
    return {
      id: s.id,
      listing_id: s.listing_id ?? '',
      listing,
      agent_id: s.agent_id ?? '',
      name: s.name,
      email: s.email,
      phone: s.phone ?? '',
      message: s.message,
      status: 'new' as const,
      strata_lead_id: null,
      created_at: s.created_at,
    }
  })
}

// ─── INTERNAL ──────────────────────────────────────────────

function applyFilters(listings: Listing[], filters?: SearchFilters): Listing[] {
  let results = listings.slice()

  if (filters?.type) {
    results = results.filter((l) => l.type === filters.type)
  }
  if (filters?.property_type) {
    results = results.filter((l) => l.property_type === filters.property_type)
  }
  if (filters?.district) {
    results = results.filter((l) => l.district === filters.district)
  }
  if (filters?.bedrooms) {
    results = results.filter((l) => l.bedrooms >= filters.bedrooms!)
  }
  if (filters?.min_price) {
    results = results.filter((l) => l.price >= filters.min_price!)
  }
  if (filters?.max_price) {
    results = results.filter((l) => l.price <= filters.max_price!)
  }
  if (filters?.mrt) {
    results = results.filter((l) =>
      l.mrt_nearest?.toLowerCase().includes(filters.mrt!.toLowerCase())
    )
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.mrt_nearest?.toLowerCase().includes(q)
    )
  }

  switch (filters?.sort) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      results.sort((a, b) => b.views - a.views)
      break
    case 'newest':
    default:
      results.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }

  return results
}

// Re-export getAgentById for convenience (server-only consumers)
export { getAgentById, getAgents }
