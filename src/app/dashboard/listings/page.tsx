import Link from 'next/link'
import { Plus, Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAgentListings, formatPrice } from '@/lib/data'
import { PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from '@/types/listing'

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' },
  sold: { label: 'Sold', className: 'bg-red-100 text-red-700 ring-1 ring-red-200' },
  rented: { label: 'Rented', className: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ListingsPage() {
  const listings = getAgentListings('agent-1')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button render={<Link href="/dashboard/listings/new" />} className="flex items-center gap-1.5">
          <Plus className="size-4" />
          Add New Listing
        </Button>
      </div>

      {/* Listings table */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 bg-white">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 mb-3">
            <Plus className="size-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No listings yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first listing to get started.</p>
          <Button render={<Link href="/dashboard/listings/new" />} className="mt-4">
            Add New Listing
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid md:grid-cols-[auto_160px_120px_90px_100px_80px_80px] items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Listing</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Views</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide sr-only">Actions</span>
          </div>

          <div className="divide-y divide-gray-100">
            {listings.map(listing => {
              const statusCfg = STATUS_CONFIG[listing.status]
              return (
                <div
                  key={listing.id}
                  className="flex flex-col md:grid md:grid-cols-[auto_160px_120px_90px_100px_80px_80px] items-start md:items-center gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Listing info */}
                  <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
                    <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {listing.photos[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={listing.photos[0]}
                          alt={listing.title}
                          className="size-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        D{listing.district} · {listing.bedrooms > 0 ? `${listing.bedrooms}BR · ` : ''}{listing.sqft.toLocaleString()} sqft
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">
                      {PROPERTY_TYPE_LABELS[listing.property_type]}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">
                      {LISTING_TYPE_LABELS[listing.type]}
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(listing.price, listing.type)}
                  </p>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.className}`}
                  >
                    {statusCfg.label}
                  </span>

                  {/* Date */}
                  <p className="text-xs text-gray-500">{formatDate(listing.created_at)}</p>

                  {/* Views */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="size-3.5 text-gray-400" />
                    {listing.views.toLocaleString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-gray-400 hover:text-gray-700"
                      title="Edit listing"
                    >
                      <Edit className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-gray-400 hover:text-red-600"
                      title="Delete listing"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-gray-400 hover:text-gray-700"
                      title="More options"
                    >
                      <MoreVertical className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
