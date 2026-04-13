import { Mail, Phone, Clock, MessageSquare } from 'lucide-react'
import { getInquiriesForAgent } from '@/lib/listings'
import type { Inquiry } from '@/types/listing'
import { InquiryDialog } from './inquiry-dialog'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' },
  contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' },
  converted: { label: 'Converted', className: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
}

function InquiryRow({ inq }: { inq: Inquiry }) {
  const statusCfg = STATUS_CONFIG[inq.status]
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 px-5 py-5 hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-none">
      {/* Avatar */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white text-sm font-semibold">
        {inq.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">{inq.name}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              Inquiring about: <span className="font-medium text-gray-700">{inq.listing.title}</span>
            </p>
          </div>
          <InquiryDialog inquiry={inq} />
        </div>

        {/* Message preview */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">{inq.message}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="size-3.5" />
            {formatDate(inq.created_at)}
          </span>
          <a
            href={`mailto:${inq.email}`}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            <Mail className="size-3.5" />
            {inq.email}
          </a>
          <a
            href={`tel:${inq.phone}`}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            <Phone className="size-3.5" />
            {inq.phone}
          </a>
        </div>
      </div>
    </div>
  )
}

export default async function InquiriesPage() {
  const inquiries = await getInquiriesForAgent('agent-1')

  const sorted = [...inquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const newCount = inquiries.filter(i => i.status === 'new').length
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length
  const convertedCount = inquiries.filter(i => i.status === 'converted').length

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Inquiries</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {inquiries.length} total · {newCount} unread
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        <SummaryPill label="All" count={inquiries.length} active />
        <SummaryPill label="New" count={newCount} color="blue" />
        <SummaryPill label="Contacted" count={contactedCount} color="amber" />
        <SummaryPill label="Converted" count={convertedCount} color="emerald" />
      </div>

      {/* Inbox list */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 bg-white text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 mb-3">
            <MessageSquare className="size-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No inquiries yet</p>
          <p className="text-xs text-gray-400 mt-1">When buyers contact you, their messages will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {sorted.map(inq => (
            <InquiryRow key={inq.id} inq={inq} />
          ))}
        </div>
      )}
    </div>
  )
}

function SummaryPill({
  label,
  count,
  active,
  color,
}: {
  label: string
  count: number
  active?: boolean
  color?: 'blue' | 'amber' | 'emerald'
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  }
  const cls = active
    ? 'bg-gray-900 text-white'
    : color
      ? colorMap[color]
      : 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-white/20' : 'bg-black/10'}`}>
        {count}
      </span>
    </span>
  )
}
