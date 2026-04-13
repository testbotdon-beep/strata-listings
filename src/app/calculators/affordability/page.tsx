'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Wallet, ChevronLeft, Info, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtMoney(n: number): string {
  return '$' + fmt(n)
}

/** Reverse-calculate max loan from max monthly payment */
function maxLoanFromMonthly(monthly: number, annualRate: number, years: number): number {
  if (monthly <= 0 || years <= 0) return 0
  if (annualRate === 0) return monthly * years * 12
  const r = annualRate / 100 / 12
  const n = years * 12
  return (monthly * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
}

// ─── Component ───────────────────────────────────────────────────────────────

const STRESS_RATE = 4 // MAS medium-term stress test rate
const LTV = 0.75 // 75% LTV assumption

export default function AffordabilityPage() {
  const [incomeInput, setIncomeInput] = useState<string>('10000')
  const [income, setIncome] = useState<number>(10_000)

  const [debtsInput, setDebtsInput] = useState<string>('0')
  const [debts, setDebts] = useState<number>(0)

  const [propertyType, setPropertyType] = useState<string>('private')
  const [tenure, setTenure] = useState<number>(25)
  const [tenureInput, setTenureInput] = useState<string>('25')

  function handleIncome(val: string) {
    setIncomeInput(val)
    const n = Number(val.replace(/,/g, ''))
    if (!isNaN(n) && n >= 0) setIncome(n)
  }

  function handleDebts(val: string) {
    setDebtsInput(val)
    const n = Number(val.replace(/,/g, ''))
    if (!isNaN(n) && n >= 0) setDebts(n)
  }

  function handleTenure(val: string) {
    setTenureInput(val)
    const n = Number(val)
    if (!isNaN(n) && n >= 1 && n <= 35) setTenure(n)
  }

  const results = useMemo(() => {
    const tdsrCap = income * 0.55
    const msrCap = income * 0.30

    // Available monthly mortgage under TDSR
    const availableTDSR = Math.max(0, tdsrCap - debts)

    // For HDB, further constrained by MSR
    const availableMortgage =
      propertyType === 'hdb' ? Math.min(availableTDSR, msrCap) : availableTDSR

    const maxLoan = maxLoanFromMonthly(availableMortgage, STRESS_RATE, tenure)
    const maxPrice = maxLoan / LTV

    const tdsrUtil = income > 0 ? ((debts + availableMortgage) / income) * 100 : 0
    const msrUtil = income > 0 ? (availableMortgage / income) * 100 : 0

    return {
      tdsrCap,
      msrCap,
      availableMortgage,
      maxLoan,
      maxPrice,
      tdsrUtil,
      msrUtil,
    }
  }, [income, debts, propertyType, tenure])

  const tdsrPct = income > 0 ? Math.min(100, (debts / income) * 100 + results.msrUtil) : 0
  const existingDebtPct = income > 0 ? Math.min(100, (debts / income) * 100) : 0

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
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Affordability Calculator</h1>
              <p className="text-sm text-slate-500">
                TDSR & MSR assessment — know your ceiling before you shop
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
                  Your financials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Income */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Monthly gross income
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      type="text"
                      className="pl-7 h-10 text-sm"
                      value={incomeInput}
                      onChange={(e) => handleIncome(e.target.value)}
                      onBlur={() => setIncomeInput(fmt(income))}
                    />
                  </div>
                  <p className="text-xs text-slate-400">Before CPF and income tax deductions</p>
                </div>

                {/* Existing debts */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Monthly debt obligations
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      type="text"
                      className="pl-7 h-10 text-sm"
                      value={debtsInput}
                      onChange={(e) => handleDebts(e.target.value)}
                      onBlur={() => setDebtsInput(fmt(debts))}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Credit cards (min payment), car loan, student loan, etc.
                  </p>
                </div>

                <Separator />

                {/* Property type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Property type</Label>
                  <Tabs value={propertyType} onValueChange={setPropertyType}>
                    <TabsList className="w-full">
                      <TabsTrigger value="private" className="flex-1 text-xs">
                        Private
                      </TabsTrigger>
                      <TabsTrigger value="hdb" className="flex-1 text-xs">
                        HDB / EC
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="private">
                      <p className="mt-2 text-xs text-slate-500">
                        Only TDSR applies (55% cap). MSR does not apply.
                      </p>
                    </TabsContent>
                    <TabsContent value="hdb">
                      <p className="mt-2 text-xs text-slate-500">
                        Both TDSR (55%) and MSR (30%) apply. MSR is the tighter constraint.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Loan tenure</Label>
                    <span className="text-sm font-semibold text-slate-900">{tenure} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    step={1}
                    value={tenure}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setTenure(v)
                      setTenureInput(String(v))
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>5 yrs</span>
                    <span>35 yrs</span>
                  </div>
                </div>

                {/* Stress rate note */}
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5">
                  <Info className="size-4 shrink-0 text-amber-500" />
                  <p className="text-xs text-amber-700">
                    MAS requires banks to use a{' '}
                    <strong>minimum 4% stress test rate</strong> for affordability — this
                    calculator uses exactly that.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            {/* Max price hero */}
            <Card className="bg-emerald-600 text-white ring-0">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm font-medium opacity-80">Maximum property price</p>
                <p className="mt-1 text-5xl font-bold tracking-tight">
                  {fmtMoney(Math.round(results.maxPrice))}
                </p>
                <p className="mt-1 text-sm opacity-70">
                  Based on 75% LTV · {tenure}-year tenure · 4% stress test rate
                </p>
              </CardContent>
            </Card>

            {/* Key numbers */}
            <div className="grid grid-cols-2 gap-4">
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Max monthly mortgage</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900">
                    {fmtMoney(Math.round(results.availableMortgage))}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {propertyType === 'hdb' ? 'MSR-constrained' : 'TDSR-constrained'}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Max loan amount</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900">
                    {fmtMoney(Math.round(results.maxLoan))}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">At 4% for {tenure} yrs</p>
                </CardContent>
              </Card>
            </div>

            {/* TDSR utilisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <TrendingUp className="size-4 text-emerald-600" />
                  Debt servicing ratios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* TDSR bar */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">
                      TDSR — Total Debt Servicing Ratio
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        tdsrPct > 55 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {tdsrPct.toFixed(1)}% / 55% limit
                    </span>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
                    {/* limit marker */}
                    <div
                      className="absolute top-0 h-full w-px bg-slate-400"
                      style={{ left: '55%' }}
                    />
                    {/* existing debts */}
                    <div
                      className="absolute left-0 h-full bg-slate-300 transition-all"
                      style={{ width: `${Math.min(55, existingDebtPct)}%` }}
                    />
                    {/* mortgage */}
                    <div
                      className="absolute h-full bg-emerald-500 transition-all"
                      style={{
                        left: `${Math.min(55, existingDebtPct)}%`,
                        width: `${Math.min(55 - Math.min(55, existingDebtPct), results.msrUtil)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="inline-block size-2.5 rounded-sm bg-slate-300" />
                      Existing debts ({fmtMoney(debts)}/mo)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block size-2.5 rounded-sm bg-emerald-500" />
                      Mortgage ({fmtMoney(Math.round(results.availableMortgage))}/mo)
                    </span>
                  </div>
                </div>

                {/* MSR bar — only for HDB */}
                {propertyType === 'hdb' && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">
                        MSR — Mortgage Servicing Ratio
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          results.msrUtil > 30 ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {results.msrUtil.toFixed(1)}% / 30% limit
                      </span>
                    </div>
                    <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="absolute top-0 h-full w-px bg-slate-400"
                        style={{ left: '30%' }}
                      />
                      <div
                        className="absolute left-0 h-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(100, results.msrUtil)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      MSR applies only to HDB and EC purchases. Your mortgage cannot exceed 30% of
                      gross income.
                    </p>
                  </div>
                )}

                {/* Summary table */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 text-slate-500">Gross monthly income</td>
                        <td className="py-1.5 text-right font-semibold text-slate-900">
                          {fmtMoney(income)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 text-slate-500">TDSR limit (55%)</td>
                        <td className="py-1.5 text-right font-semibold text-slate-900">
                          {fmtMoney(Math.round(results.tdsrCap))}
                        </td>
                      </tr>
                      {propertyType === 'hdb' && (
                        <tr className="border-b border-slate-100">
                          <td className="py-1.5 text-slate-500">MSR limit (30%)</td>
                          <td className="py-1.5 text-right font-semibold text-slate-900">
                            {fmtMoney(Math.round(results.msrCap))}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 text-slate-500">Existing monthly debts</td>
                        <td className="py-1.5 text-right font-semibold text-red-600">
                          − {fmtMoney(debts)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 font-medium text-slate-700">
                          Available for mortgage
                        </td>
                        <td className="py-1.5 text-right font-bold text-emerald-700">
                          {fmtMoney(Math.round(results.availableMortgage))}
                        </td>
                      </tr>
                      <tr>
                        <td className="pt-2.5 font-semibold text-slate-900">
                          Max property price
                        </td>
                        <td className="pt-2.5 text-right text-base font-bold text-emerald-700">
                          {fmtMoney(Math.round(results.maxPrice))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Explainer section */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'What is TDSR?',
                  body: 'Total Debt Servicing Ratio caps all monthly debt repayments — including the new mortgage — at 55% of gross income. Introduced by MAS in 2013 to ensure responsible borrowing.',
                },
                {
                  title: 'What is MSR?',
                  body: 'Mortgage Servicing Ratio applies only to HDB flats and Executive Condominiums. Your mortgage alone cannot exceed 30% of gross income — stricter than TDSR.',
                },
                {
                  title: 'Why the 4% stress test?',
                  body: 'MAS mandates that banks test affordability at a minimum of 4% p.a., regardless of the actual loan rate. This ensures borrowers can still service the loan if rates rise.',
                },
                {
                  title: 'Tips to improve affordability',
                  body: 'Pay down existing debts before applying. Include spouse\'s income for joint assessment. Extend tenure to lower monthly obligations. Opt for HDB or EC if MSR is your constraint.',
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
                Results are indicative. Based on MAS TDSR/MSR rules, 75% LTV, 4% stress test rate.
                Actual loan approval depends on credit assessment, CPF contributions, age, and bank
                policy. Consult a licensed mortgage adviser before committing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
