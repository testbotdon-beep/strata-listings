import type { Metadata } from 'next'
import { getAllListings } from '@/lib/listings'
import { ListingsMap } from '@/components/listings-map'

export const metadata: Metadata = {
  title: 'Map view — Strata Listings',
  description: 'Browse Singapore property listings on a map. Click any pin for details.',
  alternates: { canonical: '/listings/map' },
}

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const listings = await getAllListings()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Property map</h1>
        <p className="text-sm text-slate-500">Tap any pin to view details.</p>
      </div>
      <ListingsMap listings={listings.filter((l) => l.status === 'active')} />
    </div>
  )
}
