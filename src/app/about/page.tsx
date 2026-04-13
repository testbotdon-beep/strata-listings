import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shield, Users, Award, Heart, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Strata Listings',
  description:
    'Learn about Strata Listings — Singapore\'s most transparent, buyer-friendly property marketplace built in 2026.',
}

const STATS = [
  { value: '10,000+', label: 'Verified listings' },
  { value: '500+', label: 'Licensed agents' },
  { value: '28', label: 'Districts covered' },
  { value: '2026', label: 'Year launched' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Transparency',
    description: 'Every listing verified, every price clear. No hidden fees, no bait-and-switch. What you see is what you get.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: ArrowRight,
    title: 'Speed',
    description: 'Modern tools for instant responses. AI-powered search, real-time alerts, and agents who reply fast.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Licensed CEA agents only — no middlemen games. Every agent on our platform is verified against the CEA registry.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Heart,
    title: 'Local expertise',
    description: 'Built by Singaporeans, for Singaporeans. We understand the HDB market, COV nuances, and what makes each district unique.',
    color: 'bg-amber-50 text-amber-600',
  },
]

const TEAM = [
  {
    name: 'Don Tan',
    role: 'Founder & CEO',
    bio: 'Former property consultant with 10+ years covering Districts 9-11. Built Strata to fix what was broken in online property search.',
    initials: 'DT',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Wei Ling Koh',
    role: 'Head of Partnerships',
    bio: 'Ex-PropNex top producer. Leads agent onboarding and ensures every agent on our platform meets our service standards.',
    initials: 'WK',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'James Loh',
    role: 'Head of Product',
    bio: 'Built marketplace products at Carousell and Grab. Obsessed with making property search as easy as buying groceries online.',
    initials: 'JL',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Building2 className="h-4 w-4" />
            About Strata Listings
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance">
            Singapore property,{' '}
            <span className="text-primary">reimagined</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We&apos;re building the most transparent, buyer-friendly property marketplace in Singapore.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-8">Our story</h2>
          <div className="flex flex-col gap-5 text-slate-600 leading-relaxed">
            <p>
              Strata Listings was founded in 2026 with a single conviction: finding a home in Singapore should not require navigating hundreds of duplicate listings, fielding calls from unlicensed brokers, or wondering whether the price you see is the price you&apos;ll pay. We set out to build a marketplace where every listing is real, every agent is verified, and every buyer and renter is treated with respect.
            </p>
            <p>
              We built Strata from the ground up with AI-powered tools at the core — not as a gimmick, but as infrastructure. Our search understands natural language. Our matching engine learns from what you respond to. And our agent platform is integrated with Strata AI, meaning the agents you speak to can respond 24/7 with qualified, accurate information instead of making you wait until Monday morning.
            </p>
            <p>
              Every agent on our platform is a licensed CEA estate agent. Every listing is cross-referenced against URA and HDB data. We partner only with agents who commit to transparent pricing, fast responses, and honest representation. Singapore&apos;s property market is the biggest financial decision most families will ever make. We think it deserves a platform that takes that seriously.
            </p>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">By the numbers</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-primary sm:text-4xl">{value}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our mission / values */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our mission</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Four pillars that guide every decision we make.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ title, description, color }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">The team</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Led by a team with deep Singapore property experience.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {TEAM.map(({ name, role, bio, initials, color }) => (
              <div
                key={name}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${color}`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-base">{name}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{role}</p>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-12 shadow-sm">
            <Users className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Want to partner with us?
            </h2>
            <p className="mt-4 text-slate-500 max-w-md mx-auto leading-relaxed">
              Whether you&apos;re a licensed agent, a developer, or a media partner, we&apos;d love to hear from you.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
