import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, Home } from 'lucide-react'
import { getAllGuides } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Singapore Neighbourhood Guides — Strata Listings',
  description:
    'Explore in-depth guides to Singapore\'s most sought-after property districts. School catchments, MRT connectivity, price trends, and lifestyle insights for every neighbourhood.',
  openGraph: {
    title: 'Singapore Neighbourhood Guides — Strata Listings',
    description:
      'In-depth guides to Singapore\'s most sought-after property districts. Schools, transport, prices, and lifestyle — everything you need to choose the right neighbourhood.',
    type: 'website',
  },
}

export default function GuidesPage() {
  const guides = getAllGuides()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)',
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Link href="/" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-300">Neighbourhood Guides</span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Singapore Neighbourhood Guides
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 leading-relaxed">
            Find the perfect district for your next home
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-400 leading-relaxed">
            Singapore is divided into 28 postal districts, each with its own character, school
            catchments, transport links, and lifestyle. Explore our in-depth guides to help you
            choose the right neighbourhood — whether you&apos;re buying, renting, or investing.
          </p>

          {/* Stat pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              '6 in-depth guides',
              'Transport & MRT',
              'School catchments',
              'Price analysis',
              'Pros & cons',
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-3.5 py-1.5 text-xs font-medium text-slate-300"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Guides grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Explore by District</h2>
          <p className="mt-1.5 text-slate-500">
            Click any guide for full school listings, transport details, price data, and property recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* Hero image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <Image
                  src={guide.heroImage}
                  alt={guide.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                {/* District badge */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                    D{guide.district}
                  </span>
                </div>

                {/* PSF tag */}
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    from ${guide.demographics.avgPsfSale.toLocaleString()} psf
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                    {guide.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {guide.tagline}
                  </p>
                </div>

                {/* Highlights preview */}
                <ul className="flex flex-col gap-1.5">
                  {guide.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        ✓
                      </span>
                      <span className="line-clamp-1">{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick stats */}
                <div className="flex items-center gap-4 pt-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Sale PSF</p>
                    <p className="text-sm font-bold text-slate-900">${guide.demographics.avgPsfSale.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">MRT Stations</p>
                    <p className="text-sm font-bold text-slate-900">{guide.transport.mrtStations.length}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">YoY</p>
                    <p className={`text-sm font-bold ${guide.demographics.yoyPriceChange.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {guide.demographics.yoyPriceChange}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  Explore guide
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Not sure where to start?</h2>
          <p className="mt-3 text-slate-600">
            Browse all active listings across Singapore and filter by district, property type,
            budget, and MRT proximity to find your perfect match.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            Browse all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
