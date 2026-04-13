'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'
import { FavoriteButton } from '@/components/favorite-button'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const {
    id,
    type,
    title,
    address,
    price,
    bedrooms,
    bathrooms,
    sqft,
    photos,
    featured,
    agent,
    property_type,
  } = listing

  const photo = photos[0] ?? ''
  const agentInitials = agent.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Overlay-link pattern to avoid nested <a> tags:
  // The Card container is a plain <div>. The main Link is absolute-positioned
  // covering the entire card (z-10). The agent Link and favorite button sit
  // above the overlay (z-20) so they intercept clicks independently.
  return (
    <Card
      className={cn(
        'group/card relative overflow-hidden p-0 gap-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        className
      )}
    >
      {/* Full-card click target (overlay, no children rendered directly through it) */}
      <Link
        href={`/listing/${id}`}
        aria-label={title}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none"
      />

      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={photo}
          alt={title}
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Type badge — top left */}
        <div className="absolute left-3 top-3 z-20 pointer-events-none">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm',
              type === 'sale'
                ? 'bg-slate-900/90 text-white'
                : 'bg-emerald-500/95 text-white'
            )}
          >
            {type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Featured badge + favorite — top right */}
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5">
          {featured && (
            <span className="inline-flex items-center rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-sm pointer-events-none">
              Featured
            </span>
          )}
          <FavoriteButton listingId={id} variant="floating" />
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col gap-3 px-4 pb-4 pt-3">
        {/* Price */}
        <p className="text-xl font-bold text-slate-900">
          {formatPrice(price, type)}
        </p>

        {/* Title + address */}
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-800 leading-snug">
            {title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="size-3 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </p>
        </div>

        {/* Stats row */}
        {property_type !== 'commercial' ? (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Bed className="size-3.5 shrink-0" />
              <span>
                {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5 shrink-0" />
              <span>
                {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Maximize className="size-3.5 shrink-0" />
              <span>{sqft.toLocaleString()} sqft</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Maximize className="size-3.5 shrink-0" />
            <span>{sqft.toLocaleString()} sqft</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Agent row — separate link above the overlay */}
        <Link
          href={`/agent/${agent.id}`}
          className="relative z-20 flex min-w-0 items-center gap-2 rounded-lg p-1 -m-1 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Avatar size="sm">
            <AvatarImage src={agent.photo_url} alt={agent.name} />
            <AvatarFallback>{agentInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-700">
              {agent.name}
            </p>
            <p className="truncate text-[10px] text-slate-500">
              {agent.agency}
            </p>
          </div>
        </Link>
      </div>
    </Card>
  )
}

export default ListingCard
