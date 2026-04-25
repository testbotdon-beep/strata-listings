import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllListings } from '@/lib/listings'
import type { ListingType, PropertyType, SearchFilters } from '@/types/listing'

export const dynamic = 'force-dynamic'
import { ListingCard } from '@/components/listing-card'
import { ListingFilters } from '@/components/listing-filters'
import { SearchBar } from '@/components/search-bar'

export const metadata: Metadata = {
  title: 'Browse Properties — Strata Listings',
  description:
    'Search Singapore property listings. Filter by type, district, price, bedrooms, MRT and more.',
}

interface PageProps {
  searchParams: Promise<{
    type?: string
    property_type?: string
    district?: string
    min_price?: string
    max_price?: string
    bedrooms?: string
    mrt?: string
    q?: string
    sort?: string
  }>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters: SearchFilters = {}
  if (params.type === 'rent' || params.type === 'sale') {
    filters.type = params.type as ListingType
  }
  if (params.property_type) {
    filters.property_type = params.property_type as PropertyType
  }
  if (params.district) {
    const d = parseInt(params.district, 10)
    if (!isNaN(d)) filters.district = d
  }
  if (params.min_price) {
    const v = parseFloat(params.min_price)
    if (!isNaN(v)) filters.min_price = v
  }
  if (params.max_price) {
    const v = parseFloat(params.max_price)
    if (!isNaN(v)) filters.max_price = v
  }
  if (params.bedrooms) {
    const v = parseInt(params.bedrooms, 10)
    if (!isNaN(v)) filters.bedrooms = v
  }
  if (params.mrt) filters.mrt = params.mrt
  if (params.q) filters.query = params.q
  if (params.hdb_type) filters.hdb_type = params.hdb_type as SearchFilters['hdb_type']
  if (params.furnishing) filters.furnishing = params.furnishing as SearchFilters['furnishing']
  if (params.pets_allowed === 'true') filters.pets_allowed = true
  else if (params.pets_allowed === 'false') filters.pets_allowed = false
  if (params.cooking_allowed === 'true') filters.cooking_allowed = true
  else if (params.cooking_allowed === 'false') filters.cooking_allowed = false
  if (
    params.sort === 'newest' ||
    params.sort === 'price_asc' ||
    params.sort === 'price_desc' ||
    params.sort === 'popular'
  ) {
    filters.sort = params.sort
  }

  const listings = await getAllListings(filters)
  const count = listings.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile search bar */}
      <div className="mb-6 lg:hidden">
        <SearchBar />
      </div>

      {/* Page header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {filters.type === 'rent'
              ? 'Properties for Rent'
              : filters.type === 'sale'
              ? 'Properties for Sale'
              : 'All Properties'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {count === 0
              ? 'No properties found'
              : `${count} propert${count === 1 ? 'y' : 'ies'} found`}
          </p>
        </div>
        <a
          href="/listings/map"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          Map view
        </a>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <Suspense fallback={null}>
          <ListingFilters />
        </Suspense>

        {/* Listings grid */}
        <div className="flex-1 min-w-0">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No properties match your filters
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Try adjusting your search criteria — remove some filters or
                broaden your price range.
              </p>
              <a
                href="/listings"
                className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </a>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
