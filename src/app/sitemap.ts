import type { MetadataRoute } from 'next'
import { getListings, getAgents } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://listings.uqlabs.co'
  const listings = getListings()
  const agents = getAgents()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/listings`, lastModified: new Date(), priority: 0.9, changeFrequency: 'hourly' },
    { url: `${baseUrl}/for-agents`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/guides`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/insights`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
  ]

  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/listing/${l.id}`,
    lastModified: new Date(l.updated_at),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const agentPages: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${baseUrl}/agent/${a.id}`,
    lastModified: new Date(),
    priority: 0.6,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...listingPages, ...agentPages]
}
