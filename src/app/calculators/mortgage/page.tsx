'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Calculator,
  ChevronLeft,
  Info,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtMoney(n: number): string {
  return '$' + fmt(n)
}

function calcMonthly(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0
  if (annualRate === 0) return principal / (years * 12)
  const r = annualRate / 100 / 12
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

interface AmortRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

function buildAmortization(
  principal: number,
  annualRate: number,
  years: number,
): AmortRow[] {
  const rows: AmortRow[] = []
  const monthly = calcMonthly(principal, annualRate, years)
  const r = annualRate / 100 / 12
  let balance = principal
  const totalMonths = years * 12

  for (let m = 1; m <= totalMonths; m++) {
    const interestPortion = balance * r
    const principalPortion = monthly - interestPortion
    balance = Math.max(0, balance - principalPortion)
    rows.push({
      month: m,
      payment: monthly,
      principal: principalPortion,
      interest: interestPortion,
      balance,
    })
  }
  return rows
}

// ─── Mortgage content (needs searchParams) ──────────────────────────────────

function MortgageContent() {
  const searchParams = useSearchParams()
  const initialPrice = Number(searchParams.get('price')) || 1_500_000

  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice)
  const [propertyPriceInput, setPropertyPriceInput] = useState<string>(String(initialPrice))
  const [downPaymentPct, setDownPaymentPct] = useState<number>(25)
  const [downPaymentInput, setDownPaymentInput] = useState<string>('25')
  const [downPaymentMode, setDownPaymentMode] = useState<'pct' | 'amt'>('pct')
  const [tenure, setTenure] = useState<number>(25)
  const [tenureInput, setTenureInput] = useState<string>('25')
  const [rate, setRate] = useState<number>(3.5)
  const [rateInput, setRateInput] = useState<string>('3.50')
  const [loanType, setLoanType] = useState<string>('floating')

  // Derived: loan amount
  const downPaymentAmt =
    downPaymentMode === 'pct'
      ? (propertyPrice * downPaymentPct) / 100
      : (downPaymentPct / 100) * propertyPrice // downPaymentPct holds raw $ when mode=amt

  // When mode is 'amt', we store the dollar figure in a separate state
  const [downPaymentDollar, setDownPaymentDollar] = useState<number>(initialPrice * 0.25)
  const [downPaymentDollarInput, setDownPaymentDollarInput] = useState<string>(
    String(Math.round(initialPrice * 0.25)),
  )

  const effectiveDownPayment =
    downPaymentMode === 'pct' ? (propertyPrice * downPaymentPct) / 100 : downPaymentDollar

  const loanAmount = Math.max(0, propertyPrice - effectiveDownPayment)

  const results = useMemo(() => {
    const monthly = calcMonthly(loanAmount, rate, tenure)
    const numPayments = tenure * 12
    const totalPaid = monthly * numPayments
    const totalInterest = totalPaid - loanAmount
    return { monthly, totalPaid, totalInterest }
  }, [loanAmount, rate, tenure])

  const amortRows = useMemo(
    () => buildAmortization(loanAmount, rate, tenure),
    [loanAmount, rate, tenure],
  )

  // Rows to display: first 12, then every 12th month
  const tableRows = useMemo(() => {
    const display: AmortRow[] = []
    for (let i = 0; i < amortRows.length; i++) {
      const m = amortRows[i].month
      if (m <= 12 || m % 12 === 0) display.push(amortRows[i])
    }
    return display
  }, [amortRows])

  // Payment breakdown bars (first 12 months for visual)
  const barData = amortRows.slice(0, 12)
  const maxPayment = barData.length > 0 ? barData[0].payment : 1

  // ─── Handlers ───────────────────────────────────────────────────────────

  function handlePropertyPrice(val: string) {
    setPropertyPriceInput(val)
    const n = Number(val.replace(/,/g, ''))
    if (!isNaN(n) && n >= 0) {
      setPropertyPrice(n)
      if (downPaymentMode === 'pct') {
        // keep pct, just update derived
      } else {
        // keep dollar value
      }
    }
  }

  function handleDownPct(val: string) {
    setDownPaymentInput(val)
    const n = Number(val)
    if (!isNaN(n) && n >= 0 && n <= 100) setDownPaymentPct(n)
  }

  function handleDownDollar(val: string) {
    setDownPaymentDollarInput(val)
    const n = Number(val.replace(/,/g, ''))
    if (!isNaN(n) && n >= 0) setDownPaymentDollar(n)
  }

  function handleTenure(val: string) {
    setTenureInput(val)
    const n = Number(val)
    if (!isNaN(n) && n >= 1 && n <= 35) setTenure(n)
  }

  function handleRate(val: string) {
    setRateInput(val)
    const n = Number(val)
    if (!isNaN(n) && n >= 0) setRate(n)
  }

  const downPctOfPrice =
    propertyPrice > 0
      ? downPaymentMode === 'pct'
        ? downPaymentPct
        : (downPaymentDollar / propertyPrice) * 100
      : 0

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
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calculator className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mortgage Calculator</h1>
              <p className="text-sm text-slate-500">
                Monthly repayment, total interest, and full amortisation schedule
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
                  Loan details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Property price */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Property price</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      type="text"
                      className="pl-7 h-10 text-sm"
                      value={propertyPriceInput}
                      onChange={(e) => handlePropertyPrice(e.target.value)}
                      onBlur={() => setPropertyPriceInput(fmt(propertyPrice))}
                    />
                  </div>
                </div>

                {/* Down payment */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Down payment</Label>
                    <div className="flex rounded-lg border border-slate-200 text-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setDownPaymentMode('pct')}
                        className={`px-2.5 py-1 font-medium transition-colors ${
                          downPaymentMode === 'pct'
                            ? 'bg-primary text-white'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setDownPaymentMode('amt')}
                        className={`px-2.5 py-1 font-medium transition-colors ${
                          downPaymentMode === 'amt'
                            ? 'bg-primary text-white'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        $
                      </button>
                    </div>
                  </div>
                  {downPaymentMode === 'pct' ? (
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="pr-7 h-10 text-sm"
                        value={downPaymentInput}
                        onChange={(e) => handleDownPct(e.target.value)}
                        onBlur={() => setDownPaymentInput(String(downPaymentPct))}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-sm">
                        %
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                        $
                      </span>
                      <Input
                        type="text"
                        className="pl-7 h-10 text-sm"
                        value={downPaymentDollarInput}
                        onChange={(e) => handleDownDollar(e.target.value)}
                        onBlur={() =>
                          setDownPaymentDollarInput(fmt(downPaymentDollar))
                        }
                      />
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    {fmtMoney(Math.round(effectiveDownPayment))} —{' '}
                    {downPctOfPrice.toFixed(1)}% of price
                  </p>
                </div>

                <Separator />

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
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>5 yrs</span>
                    <span>35 yrs</span>
                  </div>
                </div>

                {/* Interest rate */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Interest rate (% p.a.)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={15}
                      step={0.05}
                      className="pr-7 h-10 text-sm"
                      value={rateInput}
                      onChange={(e) => handleRate(e.target.value)}
                      onBlur={() => setRateInput(rate.toFixed(2))}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-sm">
                      %
                    </span>
                  </div>
                </div>

                {/* Loan type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Loan type</Label>
                  <Tabs value={loanType} onValueChange={setLoanType}>
                    <TabsList className="w-full">
                      <TabsTrigger value="floating" className="flex-1 text-xs">
                        Floating rate
                      </TabsTrigger>
                      <TabsTrigger value="fixed" className="flex-1 text-xs">
                        Fixed rate
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="floating">
                      <p className="mt-2 text-xs text-slate-500">
                        Typically SORA-pegged. Lower initial rate, adjusts with market.
                      </p>
                    </TabsContent>
                    <TabsContent value="fixed">
                      <p className="mt-2 text-xs text-slate-500">
                        Rate locked for 2–5 years, then reverts to floating. Higher certainty.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            {/* Monthly payment hero */}
            <Card className="bg-primary text-white ring-0">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm font-medium opacity-80">Monthly repayment</p>
                <p className="mt-1 text-5xl font-bold tracking-tight">
                  {fmtMoney(Math.round(results.monthly))}
                </p>
                <p className="mt-1 text-sm opacity-70">
                  {loanType === 'floating' ? 'Floating' : 'Fixed'} rate · {rate}% p.a. · {tenure}{' '}
                  years
                </p>
              </CardContent>
            </Card>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Loan amount</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {fmtMoney(Math.round(loanAmount))}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Total interest</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {fmtMoney(Math.round(results.totalInterest))}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-slate-500">Total paid</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {fmtMoney(Math.round(results.totalPaid))}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly breakdown visual — first 12 months */}
            {barData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <TrendingUp className="size-4 text-primary" />
                    Monthly breakdown — first 12 months
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {barData.map((row) => {
                      const intWidth = (row.interest / maxPayment) * 100
                      const prinWidth = (row.principal / maxPayment) * 100
                      return (
                        <div key={row.month} className="flex items-center gap-3">
                          <span className="w-6 shrink-0 text-right text-xs text-slate-400">
                            {row.month}
                          </span>
                          <div className="flex h-5 flex-1 overflow-hidden rounded-sm">
                            <div
                              className="bg-primary/80"
                              style={{ width: `${intWidth}%` }}
                              title={`Interest: ${fmtMoney(Math.round(row.interest))}`}
                            />
                            <div
                              className="bg-slate-200"
                              style={{ width: `${prinWidth}%` }}
                              title={`Principal: ${fmtMoney(Math.round(row.principal))}`}
                            />
                          </div>
                          <span className="w-24 shrink-0 text-right text-xs text-slate-500">
                            Bal: {fmtMoney(Math.round(row.balance))}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block size-2.5 rounded-sm bg-primary/80" />
                      Interest
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block size-2.5 rounded-sm bg-slate-200" />
                      Principal
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amortisation table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Amortisation schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs text-slate-500">
                        <th className="py-2 pr-4 text-left font-medium">Month</th>
                        <th className="py-2 pr-4 text-right font-medium">Payment</th>
                        <th className="py-2 pr-4 text-right font-medium">Principal</th>
                        <th className="py-2 pr-4 text-right font-medium">Interest</th>
                        <th className="py-2 text-right font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, idx) => (
                        <tr
                          key={row.month}
                          className={`border-b border-slate-50 text-xs ${
                            idx % 2 === 0 ? '' : 'bg-slate-50/50'
                          }`}
                        >
                          <td className="py-1.5 pr-4 font-medium text-slate-700">
                            {row.month <= 12
                              ? `Month ${row.month}`
                              : `Year ${row.month / 12}`}
                          </td>
                          <td className="py-1.5 pr-4 text-right text-slate-600">
                            {fmtMoney(Math.round(row.payment))}
                          </td>
                          <td className="py-1.5 pr-4 text-right text-slate-600">
                            {fmtMoney(Math.round(row.principal))}
                          </td>
                          <td className="py-1.5 pr-4 text-right text-slate-600">
                            {fmtMoney(Math.round(row.interest))}
                          </td>
                          <td className="py-1.5 text-right font-semibold text-slate-900">
                            {fmtMoney(Math.round(row.balance))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Footer disclaimer */}
            <div className="flex gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              <Info className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <div>
                <p>
                  Calculations based on Singapore banks&apos; standard floating home loan rates as
                  of Q1 2026. Actual rates vary by bank and loan package. Results are for
                  illustrative purposes only.
                </p>
                <p className="mt-1">
                  <a href="#" className="text-primary underline-offset-2 hover:underline">
                    See current rates
                  </a>{' '}
                  ·{' '}
                  <a href="#" className="text-primary underline-offset-2 hover:underline">
                    About LTV limits
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page (wraps in Suspense for useSearchParams) ───────────────────────────

export default function MortgagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center text-slate-400">
          Loading calculator…
        </div>
      }
    >
      <MortgageContent />
    </Suspense>
  )
}
