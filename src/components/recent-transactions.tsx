'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface Transaction {
  month: string
  flat_type: string
  address: string
  storey_range: string
  sqft: number
  sqm: number
  price: number
  remaining_lease: string
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(2)}M`
  return `$${(p / 1000).toFixed(0)}K`
}

function formatMonth(ym: string): string {
  // ym like "2026-03"
  const [y, m] = ym.split('-')
  const d = new Date(parseInt(y), parseInt(m) - 1, 1)
  return d.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })
}

export function RecentTransactions({
  town,
  propertyType,
}: {
  town: string
  propertyType: 'hdb' | 'condo' | 'landed' | 'commercial'
}) {
  const [records, setRecords] = useState<Transaction[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/transactions?town=${encodeURIComponent(town)}&property_type=${propertyType}&limit=6`)
      .then((r) => r.json())
      .then((d) => {
        setRecords(d?.records ?? [])
        setLoading(false)
      })
      .catch(() => {
        setRecords([])
        setLoading(false)
      })
  }, [town, propertyType])

  if (propertyType !== 'hdb') return null
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900 mb-2">Recent transactions in {town}</p>
        <div className="h-20 animate-pulse rounded bg-slate-100" />
      </div>
    )
  }
  if (!records || records.length === 0) return null

  const avgPrice = Math.round(records.reduce((a, r) => a + r.price, 0) / records.length)
  const avgPsf = Math.round(records.reduce((a, r) => a + r.price / r.sqft, 0) / records.length)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-emerald-600" />
        <p className="text-sm font-semibold text-slate-900">Recent transactions in {town}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-slate-500">Avg price</p>
          <p className="font-bold text-slate-900">{formatPrice(avgPrice)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-slate-500">Avg PSF</p>
          <p className="font-bold text-slate-900">${avgPsf}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {records.slice(0, 5).map((r, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{r.address}</p>
              <p className="text-slate-500">
                {r.flat_type} · {r.storey_range} · {r.sqft} sqft
              </p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="font-semibold text-slate-900">{formatPrice(r.price)}</p>
              <p className="text-slate-500">{formatMonth(r.month)}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
        Source: HDB resale prices via data.gov.sg. Updated monthly.
      </p>
    </div>
  )
}
