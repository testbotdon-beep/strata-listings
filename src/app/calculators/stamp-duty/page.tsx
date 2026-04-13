'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DollarSign, ChevronLeft, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// ─── Types ──────────────────────────────────────────────────────────────────

type BuyerProfile =
  | 'sc_1st'
  | 'sc_2nd'
  | 'sc_3rd'
  | 'pr_1st'
  | 'pr_2nd'
  | 'foreigner'
  | 'entity'

// ─── BSD Rates ───────────────────────────────────────────────────────────────

interface BSDTier {
  from: number
  to: number
  rate: number
  label: string
}

const BSD_TIERS_RESIDENTIAL: BSDTier[] = [
  { from: 0, to: 180_000, rate: 0.01, label: 'First $180,000' },
  { from: 180_000, to: 360_000, rate: 0.02, label: 'Next $180,000 ($180k–$360k)' },
  { from: 360_000, to: 1_000_000, rate: 0.03, label: 'Next $640,000 ($360k–$1M)' },
  { from: 1_000_000, to: 1_500_000, rate: 0.04, label: 'Next $500,000 ($1M–$1.5M)' },
  { from: 1_500_000, to: 3_000_000, rate: 0.05, label: 'Next $1,500,000 ($1.5M–$3M)' },
  { from: 3_000_000, to: Infinity, rate: 0.06, label: 'Above $3,000,000' },
]

const BSD_TIERS_COMMERCIAL: BSDTier[] = [
  { from: 0, to: 180_000, rate: 0.01, label: 'First $180,000' },
  { from: 180_000, to: 360_000, rate: 0.02, label: 'Next $180,000 ($180k–$360k)' },
  { from: 360_000, to: Infinity, rate: 0.03, label: 'Above $360,000' },
]

// ─── ABSD Rates ──────────────────────────────────────────────────────────────

const ABSD_RATES: Record<BuyerProfile, number> = {
  sc_1st: 0,
  sc_2nd: 0.20,
  sc_3rd: 0.30,
  pr_1st: 0.05,
  pr_2nd: 0.30,
  foreigner: 0.60,
  entity: 0.65,
}

const ABSD_LABELS: Record<BuyerProfile, string> = {
  sc_1st: 'SC 1st property — 0%',
  sc_2nd: 'SC 2nd property — 20%',
  sc_3rd: 'SC 3rd+ property — 30%',
  pr_1st: 'PR 1st property — 5%',
  pr_2nd: 'PR 2nd+ property — 30%',
  foreigner: 'Foreigner — 60%',
  entity: 'Entity / Company — 65%',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtMoney(n: number): string {
  return '$' + fmt(n)
}

interface BSDResult {
  total: number
  tiers: { label: string; taxable: number; tax: number; rate: number }[]
}

function calcBSD(price: number, tiers: BSDTier[]): BSDResult {
  let total = 0
  const breakdown: BSDResult['tiers'] = []

  for (const tier of tiers) {
    if (price <= tier.from) break
    const taxable = Math.min(price, tier.to) - tier.from
    const tax = taxable * tier.rate
    total += tax
    breakdown.push({ label: tier.label, taxable, tax, rate: tier.rate })
  }

  return { total, tiers: breakdown }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StampDutyPage() {
  const [priceInput, setPriceInput] = useState<string>('1500000')
  const [price, setPrice] = useState<number>(1_500_000)
  const [buyer, setBuyer] = useState<BuyerProfile>('sc_1st')
  const [propertyType, setPropertyType] = useState<string>('residential')

  function handlePrice(val: string) {
    setPriceInput(val)
    const n = Number(val.replace(/,/g, ''))
    if (!isNaN(n) && n >= 0) setPrice(n)
  }

  const bsdTiers =
    propertyType === 'residential' ? BSD_TIERS_RESIDENTIAL : BSD_TIERS_COMMERCIAL

  const results = useMemo(() => {
    const bsd = calcBSD(price, bsdTiers)
    const absdRate = propertyType === 'commercial' ? 0 : ABSD_RATES[buyer]
    const absd = price * absdRate
    const total = bsd.total + absd
    const pct = price > 0 ? (total / price) * 100 : 0
    return { bsd, absd, absdRate, total, pct }
  }, [price, buyer, bsdTiers, propertyType])

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/calculators"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="size-4" />
            All calculators
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <DollarSign className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stamp Duty Calculator</h1>
              <p className="text-sm text-slate-500">
                BSD + ABSD for all buyer types — updated to 2023 rates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* ── Inputs ── */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Purchase details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Property type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Property type</Label>
                  <Tabs value={propertyType} onValueChange={setPropertyType}>
                    <TabsList className="w-full">
                      <TabsTrigger value="residential" className="flex-1 text-xs">
                        Residential
                      </TabsTrigger>
                      <TabsTrigger value="commercial" className="flex-1 text-xs">
                        Commercial
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="residential">
                      <p className="mt-2 text-xs text-slate-500">
                        HDB, condo, landed — BSD tiered up to 6%. ABSD applies.
                      </p>
                    </TabsContent>
                    <TabsContent value="commercial">
                      <p className="mt-2 text-xs text-slate-500">
                        Offices, shophouses, industrial — BSD up to 3%. No ABSD.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator />

                {/* Price */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Purchase price</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      type="text"
                      className="pl-7 h-10 text-sm"
                      value={priceInput}
                      onChange={(e) => handlePrice(e.target.value)}
                      onBlur={() => setPriceInput(fmt(price))}
                    />
                  </div>
                </div>

                {/* Buyer profile */}
                {propertyType === 'residential' && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Buyer profile</Label>
                    <Select
                      value={buyer}
                      onValueChange={(v) => setBuyer(v as BuyerProfile)}
                    >
                      <SelectTrigger className="w-full h-10 text-sm">
                        <SelectValue placeholder="Select buyer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sc_1st">Singapore Citizen — 1st property</SelectItem>
                        <SelectItem value="sc_2nd">Singapore Citizen — 2nd property</SelectItem>
                        <SelectItem value="sc_3rd">Singapore Citizen — 3rd+ property</SelectItem>
                        <SelectItem value="pr_1st">Singapore PR — 1st property</SelectItem>
                        <SelectItem value="pr_2nd">Singapore PR — 2nd+ property</SelectItem>
                        <SelectItem value="foreigner">Foreigner</SelectItem>
                        <SelectItem value="entity">Entity / Company</SelectItem>
                      </SelectContent>
                    </Select>
                    {buyer && (
                      <p className="text-xs text-slate-400">
                        ABSD rate: {(ABSD_RATES[buyer] * 100).toFixed(0)}% —{' '}
                        {ABSD_LABELS[buyer]}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            {/* Total hero */}
            <Card className="bg-violet-600 text-white ring-0">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm font-medium opacity-80">Total stamp duty payable</p>
                <p className="mt-1 text-5xl font-bold tracking-tight">
                  {fmtMoney(Math.round(results.total))}
                </p>
                <p className="mt-1 text-sm opacity-70">
                  {results.pct.toFixed(2)}% of purchase price ·{' '}
                  {fmtMoney(price)} property
                </p>
              </CardContent>
            </Card>

            {/* BSD + ABSD summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Buyer&apos;s Stamp Duty (BSD)</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900">
                    {fmtMoney(Math.round(results.bsd.total))}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">All buyers pay this</p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">
                    {propertyType === 'commercial'
                      ? 'ABSD (not applicable)'
                      : `ABSD — ${(results.absdRate * 100).toFixed(0)}%`}
                  </p>
                  <p
                    className={`mt-0.5 text-xl font-bold ${
                      results.absd > 0 ? 'text-red-600' : 'text-slate-400'
                    }`}
                  >
                    {propertyType === 'commercial'
                      ? 'N/A'
                      : fmtMoney(Math.round(results.absd))}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {results.absdRate === 0 ? 'Exempt' : 'Additional duty'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* BSD breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  BSD breakdown by tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-500">
                      <th className="py-2 pr-4 text-left font-medium">Band</th>
                      <th className="py-2 pr-4 text-right font-medium">Rate</th>
                      <th className="py-2 pr-4 text-right font-medium">Taxable</th>
                      <th className="py-2 text-right font-medium">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.bsd.tiers.map((tier, i) => (
                      <tr
                        key={i}
                        className={`border-b border-slate-50 text-xs ${
                          i % 2 === 0 ? '' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="py-2 pr-4 text-slate-700">{tier.label}</td>
                        <td className="py-2 pr-4 text-right text-slate-500">
                          {(tier.rate * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 pr-4 text-right text-slate-600">
                          {fmtMoney(Math.round(tier.taxable))}
                        </td>
                        <td className="py-2 text-right font-semibold text-slate-900">
                          {fmtMoney(Math.round(tier.tax))}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-200 text-xs font-bold">
                      <td className="py-2 pr-4 text-slate-900" colSpan={3}>
                        Total BSD
                      </td>
                      <td className="py-2 text-right text-slate-900">
                        {fmtMoney(Math.round(results.bsd.total))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* ABSD note */}
            {propertyType === 'residential' && results.absd > 0 && (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <Info className="size-3.5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        ABSD of {fmtMoney(Math.round(results.absd))} applies
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        As a <strong>{ABSD_LABELS[buyer].split('—')[0].trim()}</strong>, you pay{' '}
                        {(results.absdRate * 100).toFixed(0)}% ABSD on the full purchase price.
                        This is payable within 14 days of signing the OTP or S&P agreement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Explainer */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "What is BSD?",
                  body: "Buyer's Stamp Duty is a tax on property purchases in Singapore, payable by the buyer. It applies to all property types at tiered rates.",
                },
                {
                  title: "What is ABSD?",
                  body: "Additional Buyer's Stamp Duty layers on top of BSD for residential purchases. It discourages speculation and multiple property ownership.",
                },
                {
                  title: "When is stamp duty payable?",
                  body: "Within 14 days of signing the Option to Purchase (OTP) or Sale & Purchase Agreement (S&P), whichever is earlier.",
                },
                {
                  title: "IRAS guidance",
                  body: "IRAS administers stamp duty in Singapore. Consult a lawyer or conveyancer to confirm your exact liability before exercising the OTP.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              <Info className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <p>
                Rates based on IRAS as of 2023. Verify with a licensed conveyancer before committing.{' '}
                <a href="#" className="text-primary underline-offset-2 hover:underline">
                  IRAS stamp duty guide
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
