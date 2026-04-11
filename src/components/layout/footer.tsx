import Link from 'next/link'
import { Building2 } from 'lucide-react'

const FOOTER_LINKS = {
  Browse: [
    { label: 'Buy', href: '/listings?type=sale' },
    { label: 'Rent', href: '/listings?type=rent' },
    { label: 'HDB', href: '/listings?property_type=hdb' },
    { label: 'Condo', href: '/listings?property_type=condo' },
    { label: 'Landed', href: '/listings?property_type=landed' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
  Resources: [
    { label: 'Blog', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Market Report', href: '#' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="size-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Strata <span className="text-primary">Listings</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Find your next home in Singapore. Browse thousands of verified
              listings with AI-powered agent support.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Strata Listings. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <span className="font-medium text-primary">Strata AI</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
