import Link from 'next/link'
import {
  Building2,
  Home,
  TreePine,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { getFeaturedListings, getListings } from '@/lib/data'
import { ListingCard } from '@/components/listing-card'
import { SearchBar } from '@/components/search-bar'

const PROPERTY_TYPES = [
  {
    key: 'hdb',
    label: 'HDB Flats',
    description: 'Affordable public housing across every town',
    icon: Home,
    count: '4,200+',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'condo',
    label: 'Condos',
    description: 'Private condos with full facilities',
    icon: Building2,
    count: '6,800+',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    key: 'landed',
    label: 'Landed',
    description: 'Terraces, semi-Ds, and bungalows',
    icon: TreePine,
    count: '900+',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    key: 'commercial',
    label: 'Commercial',
    description: 'Offices, shophouses, and industrial',
    icon: Briefcase,
    count: '500+',
    color: 'bg-amber-50 text-amber-600',
  },
]

const POPULAR_AREAS = [
  {
    district: 9,
    name: 'Orchard / River Valley',
    description: "Singapore's premier shopping and lifestyle belt",
    tag: 'D9',
  },
  {
    district: 10,
    name: 'Tanglin / Holland',
    description: 'Leafy enclave of embassies and landed estates',
    tag: 'D10',
  },
  {
    district: 15,
    name: 'East Coast / Marine Parade',
    description: 'Vibrant beachside living with great food',
    tag: 'D15',
  },
  {
    district: 1,
    name: 'Marina Bay / CBD',
    description: "Iconic skyline and Singapore's financial heart",
    tag: 'D1',
  },
  {
    district: 11,
    name: 'Newton / Novena',
    description: 'Central, well-served, close to top schools',
    tag: 'D11',
  },
  {
    district: 20,
    name: 'Bishan / Ang Mo Kio',
    description: 'Family-friendly heartland with excellent amenities',
    tag: 'D20',
  },
]

const TRENDING_CHIPS = [
  { label: 'Orchard condos', q: 'Orchard condos' },
  { label: 'Tampines HDB', q: 'Tampines HDB' },
  { label: 'Sentosa', q: 'Sentosa' },
  { label: 'Tanjong Pagar', q: 'Tanjong Pagar' },
  { label: 'Bishan', q: 'Bishan' },
  { label: '3BR under $5k/mo', q: '3BR under $5k' },
  { label: 'New launches', q: 'new launch' },
  { label: 'Near MRT', q: 'near MRT' },
]

const MARKET_INSIGHTS = [
  {
    metric: 'HDB resale prices',
    value: '+3.2% YoY',
    source: 'Q1 2026 URA data',
    positive: true,
  },
  {
    metric: 'Private condo rentals',
    value: '$5.80 psf avg',
    source: 'Prime districts',
    positive: null,
  },
  {
    metric: 'New launch enquiries',
    value: '12,000+',
    source: 'Past 30 days',
    positive: null,
  },
]

export default function HomePage() {
  const featured = getFeaturedListings()
  const all = getListings()

  // Pad featured to 6 by appending first non-featured listings
  const featuredIds = new Set(featured.map((l) => l.id))
  const extras = all.filter((l) => !featuredIds.has(l.id)).slice(0, 6 - featured.length)
  const displayListings = [...featured, ...extras].slice(0, 6)

  // New launches: top_year >= 2026
  const newLaunches = all
    .filter((l) => l.top_year != null && l.top_year >= 2026)
    .slice(0, 3)
  const fallbackNewLaunches =
    newLaunches.length >= 2
      ? newLaunches
      : all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 lg:pt-28">
          <div className="flex flex-col items-center text-center gap-5">
            {/* Headline */}
            <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find a home you&apos;ll love in Singapore
            </h1>

            {/* Subtitle */}
            <p className="max-w-lg text-base text-slate-600 sm:text-lg leading-relaxed">
              Browse over 10,000 HDB flats, condos, and landed homes across
              every district.
            </p>

            {/* Search bar */}
            <div className="w-full max-w-2xl mt-1">
              <SearchBar />
            </div>

            {/* Trending chips */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {TRENDING_CHIPS.map(({ label, q }) => (
                  <Link
                    key={label}
                    href={`/listings?q=${encodeURIComponent(q)}`}
                    className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Listings ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Featured properties
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Handpicked listings from verified agents
              </p>
            </div>
            <Link
              href="/listings"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Browse by Type ────────────────────────────────────────── */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse by property type
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROPERTY_TYPES.map(({ key, label, description, icon: Icon, count, color }) => (
              <Link
                key={key}
                href={`/listings?property_type=${key}`}
                className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
                <p className="text-sm font-bold text-primary mt-auto">
                  {count} listings
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── New Launches ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                New launches
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upcoming projects from Singapore&apos;s top developers
              </p>
            </div>
            <Link
              href="/listings?sort=newest"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackNewLaunches.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Neighbourhoods ────────────────────────────────── */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Popular neighbourhoods
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Explore Singapore&apos;s most sought-after districts
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_AREAS.map(({ district, name, description, tag }) => (
              <Link
                key={district}
                href={`/listings?district=${district}`}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {tag}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Market Insights ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Singapore property insights
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest market data to help you make informed decisions
              </p>
            </div>
            <Link
              href="#"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Full market report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {MARKET_INSIGHTS.map(({ metric, value, source }) => (
              <div
                key={metric}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm font-medium text-slate-600">{metric}</p>
                  <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agent CTA (subtle) ────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                Are you a property agent?
              </span>{' '}
              List your properties for free and reach thousands of buyers.
            </p>
            <Link
              href="/for-agents"
              className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
