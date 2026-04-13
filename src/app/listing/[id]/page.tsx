import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Building2,
  ChevronLeft,
  Share2,
  Clock,
  Star,
} from 'lucide-react'
import { getListingById, getListings, formatPriceFull } from '@/lib/data'
import { LISTING_TYPE_LABELS, SG_DISTRICTS, PROPERTY_TYPE_LABELS, FURNISHING_LABELS } from '@/types/listing'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImageGallery } from '@/components/image-gallery'
import { InquiryForm } from '@/components/inquiry-form'
import { FavoriteButton } from '@/components/favorite-button'
import { ListingCard } from '@/components/listing-card'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = getListingById(id)
  if (!listing) return { title: 'Listing not found — Strata Listings' }

  const price = formatPriceFull(listing.price, listing.type)
  const description = listing.description.slice(0, 155) + '…'

  return {
    title: `${listing.title} — ${price} | Strata Listings`,
    description,
    openGraph: {
      title: `${listing.title} — ${price}`,
      description,
      images: listing.photos[0] ? [{ url: listing.photos[0] }] : undefined,
    },
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const listing = getListingById(id)

  if (!listing) notFound()

  const {
    title,
    description,
    price,
    type,
    property_type,
    bedrooms,
    bathrooms,
    sqft,
    address,
    district,
    postal_code,
    amenities,
    photos,
    floor_level,
    furnishing,
    tenure,
    top_year,
    mrt_nearest,
    mrt_distance_m,
    agent,
    views,
    created_at,
  } = listing

  const districtName = SG_DISTRICTS[district]
  const furnishingLabel = FURNISHING_LABELS[furnishing]

  const detailItems = [
    { label: 'Property Type', value: PROPERTY_TYPE_LABELS[property_type] },
    { label: 'Listing Type', value: LISTING_TYPE_LABELS[type] },
    { label: 'District', value: districtName ? `D${district} — ${districtName}` : `D${district}` },
    { label: 'Postal Code', value: postal_code },
    ...(mrt_nearest
      ? [
          {
            label: 'Nearest MRT',
            value: mrt_nearest + (mrt_distance_m ? ` (${mrt_distance_m}m away)` : ''),
          },
        ]
      : []),
    ...(top_year ? [{ label: 'TOP Year', value: String(top_year) }] : []),
    ...(tenure ? [{ label: 'Tenure', value: tenure }] : []),
    { label: 'Furnishing', value: furnishingLabel },
    ...(floor_level ? [{ label: 'Floor Level', value: floor_level }] : []),
  ]

  const descParagraphs = description
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  const listedDate = new Date(created_at).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Similar listings: same type + district, excluding current. Pad with same type if needed.
  const sameDistrictAndType = getListings({
    property_type: listing.property_type,
    district: listing.district,
  }).filter((l) => l.id !== id)

  const similarListings = sameDistrictAndType.length >= 3
    ? sameDistrictAndType.slice(0, 3)
    : [
        ...sameDistrictAndType,
        ...getListings({ property_type: listing.property_type })
          .filter((l) => l.id !== id && !sameDistrictAndType.some((s) => s.id === l.id))
          .slice(0, 3 - sameDistrictAndType.length),
      ]

  // Mortgage helper — 25yr, 75% LTV, 3.5% p.a.
  function monthlyMortgage(p: number): number {
    const principal = p * 0.75
    const r = 0.035 / 12
    const n = 300
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description.slice(0, 200),
    image: listing.photos[0],
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'SGD',
      availability: 'https://schema.org/InStock',
    },
    brand: {
      '@type': 'RealEstateAgent',
      name: listing.agent.name,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <div className="mb-5">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Left / Main column ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Gallery */}
            <ImageGallery photos={photos} title={title} />

            {/* Title + price block */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={
                        type === 'rent'
                          ? 'inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white'
                          : 'inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white'
                      }
                    >
                      {LISTING_TYPE_LABELS[type]}
                    </span>
                    <Badge variant="secondary">
                      {PROPERTY_TYPE_LABELS[property_type]}
                    </Badge>
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl leading-tight">
                    {title}
                  </h1>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{address}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Share listing"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <FavoriteButton listingId={id} variant="inline" />
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <p className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  {formatPriceFull(price, type)}
                </p>
                {listing.price_psf && (
                  <p className="text-base text-slate-500">
                    ${listing.price_psf.toLocaleString()} psf
                  </p>
                )}
              </div>

              {/* Key stats */}
              <div className="mt-5 flex flex-wrap items-center gap-5 rounded-xl bg-slate-50 px-5 py-4">
                {bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{bedrooms}</p>
                      <p className="text-xs text-slate-500">Bedroom{bedrooms !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-slate-900">{bathrooms}</p>
                    <p className="text-xs text-slate-500">Bathroom{bathrooms !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-slate-900">{sqft.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">sqft</p>
                  </div>
                </div>
                {floor_level && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{floor_level}</p>
                      <p className="text-xs text-slate-500">Floor</p>
                    </div>
                  </div>
                )}
                {tenure && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{tenure.split(' ')[0]}</p>
                      <p className="text-xs text-slate-500">Tenure</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta info */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Listed {listedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  {views.toLocaleString()} views
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                About this property
              </h2>
              <div className="flex flex-col gap-3">
                {descParagraphs.map((para, i) => (
                  <p key={i} className="text-sm text-slate-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            <Separator />

            {/* Details grid */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Property details
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detailItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between rounded-lg bg-slate-50 px-4 py-3 gap-4"
                  >
                    <span className="text-sm text-slate-500 shrink-0">{label}</span>
                    <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            {amenities.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Amenities &amp; facilities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="px-3 py-1 text-xs h-auto">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Similar listings */}
            {similarListings.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    Similar properties
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">
                    More {PROPERTY_TYPE_LABELS[listing.property_type]} in{' '}
                    {SG_DISTRICTS[listing.district]
                      ? `D${listing.district} — ${SG_DISTRICTS[listing.district]}`
                      : `District ${listing.district}`}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {similarListings.map((similar) => (
                      <ListingCard key={similar.id} listing={similar} />
                    ))}
                  </div>
                </section>
              </>
            )}

            <Separator />

            {/* Inquiry form (mobile) */}
            <section className="lg:hidden" id="inquiry-form-mobile">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Contact agent
              </h2>
              <InquiryForm listingId={id} agentName={agent.name} idPrefix="mobile-inquiry" />
            </section>
          </div>

          {/* ── Right / Sidebar column ── */}
          <aside className="lg:col-span-1 flex flex-col gap-5">
            {/* Agent card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sticky top-20">
              {/* Agent info */}
              <div className="flex items-start gap-4 mb-4">
                <Link href={`/agent/${agent.id}`} className="relative h-14 w-14 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-2 ring-slate-100 hover:ring-slate-300 transition-all">
                  <Image
                    src={agent.photo_url}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/agent/${agent.id}`}
                    className="font-semibold text-slate-900 leading-tight hover:text-primary transition-colors"
                  >
                    {agent.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{agent.agency}</p>
                  <p className="text-xs text-slate-500">CEA: {agent.license_no}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {agent.listings_count} listings
                    </span>
                    <Link
                      href={`/agent/${agent.id}`}
                      className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      View profile →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick contact buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>

              {/* Agent bio */}
              <p className="text-xs text-slate-500 leading-relaxed mb-5 line-clamp-3">
                {agent.bio}
              </p>

              <Separator className="mb-5" />

              {/* Inquiry form — desktop sidebar */}
              <div className="hidden lg:block" id="inquiry-form">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Send an inquiry
                </h3>
                <InquiryForm listingId={id} agentName={agent.name} />
              </div>

              {/* View all by agent */}
              <div className="mt-5 pt-4 border-t border-slate-100 hidden lg:block">
                <Link
                  href={`/listings?agent=${agent.id}`}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View all listings by {agent.name} →
                </Link>
              </div>
            </div>

            {/* Mortgage estimate card (sale only) */}
            {type === 'sale' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-900">Mortgage estimate</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-0.5">
                  Est. ${Math.round(monthlyMortgage(price)).toLocaleString()}/month
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  25-year loan at 3.5% interest, 75% LTV
                </p>
                <Link
                  href={`/calculators/mortgage?price=${price}`}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Calculate in detail →
                </Link>
              </div>
            )}

            {/* Book a viewing card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Book a viewing</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Send an inquiry and mention your preferred viewing date and time.
              </p>
              <a
                href="#inquiry-form"
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Request a viewing
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
