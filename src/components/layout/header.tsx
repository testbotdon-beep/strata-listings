'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Building2, Heart } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Buy', href: '/listings?type=sale' },
  { label: 'Rent', href: '/listings?type=rent' },
  { label: 'New Launches', href: '/listings?sort=newest' },
  { label: 'Commercial', href: '/listings?property_type=commercial' },
  { label: 'Agents', href: '/for-agents' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 supports-[backdrop-filter]:bg-white/90 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="size-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Strata <span className="text-primary">Listings</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Saved — placeholder */}
          <button
            type="button"
            aria-label="Saved properties"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Heart className="size-4" />
          </button>

          {/* List Your Property CTA */}
          <Button
            size="sm"
            variant="outline"
            className="text-sm font-semibold"
            render={<Link href="/for-agents" />}
          >
            List Your Property
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex h-16 items-center border-b border-slate-200/60 px-5">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                    <Building2 className="size-3.5 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    Strata <span className="text-primary">Listings</span>
                  </span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-3 border-t border-slate-200/60 pt-3">
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    render={<Link href="/for-agents" onClick={() => setOpen(false)} />}
                  >
                    List Your Property
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
