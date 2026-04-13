import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Award,
  Star,
  ChevronLeft,
  Clock,
  Calendar,
  MapPin,
  Globe,
} from 'lucide-react'
import { getAgentById } from '@/lib/data'
import { getAgentListingsAsync } from '@/lib/listings'

export const dynamic = 'force-dynamic'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ListingCard } from '@/components/listing-card'
import { AgentContactForm } from '@/components/agent-contact-form'

interface PageProps {
  params: Promise<{ id: string }>
}

// Per-agent specialisation + language data (hardcoded for demo)
const AGENT_META: Record<
  string,
  { specialisations: string[]; languages: string[] }
> = {
  'agent-1': {
    specialisations: ['Luxury Condos', 'District 9-11', 'Expatriate Housing'],
    languages: ['English', 'Mandarin'],
  },
  'agent-2': {
    specialisations: ['HDB Resale', 'East Singapore', 'First-Time Buyers'],
    languages: ['English', 'Mandarin', 'Malay'],
  },
  'agent-3': {
    specialisations: ['Landed Properties', 'Good Class Bungalows', 'District 10-15'],
    languages: ['English', 'Mandarin', 'Malay'],
  },
  'agent-4': {
    specialisations: ['Commercial Offices', 'Industrial Units', 'Shophouses'],
    languages: ['English', 'Mandarin'],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const agent = getAgentById(id)
  if (!agent) return { title: 'Agent not found — Strata Listings' }

  return {
    title: `${agent.name} — ${agent.agency} | Strata Listings`,
    description: agent.bio.slice(0, 155),
  }
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) notFound()

  const listings = await getAgentListingsAsync(agent.id)
  const meta = AGENT_META[agent.id] ?? {
    specialisations: ['Residential', 'Singapore Properties'],
    languages: ['English'],
  }

  const agentInitials = agent.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Years active from created_at
  const yearsActive = new Date().getFullYear() - new Date(agent.created_at).getFullYear()
  const yearsLabel = yearsActive >= 10 ? '10+ years' : `${yearsActive}+ years`

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Back breadcrumb */}
        <div className="mb-6">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>

        {/* ── Agent hero card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">

            {/* Avatar */}
            <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-32 sm:w-32">
              <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-slate-100">
                <Image
                  src={agent.photo_url}
                  alt={agent.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {agent.name}
              </h1>
              <p className="mt-1 text-base text-slate-600">{agent.agency}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                CEA Licence: {agent.license_no}
              </p>

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">{agent.listings_count}</span>
                  <span className="text-slate-500">listings</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">4.9</span>
                  <span className="text-slate-500">rating</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">&lt; 1 hour</span>
                  <span className="text-slate-500">response</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">{yearsLabel}</span>
                  <span className="text-slate-500">experience</span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: <Building2 className="h-5 w-5 text-slate-400" />,
              value: agent.listings_count.toString(),
              label: 'Total Listings',
            },
            {
              icon: <Clock className="h-5 w-5 text-slate-400" />,
              value: '< 1 hour',
              label: 'Avg. Response Time',
            },
            {
              icon: <Calendar className="h-5 w-5 text-slate-400" />,
              value: yearsLabel,
              label: 'Years Active',
            },
            {
              icon: <Star className="h-5 w-5 fill-amber-400 text-amber-400" />,
              value: '4.9 / 5.0',
              label: 'Client Rating',
            },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-center"
            >
              <div className="flex justify-center mb-2">{icon}</div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Main layout: left content + right sidebar ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* About section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                About {agent.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {agent.bio}
              </p>

              <Separator className="mb-5" />

              {/* Specialisations */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">Specialisations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meta.specialisations.map((s) => (
                    <Badge key={s} variant="secondary" className="px-3 py-1 text-xs h-auto">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meta.languages.map((l) => (
                    <Badge key={l} variant="outline" className="px-3 py-1 text-xs h-auto">
                      {l}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Active listings section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Listings by {agent.name}
                </h2>
                <span className="text-sm text-slate-500">
                  {listings.length} active
                </span>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600">No active listings</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Check back soon or contact {agent.name} directly.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Contact {agent.name}
              </h3>
              <div className="flex items-center gap-1.5 mb-5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <p className="text-xs text-slate-500">{agent.agency}</p>
              </div>

              <AgentContactForm agentName={agent.name} agentId={agent.id} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
