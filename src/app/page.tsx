import Link from 'next/link'
import {
  Building2,
  Home,
  TreePine,
  Briefcase,
  ArrowRight,
  Zap,
  Clock,
  Users,
  LayoutGrid,
} from 'lucide-react'
import { getFeaturedListings } from '@/lib/data'
import { ListingCard } from '@/components/listing-card'
import { SearchBar } from '@/components/search-bar'

const PROPERTY_TYPES = [
  {
    key: 'hdb',
    label: 'HDB Flats',
    description: 'Affordable public housing across Singapore',
    icon: Home,
    count: '4,200+',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'condo',
    label: 'Condominiums',
    description: 'Private condos with full facilities',
    icon: Building2,
    count: '6,800+',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    key: 'landed',
    label: 'Landed Property',
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
    description: 'Leafy enclave of embassies and landed homes',
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

const STATS = [
  { value: '12,000+', label: 'Active Listings', icon: LayoutGrid },
  { value: '500+', label: 'Verified Agents', icon: Users },
  { value: '<5s', label: 'AI Response Time', icon: Zap },
  { value: '24/7', label: 'Always Available', icon: Clock },
]

export default function HomePage() {
  const featured = getFeaturedListings()

  return (
    <div className="flex flex-col">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-100/40 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" />
              Powered by Strata AI — responds in under 5 seconds
            </span>

            {/* Headline */}
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find Your Perfect Home{' '}
              <span className="text-primary">in Singapore</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Browse thousands of properties across Singapore. From HDB flats to
              luxury condos, find your next home with Strata Listings.
            </p>

            {/* Search bar */}
            <div className="w-full max-w-2xl mt-2">
              <SearchBar />
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/80 ring-1 ring-foreground/8 px-4 py-5 shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Listings ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Featured Properties
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hand-picked listings with verified agents
              </p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Property Types ────────────────────────────────────────── */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Browse by Property Type
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROPERTY_TYPES.map(({ key, label, description, icon: Icon, count, color }) => (
              <Link
                key={key}
                href={`/listings?property_type=${key}`}
                className="group flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-foreground/10 hover:ring-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
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

      {/* ─── Popular Areas ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Popular Neighbourhoods
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore properties in Singapore&apos;s most sought-after districts
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_AREAS.map(({ district, name, description, tag }) => (
              <Link
                key={district}
                href={`/listings?district=${district}`}
                className="group flex items-start gap-4 rounded-xl bg-white p-5 ring-1 ring-foreground/10 hover:ring-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {tag}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agent CTA ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Are you a property agent?
              </h2>
              <p className="mt-3 max-w-md text-sm text-blue-100 leading-relaxed">
                List your properties for free with Strata Listings. Get instant
                lead responses with our AI-powered platform — never miss a
                qualified buyer or tenant again.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90 transition-colors"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://strata.uqlabs.co"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Learn about Strata AI
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
