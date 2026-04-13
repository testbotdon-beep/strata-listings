import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Train,
  School,
  Trees,
  ShoppingBag,
  Utensils,
  Building2,
  TrendingUp,
  ChevronLeft,
  ArrowRight,
  Home,
  DollarSign,
  Users,
} from 'lucide-react'
import { getGuideBySlug, getAllGuides, getGuideByDistrict } from '@/lib/guides'
import { getListings } from '@/lib/data'
import { ListingCard } from '@/components/listing-card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) return { title: 'Guide not found — Strata Listings' }

  const title = `${guide.name} Property Guide — Schools, MRT & Prices | Strata Listings`
  const description = `${guide.tagline} Avg sale PSF $${guide.demographics.avgPsfSale.toLocaleString()}. Schools, MRT stations, amenities, and active listings for District ${guide.district}.`

  return {
    title,
    description,
    openGraph: {
      title: `${guide.name} — Singapore Property Guide`,
      description,
      images: [{ url: guide.heroImage, width: 1600, height: 700 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guide.name} — Singapore Property Guide`,
      description,
      images: [guide.heroImage],
    },
  }
}

const schoolTypeLabel: Record<string, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  jc: 'Junior College',
  international: 'International',
}

const amenityIcon = {
  mall: ShoppingBag,
  park: Trees,
  food: Utensils,
  hospital: Building2,
}

const amenityColour = {
  mall: 'bg-violet-100 text-violet-700',
  park: 'bg-emerald-100 text-emerald-700',
  food: 'bg-amber-100 text-amber-700',
  hospital: 'bg-sky-100 text-sky-700',
}

export default async function DistrictGuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const listings = getListings({ district: guide.district }).slice(0, 6)
  const similarGuides = guide.similarDistricts
    .map((d) => getGuideByDistrict(d))
    .filter(Boolean)

  const overviewParagraphs = guide.overview
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  const schoolsByType = guide.schools.reduce<Record<string, typeof guide.schools>>(
    (acc, school) => {
      if (!acc[school.type]) acc[school.type] = []
      acc[school.type].push(school)
      return acc
    },
    {}
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Back breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All guides
        </Link>
      </div>

      {/* Hero */}
      <section className="relative mt-4 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
            <Image
              src={guide.heroImage}
              alt={guide.name}
              fill
              priority
              className="object-cover opacity-70"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

            {/* Hero text */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-10">
              <span className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                District {guide.district}
              </span>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {guide.name}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-slate-300 sm:text-lg">
                {guide.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats row */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Avg sale PSF */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg Sale PSF</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              ${guide.demographics.avgPsfSale.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">per sq ft</p>
          </div>

          {/* Avg rental PSF */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg Rental PSF</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              ${guide.demographics.avgRentalPsf.toFixed(2)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">per sq ft / mo</p>
          </div>

          {/* YoY change */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">YoY Price Change</p>
            <p
              className={`mt-1.5 text-2xl font-bold ${
                guide.demographics.yoyPriceChange.startsWith('+')
                  ? 'text-emerald-600'
                  : 'text-rose-500'
              }`}
            >
              {guide.demographics.yoyPriceChange}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">last 12 months</p>
          </div>

          {/* MRT stations */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">MRT Stations</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              {guide.transport.mrtStations.length}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">serving this district</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 flex flex-col gap-12">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">
                About District {guide.district}
              </h2>
              <div className="flex flex-col gap-4">
                {overviewParagraphs.map((para, i) => (
                  <p key={i} className="text-[15px] text-slate-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            <Separator />

            {/* Highlights */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">
                Why people love it here
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {guide.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-slate-700 leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Transport */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                  <Train className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Getting around</h2>
              </div>

              <div className="flex flex-col gap-5">
                {/* MRT stations */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    MRT Stations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.transport.mrtStations.map((station) => (
                      <span
                        key={station}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-800"
                      >
                        <Train className="h-3 w-3" />
                        {station}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expressways */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Expressways
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.transport.expressways.map((exp) => (
                      <span
                        key={exp}
                        className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3.5 py-1.5 text-sm font-bold text-slate-700"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CBD commute */}
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white w-fit">
                  <TrendingUp className="h-4 w-4 shrink-0 text-slate-300" />
                  Commute to CBD:&nbsp;
                  <span className="font-bold">{guide.transport.commuteToCbd}</span>
                </div>
              </div>
            </section>

            <Separator />

            {/* Schools */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                  <School className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Schools</h2>
              </div>

              <div className="flex flex-col gap-6">
                {(['primary', 'secondary', 'jc', 'international'] as const)
                  .filter((type) => schoolsByType[type]?.length > 0)
                  .map((type) => (
                    <div key={type}>
                      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {schoolTypeLabel[type]}
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {schoolsByType[type].map((school) => (
                          <div
                            key={school.name}
                            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5"
                          >
                            <School className="h-4 w-4 shrink-0 text-amber-500" />
                            <span className="text-sm font-medium text-slate-800">{school.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <Separator />

            {/* Amenities */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                  <ShoppingBag className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Amenities</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {guide.amenities.map((amenity) => {
                  const Icon = amenityIcon[amenity.type]
                  const colourCls = amenityColour[amenity.type]
                  return (
                    <div
                      key={amenity.name}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colourCls}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{amenity.name}</p>
                        <p className="text-xs capitalize text-slate-400">{amenity.type}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator />

            {/* Property types */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  <Home className="h-5 w-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">What you&apos;ll find here</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {guide.propertyTypes.map((pt) => (
                  <Badge
                    key={pt}
                    variant="secondary"
                    className="rounded-full px-4 py-1.5 text-sm h-auto"
                  >
                    {pt}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Pros & Cons */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Pros &amp; cons</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Pros */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="mb-3 text-sm font-bold text-emerald-800 uppercase tracking-wide">
                    Pros
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {guide.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          ✓
                        </span>
                        <span className="text-sm text-emerald-900 leading-snug">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                  <p className="mb-3 text-sm font-bold text-rose-800 uppercase tracking-wide">
                    Cons
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {guide.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white font-bold leading-none" style={{ fontSize: '10px', paddingTop: '1px' }}>
                          ✕
                        </span>
                        <span className="text-sm text-rose-900 leading-snug">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Active listings */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Active listings in District {guide.district}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {listings.length > 0
                      ? `${listings.length} properties currently available`
                      : 'No active listings at the moment — check back soon.'}
                  </p>
                </div>
                {listings.length > 0 && (
                  <Link
                    href={`/listings?district=${guide.district}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {listings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                  <div className="mt-5 sm:hidden">
                    <Link
                      href={`/listings?district=${guide.district}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      View all listings in this district
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                  <p className="text-slate-500">
                    Be the first to list a property in District {guide.district}.
                  </p>
                  <Link
                    href="/listings"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Browse all listings
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </section>

            {/* Similar districts */}
            {similarGuides.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-5">Similar districts</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {similarGuides.map((sg) => {
                      if (!sg) return null
                      return (
                        <Link
                          key={sg.slug}
                          href={`/guides/${sg.slug}`}
                          className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                            <Image
                              src={sg.heroImage}
                              alt={sg.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-slate-900">
                              D{sg.district}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 p-3.5">
                            <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                              {sg.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
                              {sg.tagline}
                            </p>
                            <p className="mt-1.5 text-xs font-semibold text-primary flex items-center gap-1">
                              Explore guide <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            {/* Price ranges */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Price Ranges
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">For Sale</p>
                  <p className="text-base font-bold text-slate-900">{guide.priceRanges.salePrice}</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">For Rent</p>
                  <p className="text-base font-bold text-slate-900">{guide.priceRanges.rental}</p>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Typical buyers */}
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Typical Buyers
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {guide.demographics.typicalBuyers}
              </p>

              <Separator className="my-5" />

              {/* Quick stats */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Avg Sale PSF</span>
                  <span className="text-sm font-bold text-slate-900">
                    ${guide.demographics.avgPsfSale.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Avg Rental PSF</span>
                  <span className="text-sm font-bold text-slate-900">
                    ${guide.demographics.avgRentalPsf.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">YoY Change</span>
                  <span
                    className={`text-sm font-bold ${
                      guide.demographics.yoyPriceChange.startsWith('+')
                        ? 'text-emerald-600'
                        : 'text-rose-500'
                    }`}
                  >
                    {guide.demographics.yoyPriceChange}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">CBD commute</span>
                  <span className="text-sm font-bold text-slate-900">
                    {guide.transport.commuteToCbd}
                  </span>
                </div>
              </div>

              <Separator className="my-5" />

              <Link
                href={`/listings?district=${guide.district}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Browse D{guide.district} listings
              </Link>
            </div>
          </aside>
        </div>

        {/* CTA footer */}
        <div className="mt-16 rounded-2xl bg-slate-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find a home in {guide.name.split(' — ')[1] ?? `District ${guide.district}`}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Browse active listings, contact verified agents, and get expert guidance on your next
            property move.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/listings?district=${guide.district}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Browse all listings
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              Explore other districts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
