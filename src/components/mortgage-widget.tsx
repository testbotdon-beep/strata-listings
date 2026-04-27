'use client'

import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'

const fmtSGD = (v: number) =>
  new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }).format(v)

export function MortgageWidget({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(25) // 25% standard for SG
  const [rate, setRate] = useState(3.5)
  const [years, setYears] = useState(30)

  const { monthly, total, interest } = useMemo(() => {
    const principal = price * (1 - downPct / 100)
    const monthlyRate = rate / 100 / 12
    const months = years * 12
    if (monthlyRate === 0) {
      return { monthly: principal / months, total: principal, interest: 0 }
    }
    const m = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return { monthly: m, total: m * months, interest: m * months - principal }
  }, [price, downPct, rate, years])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="size-4 text-blue-600" />
        <h2 className="text-base font-semibold text-slate-900">Mortgage estimate</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Down payment</span>
          <span className="relative">
            <input
              type="number"
              min={5}
              max={90}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full pr-7 px-2 py-1.5 text-sm rounded border border-slate-200"
            />
            <span className="absolute right-2 top-1.5 text-xs text-slate-500">%</span>
          </span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Interest rate</span>
          <span className="relative">
            <input
              type="number"
              step="0.1"
              min={1}
              max={10}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full pr-7 px-2 py-1.5 text-sm rounded border border-slate-200"
            />
            <span className="absolute right-2 top-1.5 text-xs text-slate-500">%</span>
          </span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Tenure</span>
          <span className="relative">
            <input
              type="number"
              min={5}
              max={35}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full pr-9 px-2 py-1.5 text-sm rounded border border-slate-200"
            />
            <span className="absolute right-2 top-1.5 text-xs text-slate-500">yrs</span>
          </span>
        </label>
      </div>

      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-xs text-slate-500 mb-0.5">Estimated monthly</p>
        <p className="text-2xl font-bold text-slate-900">{fmtSGD(monthly)}</p>
        <p className="text-xs text-slate-500 mt-2">
          Loan: {fmtSGD(price * (1 - downPct / 100))} · Interest over {years}y: {fmtSGD(interest)}
        </p>
      </div>

      <p className="text-[11px] text-slate-400 mt-3">
        Indicative only. Actual rates depend on bank, package, and TDSR limits.
      </p>
    </div>
  )
}
