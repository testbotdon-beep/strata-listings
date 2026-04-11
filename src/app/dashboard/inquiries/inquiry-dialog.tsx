'use client'

import { Mail, Phone, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Inquiry } from '@/types/listing'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-700' },
  converted: { label: 'Converted', className: 'bg-emerald-100 text-emerald-700' },
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Link-styled button for base-ui (no asChild support)
function LinkButton({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
        'h-7 gap-1 px-2.5 text-[0.8rem]',
        'hover:bg-muted hover:text-foreground',
        className
      )}
    >
      {children}
    </a>
  )
}

export function InquiryDialog({ inquiry }: { inquiry: Inquiry }) {
  const statusCfg = STATUS_CONFIG[inquiry.status]
  const mailtoHref = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.listing.title)}`

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="text-xs shrink-0">
            View Full Message
          </Button>
        }
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Inquiry from {inquiry.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-gray-400">{formatDateLong(inquiry.created_at)}</span>
          </div>

          {/* Listing */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 flex items-start gap-3">
            {inquiry.listing.photos[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inquiry.listing.photos[0]}
                alt={inquiry.listing.title}
                className="size-14 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{inquiry.listing.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatPrice(inquiry.listing.price, inquiry.listing.type)} · D{inquiry.listing.district}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" className="shrink-0 text-gray-400 hover:text-gray-700">
              <ExternalLink className="size-3.5" />
            </Button>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Message</p>
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contact</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{inquiry.email}</span>
                </div>
                <LinkButton href={`mailto:${inquiry.email}`} className="text-xs text-blue-600">
                  Send Email
                </LinkButton>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{inquiry.phone}</span>
                </div>
                <LinkButton href={`tel:${inquiry.phone}`} className="text-xs text-blue-600">
                  Call
                </LinkButton>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={mailtoHref}
              className="flex flex-1 items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 px-2.5 text-sm font-medium transition-colors hover:opacity-90"
            >
              Reply via Email
            </a>
            <Button variant="outline" className="flex-1">
              Mark as Contacted
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
