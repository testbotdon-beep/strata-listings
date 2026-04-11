'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Building2 } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Buy', href: '/listings?type=sale' },
  { label: 'Rent', href: '/listings?type=rent' },
  { label: 'Agents', href: '/listings' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="size-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Strata <span className="text-primary">Listings</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Button size="sm" render={<Link href="/dashboard" />}>
            List Your Property
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex h-16 items-center border-b border-border/60 px-5">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                    <Building2 className="size-3.5 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight text-foreground">
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
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-3 border-t border-border/60 pt-3">
                  <Button
                    className="w-full"
                    size="sm"
                    render={<Link href="/dashboard" onClick={() => setOpen(false)} />}
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
