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
  Zap,
  Calendar,
  Shield,
  Building2,
  ChevronLeft,
  Share2,
  Heart,
  Clock,
  Star,
} from 'lucide-react'
import { getListingById, formatPriceFull } from '@/lib/data'
import { LISTING_TYPE_LABELS, SG_DISTRICTS, PROPERTY_TYPE_LABELS, FURNISHING_LABELS } from '@/types/listing'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImageGallery } from '@/components/image-gallery'
import { InquiryForm } from '@/components/inquiry-form'

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

  return (
    <div className="min-h-screen bg-background">
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
                          ? 'inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white'
                          : 'inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white'
                      }
                    >
                      {LISTING_TYPE_LABELS[type]}
                    </span>
                    <Badge variant="secondary">
                      {PROPERTY_TYPE_LABELS[property_type]}
                    </Badge>
                    {agent.strata_agent_id && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                        <Zap className="h-3 w-3" />
                        Responds in &lt;5s
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl leading-tight">
                    {title}
                  </h1>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
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
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                    aria-label="Save listing"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">
                  {formatPriceFull(price, type)}
                </p>
                {listing.price_psf && (
                  <p className="text-base text-muted-foreground">
                    ${listing.price_psf.toLocaleString()} psf
                  </p>
                )}
              </div>

              {/* Key stats */}
              <div className="mt-5 flex flex-wrap items-center gap-5 rounded-xl bg-muted/50 px-5 py-4">
                {bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-foreground">{bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Bedroom{bedrooms !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-foreground">{bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Bathroom{bathrooms !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-semibold text-foreground">{sqft.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">sqft</p>
                  </div>
                </div>
                {floor_level && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-foreground">{floor_level}</p>
                      <p className="text-xs text-muted-foreground">Floor</p>
                    </div>
                  </div>
                )}
                {tenure && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-base font-semibold text-foreground">{tenure.split(' ')[0]}</p>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta info */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
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
              <h2 className="text-lg font-semibold text-foreground mb-4">
                About this property
              </h2>
              <div className="flex flex-col gap-3">
                {descParagraphs.map((para, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            <Separator />

            {/* Details grid */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Property details
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detailItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between rounded-lg bg-muted/40 px-4 py-3 gap-4"
                  >
                    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                    <span className="text-sm font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            {amenities.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
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

            <Separator />

            {/* Inquiry form (mobile — shown below main content on small screens) */}
            <section className="lg:hidden" id="inquiry-form-mobile">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Contact agent
              </h2>
              <InquiryForm listingId={id} agentName={agent.name} idPrefix="mobile-inquiry" />
            </section>
          </div>

          {/* ── Right / Sidebar column ── */}
          <aside className="lg:col-span-1 flex flex-col gap-5">
            {/* Agent card */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sticky top-20">
              {/* Agent info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted shrink-0 ring-2 ring-border">
                  <Image
                    src={agent.photo_url}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-tight">{agent.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{agent.agency}</p>
                  <p className="text-xs text-muted-foreground">
                    CEA: {agent.license_no}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {agent.strata_agent_id && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Zap className="h-2.5 w-2.5" />
                        AI-powered
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {agent.listings_count} listings
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick contact buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>

              {/* Agent bio */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                {agent.bio}
              </p>

              <Separator className="mb-5" />

              {/* Inquiry form — desktop sidebar */}
              <div className="hidden lg:block" id="inquiry-form">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Send an inquiry
                </h3>
                <InquiryForm listingId={id} agentName={agent.name} />
              </div>

              {/* View all by agent */}
              <div className="mt-5 pt-4 border-t border-border hidden lg:block">
                <Link
                  href={`/listings?agent=${agent.id}`}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View all listings by {agent.name} →
                </Link>
              </div>
            </div>

            {/* Strata AI badge — if applicable */}
            {agent.strata_agent_id && (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-blue-50 p-4 ring-1 ring-primary/15">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    AI-Powered Agent
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This agent uses Strata AI to respond to inquiries in under 5
                  seconds — any time of day.
                </p>
              </div>
            )}

            {/* Scheduling card */}
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Book a viewing</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Send an inquiry below and mention your preferred viewing date and time.
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
