import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact — Strata Listings',
  description:
    'Get in touch with the Strata Listings team. We\'re here for general inquiries, partnership opportunities, press, and support.',
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@strata-listings.sg',
    href: 'mailto:hello@strata-listings.sg',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+65 6123 4567',
    href: 'tel:+6561234567',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: '1 Raffles Place #40-01, Singapore 048616',
    href: 'https://maps.google.com/?q=1+Raffles+Place+Singapore',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Clock,
    label: 'Office hours',
    value: 'Mon–Fri, 9:00–18:00 SGT',
    href: null,
    color: 'bg-amber-50 text-amber-600',
  },
]

const FAQ = [
  {
    q: 'How do I list my property on Strata Listings?',
    a: 'All listings on Strata Listings are posted by CEA-licensed estate agents. If you\'re a homeowner looking to sell or rent, connect with one of our partner agents via the For Agents page — they\'ll handle the listing on your behalf.',
  },
  {
    q: 'Is Strata Listings free for buyers and renters?',
    a: 'Yes, completely free. Browsing listings, saving properties, and contacting agents costs nothing. Agents pay a subscription to list on our platform.',
  },
  {
    q: 'How do I know an agent is legitimate?',
    a: 'Every agent on Strata Listings is verified against the Council for Estate Agencies (CEA) public register. You\'ll see their CEA licence number on their profile. You can verify this independently at the CEA public register at app.cea.gov.sg.',
  },
  {
    q: 'I found a listing that looks incorrect or suspicious. What should I do?',
    a: 'Please report it using the flag icon on any listing page, or email us at hello@strata-listings.sg with the listing URL. We investigate all reports within 24 hours.',
  },
  {
    q: 'Do you cover all property types in Singapore?',
    a: 'Yes — HDB flats, private condos, landed homes (terrace, semi-D, bungalow), commercial shophouses, office spaces, and industrial units. We cover all 28 postal districts of Singapore.',
  },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl text-balance">
            Get in touch
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Questions, partnerships, press enquiries, or support — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Form */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <ContactForm />
            </div>

            {/* Right: Contact info */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Contact information</h2>
                <div className="flex flex-col gap-4">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-0.5 text-sm font-medium text-slate-900 hover:text-primary transition-colors break-words"
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response time note */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900 mb-1">Response time</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We aim to respond to all enquiries within one business day. For urgent matters, please call us directly during office hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="flex flex-col divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white overflow-hidden">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="px-6 py-5">
                <p className="font-semibold text-slate-900 text-sm">{q}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
