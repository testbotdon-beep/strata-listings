import Link from 'next/link'
import { ArrowRight, Calculator, DollarSign, Wallet, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CALCULATORS = [
  {
    href: '/calculators/mortgage',
    icon: Calculator,
    title: 'Mortgage Calculator',
    description:
      'Calculate your monthly home loan repayment based on loan amount, tenure, and interest rate.',
    badge: 'Most popular',
    badgeVariant: 'default' as const,
    tags: ['Monthly payment', 'Total interest', 'Amortisation'],
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/calculators/stamp-duty',
    icon: DollarSign,
    title: 'Stamp Duty Calculator',
    description:
      'Compute Buyer\'s Stamp Duty (BSD) and Additional Buyer\'s Stamp Duty (ABSD) for any Singapore property purchase.',
    badge: 'Updated 2023',
    badgeVariant: 'secondary' as const,
    tags: ['BSD', 'ABSD', 'All buyer types'],
    color: 'bg-violet-50 text-violet-600',
  },
  {
    href: '/calculators/affordability',
    icon: Wallet,
    title: 'Affordability Calculator',
    description:
      'Find out how much you can borrow based on MAS TDSR and MSR rules. Know your ceiling before you shop.',
    badge: 'MAS rules',
    badgeVariant: 'outline' as const,
    tags: ['TDSR 55%', 'MSR 30%', 'Stress test'],
    color: 'bg-emerald-50 text-emerald-600',
  },
]

const INFO_ITEMS = [
  {
    title: "Buyer's Stamp Duty (BSD)",
    body: "Payable by all buyers on any Singapore property purchase. Tiered from 1% up to 6% for properties above $3M. Computed on the purchase price or market value, whichever is higher.",
  },
  {
    title: "Additional Buyer's Stamp Duty (ABSD)",
    body: "An extra layer of stamp duty introduced to moderate demand. Singapore Citizens are exempt on their first property. Foreigners pay 60%. Permanent Residents pay 5% on their first. Entities pay 65%.",
  },
  {
    title: "Total Debt Servicing Ratio (TDSR)",
    body: "MAS caps all monthly debt obligations — including the new mortgage — at 55% of gross monthly income. Applied to all property loans from financial institutions.",
  },
  {
    title: "Mortgage Servicing Ratio (MSR)",
    body: "For HDB flat and Executive Condominium purchases, mortgage repayments alone cannot exceed 30% of gross monthly income. A tighter constraint than TDSR for public housing.",
  },
]

export default function CalculatorsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Calculator className="size-3.5" />
            Singapore Property Tools
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Property calculators
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to plan your next property purchase in Singapore — mortgage
            repayments, stamp duty costs, and how much you can actually borrow.
          </p>
        </div>
      </section>

      {/* Calculator grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon
            return (
              <Link key={calc.href} href={calc.href} className="group block">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${calc.color}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <Badge variant={calc.badgeVariant}>{calc.badge}</Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg font-semibold text-slate-900">
                      {calc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-slate-600">{calc.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {calc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary transition-gap group-hover:gap-2">
                      Calculate
                      <ArrowRight className="size-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Context section */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
              <Info className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Understanding Singapore property costs
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Key rules and taxes every buyer should know before committing
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-400">
            All calculators use current IRAS rates and MAS guidelines as of Q1 2026. Results are
            indicative only and do not constitute financial advice. Consult a licensed mortgage
            adviser or financial planner before committing to a purchase.
          </p>
        </div>
      </section>
    </div>
  )
}
