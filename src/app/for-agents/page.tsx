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
    '5 property listings free for everyone. 15 free if you subscribe to Strata. $30/month for 15 listings (launch price). 10× cheaper than PropertyGuru.',
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Up to 15 listings',
    description:
      '5 listings free for everyone. 15 if you subscribe to Strata AI, or pay $30/mo (launch price) for 15. No per-listing credits, no daily fees, no "featured boost" upsells. HDB, condo, landed, commercial — whatever you\'ve got.',
  },
  {
    icon: MessageCircle,
    title: 'Buyers message you on WhatsApp',
    description:
      'Every listing has a one-tap WhatsApp button that pre-fills the listing title and URL. You get leads on the platform you already use, with full context from the start.',
  },
  {
    icon: ListChecks,
    title: 'SEO-optimised discovery',
    description:
      'Your listings show up on Google searches for "Orchard condo", "Bishan HDB", "Jurong East landed" and every district. Free traffic, no ad spend.',
  },
  {
    icon: MapPin,
    title: 'Built for Singapore',
    description:
      'Full district, MRT, and PSF search. Built-in TDSR, stamp duty, and mortgage calculators on every listing page. Buyers arrive pre-qualified.',
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
              5 listings free. 15 with Strata.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
              Singapore&apos;s property marketplace, built for agents. Post
              listings for a fraction of PropertyGuru, with buyers reaching you
              directly on WhatsApp. Already a Strata AI subscriber?{' '}
              <span className="text-white font-semibold">
                You get 15 listings free.
              </span>
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Start free — 5 listings
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
                title: 'Sign up in 30 seconds',
                description:
                  'Add your CEA licence, agency, and contact details. Already on Strata AI? Use the same email — Listings unlocks free, instantly.',
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              5 listings free. 15 with Strata or $30/mo. No ad credits, no
              boost upsells, no commission on closed deals.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 items-stretch">
            {/* Free tier */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Free
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  No card. Get started in 60 seconds.
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  '5 listings',
                  'Unlimited photos per listing',
                  'WhatsApp click-to-chat',
                  'SEO-optimised pages',
                  'District, MRT, and PSF placement',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-900 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Sign up free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Paid Listings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col relative">
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Launch
              </span>
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Pro
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-5xl font-bold text-slate-900">$30</span>
                  <span className="text-base text-slate-500">/month</span>
                  <span className="text-xs text-slate-400 line-through">$60</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Or $324/yr — save 10%. Cancel anytime.
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  '15 listings',
                  'Everything in free, plus:',
                  'Agent profile page with all your properties',
                  'Listing views + click analytics',
                  'No commission on closed deals',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-900 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Start now — $30/mo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Strata bundle */}
            <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-blue-50 p-6 shadow-sm flex flex-col relative">
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <Zap className="h-3 w-3" />
                Best value
              </span>
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  Strata AI + Listings
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-5xl font-bold text-slate-900">$60</span>
                  <span className="text-base text-slate-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">15 listings included free</span>
                  {' '}— normally $30/mo on its own.
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[
                  'Everything in Listings Pro',
                  'Strata AI WhatsApp assistant',
                  'AI qualifies buyers in under 5 seconds, 24/7',
                  'Auto lead scoring + viewing scheduler',
                  '300 AI-qualified leads per month',
                  'Cancel anytime',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-primary/20 shrink-0">
                      <span className="size-1.5 rounded-full bg-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="https://strata.uqlabs.co"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Learn about Strata AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Already paying for Strata AI? Sign up with the same email — Listings unlocks 15 free automatically.
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
            &ldquo;I was paying PropertyGuru $800+ a month for listings. Strata
            Listings starts free with 5, and $30 for 15. Buyers message me on
            WhatsApp with the listing title already in their first message.
            I&apos;m saving $700/mo and closing more deals.&rdquo;
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
