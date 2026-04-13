import Link from 'next/link'
import {
  Building2,
  MessageSquare,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Mail,
  Phone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getAgentById, formatPrice } from '@/lib/data'
import { getAgentListingsAsync, getInquiriesForAgent } from '@/lib/listings'

export const dynamic = 'force-dynamic'
import { PROPERTY_TYPE_LABELS } from '@/types/listing'

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-700' },
  sold: { label: 'Sold', className: 'bg-red-100 text-red-700' },
  rented: { label: 'Rented', className: 'bg-blue-100 text-blue-700' },
}

const INQUIRY_STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-700' },
  converted: { label: 'Converted', className: 'bg-emerald-100 text-emerald-700' },
}

export default async function DashboardPage() {
  const agent = getAgentById('agent-1')!
  const listings = await getAgentListingsAsync('agent-1')
  const inquiries = await getInquiriesForAgent('agent-1')

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0)
  const newInquiries = inquiries.filter(i => i.status === 'new').length
  const responseRate = inquiries.length > 0
    ? Math.round((inquiries.filter(i => i.status !== 'new').length / inquiries.length) * 100)
    : 0

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const recentListings = [...listings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  const stats = [
    {
      label: 'Total Listings',
      value: listings.length,
      icon: Building2,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      sub: `${listings.filter(l => l.type === 'sale').length} for sale · ${listings.filter(l => l.type === 'rent').length} for rent`,
    },
    {
      label: 'Active Inquiries',
      value: inquiries.length,
      icon: MessageSquare,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      sub: `${newInquiries} unread`,
    },
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      sub: 'Across all listings',
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      icon: TrendingUp,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      sub: 'Inquiries followed up',
    },
  ]

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Good morning, {agent.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s what&apos;s happening with your listings today.
          </p>
        </div>
        <Button render={<Link href="/dashboard/listings/new" />}>
          Add Listing
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
                </div>
                <div className={`flex size-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`size-4 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-3 border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900">Recent Inquiries</CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/inquiries" />} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map(inq => {
                  const statusCfg = INQUIRY_STATUS_CONFIG[inq.status]
                  return (
                    <div
                      key={inq.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar size="sm" className="shrink-0 mt-0.5">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
                          {inq.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{inq.name}</p>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{inq.listing.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{inq.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="size-3" />
                            {formatRelativeDate(inq.created_at)}
                          </span>
                          <a
                            href={`mailto:${inq.email}`}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Mail className="size-3" />
                            Email
                          </a>
                          <a
                            href={`tel:${inq.phone}`}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Phone className="size-3" />
                            Call
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card className="lg:col-span-2 border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold text-gray-900">My Listings</CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/listings" />} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {recentListings.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No listings yet.</p>
            ) : (
              <div className="space-y-3">
                {recentListings.map(listing => {
                  const statusCfg = STATUS_CONFIG[listing.status]
                  return (
                    <div
                      key={listing.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                    >
                      {/* Thumbnail */}
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
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                            {listing.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {PROPERTY_TYPE_LABELS[listing.property_type]} · {formatPrice(listing.price, listing.type)}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Eye className="size-3" />
                            {listing.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
