import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  Zap,
  ListChecks,
  MessageCircle,
  MapPin,
  Star,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Agents — Strata Listings',
  description:
    'List your properties free on Strata Listings. Save $500-1000/mo vs PropertyGuru. Buyers reach you directly on WhatsApp with full listing context.',
}

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Free listings, forever',
    description:
      'No listing fees. No featured upgrades. Save $500-1000/mo compared to PropertyGuru. Your listings reach buyers through organic SEO and direct traffic.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp-first contact',
    description:
      'Buyers tap one button and message you directly on WhatsApp — with the listing title and URL pre-filled so you know exactly what they are interested in.',
  },
  {
    icon: Zap,
    title: 'Pre-qualified lead context',
    description:
      'Every WhatsApp inquiry arrives with the listing context baked in. If you already use Strata AI, your assistant picks up the conversation instantly with full listing data.',
  },
  {
    icon: MapPin,
    title: 'Built for Singapore',
    description:
      'HDB, condo, landed, commercial. Full district search, PSF insights, and CPF / ABSD calculators built in for every listing detail page.',
  },
]

export default function ForAgentsPage() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8 lg:pt-32">
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80">
              <Zap className="h-3 w-3 text-amber-400" />
              Strata Listings — For Agents
            </span>

            {/* Headline */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              List free. Reach buyers on WhatsApp.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
              Singapore&apos;s property marketplace built around how agents
              actually work. List properties for free, save $500-1000/mo vs
              PropertyGuru, and get buyers messaging you directly on WhatsApp
              with the listing context pre-loaded.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://strata.uqlabs.co"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Learn about Strata AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything you need to close more deals
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Built specifically for Singapore property agents
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Up and running in minutes
            </h2>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-6">
            {[
              {
                step: '01',
                title: 'Create your free account',
                description:
                  'Sign up in 30 seconds. Add your CEA licence, agency, and contact details.',
              },
              {
                step: '02',
                title: 'List your properties',
                description:
                  'Upload photos, set the price, add details. Your listings go live on the marketplace immediately.',
              },
              {
                step: '03',
                title: 'Buyers WhatsApp you',
                description:
                  'Every inquiry comes straight to your WhatsApp with the listing title and URL pre-filled.',
              },
              {
                step: '04',
                title: 'Close the deal',
                description:
                  'Reply in your usual way, or pair with Strata AI for 24/7 automatic qualification and viewing bookings.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="flex-1 flex flex-col gap-3">
                <span className="text-3xl font-bold text-primary/20">{step}</span>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 mb-10">
            Strata Listings is free forever for agents. No hidden fees,
            no featured upgrades, no commission on closed deals.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-left">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                  Free Forever
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  $0
                  <span className="text-base font-normal text-slate-500">/month</span>
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Unlimited listings. No credit card required.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6 grid sm:grid-cols-2 gap-3">
              {[
                'Unlimited listings',
                'Unlimited photos per listing',
                'Agent profile page with all your listings',
                'WhatsApp click-to-chat on every listing',
                'District, MRT, and PSF search',
                'SEO-optimised listing pages',
                'Full dashboard with view analytics',
                'No commission on closed deals',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Already use Strata AI for WhatsApp? Your Strata Listings account links automatically — buyer inquiries flow into your existing pipeline.
          </p>
        </div>
      </section>

      {/* ─── Testimonial ───────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-lg font-medium text-slate-800 leading-relaxed mb-6">
            &ldquo;I was paying PropertyGuru $800 a month for listings. Switched to
            Strata Listings and now buyers message me directly on WhatsApp with
            the listing title already in their first message. Zero downside,
            massive savings.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              SC
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">Sarah Chen</p>
              <p className="text-xs text-slate-500">ERA Realty Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-3">
            Ready to get started?
          </h2>
          <p className="text-slate-500 mb-8">
            Join hundreds of Singapore agents already using Strata to close more deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Sign up now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://strata.uqlabs.co"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Learn about Strata AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
