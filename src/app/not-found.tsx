import Link from 'next/link'
import { Building2, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <Building2 className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        Property not found
      </h1>

      {/* Subtitle */}
      <p className="mt-3 max-w-sm text-base text-muted-foreground leading-relaxed">
        This listing may have been removed, rented out, or sold. Try searching
        for similar properties.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Search className="h-4 w-4" />
          Browse all listings
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* 404 hint */}
      <p className="mt-8 text-xs text-muted-foreground">Error 404 — Page not found</p>
    </div>
  )
}
