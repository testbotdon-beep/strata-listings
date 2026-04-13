import Link from 'next/link'
import { Building2, Share2, Globe, MessageSquare } from 'lucide-react'
import { FooterNewsletter } from '@/components/layout/footer-newsletter'

const BROWSE_LINKS = [
  { label: 'Buy', href: '/listings?type=sale' },
  { label: 'Rent', href: '/listings?type=rent' },
  { label: 'New Launches', href: '/listings?sort=newest' },
  { label: 'HDB', href: '/listings?property_type=hdb' },
  { label: 'Condos', href: '/listings?property_type=condo' },
  { label: 'Landed', href: '/listings?property_type=landed' },
  { label: 'Commercial', href: '/listings?property_type=commercial' },
]

const DISCOVER_LINKS = [
  { label: 'Neighbourhoods', href: '/listings' },
  { label: 'Insights', href: '/insights' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'For Agents', href: '/for-agents' },
]

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
  { label: 'Contact', href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookie Policy', href: '#' },
  { label: 'Disclaimer', href: '#' },
]

const SOCIAL_LINKS = [
  { icon: Share2, label: 'LinkedIn', href: '#' },
  { icon: Globe, label: 'Instagram', href: '#' },
  { icon: MessageSquare, label: 'Facebook', href: '#' },
]

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {heading}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-slate-500 transition-colors hover:text-slate-100"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand column — spans 2 on desktop */}
          <div className="col-span-2 flex flex-col gap-5 sm:col-span-3 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="size-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Strata <span className="text-primary">Listings</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Singapore&apos;s trusted property marketplace. Verified listings from licensed CEA agents across all 28 districts.
            </p>

            {/* Newsletter signup */}
            <FooterNewsletter />

            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterLinkColumn heading="Browse" links={BROWSE_LINKS} />
          <FooterLinkColumn heading="Discover" links={DISCOVER_LINKS} />
          <FooterLinkColumn heading="Company" links={COMPANY_LINKS} />
          <FooterLinkColumn heading="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-slate-500">
              &copy; 2026 Strata Listings Pte Ltd. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              CEA Estate Agent Licence: L3010858B
            </p>
          </div>
          <p className="max-w-md text-right text-xs leading-relaxed text-slate-600">
            Strata Listings is a registered marketplace. All listings are posted by CEA-licensed estate agents.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
