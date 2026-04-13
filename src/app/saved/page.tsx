'use client'

import Link from 'next/link'
import { Heart, ChevronLeft } from 'lucide-react'
import { getListings } from '@/lib/data'
import { ListingCard } from '@/components/listing-card'
import { useFavorites } from '@/lib/favorites'

export default function SavedListingsPage() {
  const favoriteIds = useFavorites()
  const allListings = getListings()
  const savedListings = allListings.filter((l) => favoriteIds.includes(l.id))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Back */}
        <div className="mb-6">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Saved Properties</h1>
              <p className="text-sm text-slate-500">
                {savedListings.length === 0
                  ? 'No saved properties yet'
                  : `${savedListings.length} saved propert${savedListings.length === 1 ? 'y' : 'ies'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {savedListings.length === 0 && (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Heart className="h-8 w-8 text-slate-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">No saved listings yet</h2>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                Tap the heart icon on any listing to save it here for quick access.
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Browse properties
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {savedListings.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
