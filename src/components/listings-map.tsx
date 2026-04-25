'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Listing } from '@/types/listing'

const fmtSGD = (v: number) =>
  new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }).format(v)

export function ListingsMap({ listings }: { listings: Listing[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let map: import('leaflet').Map | null = null

    async function init() {
      const L = (await import('leaflet')).default
      // CSS injected once
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
        link.setAttribute('data-leaflet', 'true')
        document.head.appendChild(link)
      }

      if (cancelled || !ref.current) return

      // Center on Singapore
      map = L.map(ref.current).setView([1.3521, 103.8198], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map)

      const validListings = listings.filter((l) => l.lat !== 0 && l.lng !== 0)
      validListings.forEach((listing) => {
        const m = L.marker([listing.lat, listing.lng]).addTo(map!)
        m.bindPopup(
          `<div style="min-width:180px"><strong>${listing.title.replace(/</g, '&lt;')}</strong><br/>` +
          `${fmtSGD(listing.price)}${listing.type === 'rent' ? '/mo' : ''}<br/>` +
          `${listing.bedrooms}BR · ${listing.sqft} sqft<br/>` +
          `<a href="/listing/${listing.id}" style="color:#2563eb;text-decoration:underline">View listing</a></div>`
        )
      })

      if (validListings.length > 0) {
        map.fitBounds(validListings.map((l) => [l.lat, l.lng] as [number, number]), { padding: [40, 40], maxZoom: 14 })
      }
    }
    init()

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [listings])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {listings.filter((l) => l.lat !== 0 && l.lng !== 0).length} of {listings.length} listings on map
        </p>
        <Link href="/listings" className="text-sm text-blue-600 hover:underline">
          List view →
        </Link>
      </div>
      <div ref={ref} className="h-[70vh] rounded-xl border border-slate-200 z-0" />
    </div>
  )
}
