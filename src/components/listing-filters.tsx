'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import {
  SG_DISTRICTS,
  PROPERTY_TYPE_LABELS,
  POPULAR_MRTS,
} from '@/types/listing'
import type { ListingType, PropertyType } from '@/types/listing'
import { cn } from '@/lib/utils'

const BEDROOM_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5' },
]

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
]

interface ListingFiltersProps {
  className?: string
}

export function ListingFilters({ className }: ListingFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const type = (searchParams.get('type') as ListingType) ?? 'sale'
  const propertyType = (searchParams.get('property_type') as PropertyType) ?? ''
  const minPrice = searchParams.get('min_price') ?? ''
  const maxPrice = searchParams.get('max_price') ?? ''
  const bedrooms = searchParams.get('bedrooms') ?? ''
  const district = searchParams.get('district') ?? ''
  const mrt = searchParams.get('mrt') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      router.push(`/listings?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  function clearAll() {
    router.push('/listings', { scroll: false })
  }

  const hasActiveFilters =
    propertyType || minPrice || maxPrice || bedrooms || district || mrt

  const filterContent = (
    <div className="flex flex-col gap-5">
      {/* Listing type */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Listing type
        </Label>
        <div className="flex rounded-lg bg-muted p-0.5">
          {(['sale', 'rent'] as ListingType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateParams({ type: t })}
              className={cn(
                'flex-1 rounded-md py-1.5 text-xs font-medium transition-all',
                type === t
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Property type
        </Label>
        <Select
          value={propertyType || undefined}
          onValueChange={(v) => updateParams({ property_type: v })}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateParams({ min_price: e.target.value })}
            className="h-8 text-sm"
            min={0}
          />
          <span className="shrink-0 text-xs text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateParams({ max_price: e.target.value })}
            className="h-8 text-sm"
            min={0}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bedrooms
        </Label>
        <div className="flex gap-1.5 flex-wrap">
          {BEDROOM_OPTIONS.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => updateParams({ bedrooms: value })}
              className={cn(
                'h-7 min-w-[2.25rem] rounded-md border px-2.5 text-xs font-medium transition-colors',
                bedrooms === value
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          District
        </Label>
        <Select
          value={district || undefined}
          onValueChange={(v) => updateParams({ district: v })}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue placeholder="Any district" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SG_DISTRICTS).map(([num, name]) => (
              <SelectItem key={num} value={num}>
                D{num} — {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* MRT */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Near MRT
        </Label>
        <Select
          value={mrt || undefined}
          onValueChange={(v) => updateParams({ mrt: v })}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue placeholder="Any MRT" />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_MRTS.map((station) => (
              <SelectItem key={station} value={station}>
                {station}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort by
        </Label>
        <Select
          value={sort}
          onValueChange={(v) => updateParams({ sort: v })}
        >
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="w-full gap-1.5 text-xs"
        >
          <X className="size-3" />
          Clear filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile: collapsible trigger */}
      <div className={cn('lg:hidden', className)}>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            Filters
            {hasActiveFilters && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {[propertyType, minPrice, maxPrice, bedrooms, district, mrt].filter(Boolean).length}
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'size-4 text-muted-foreground transition-transform duration-200',
              mobileOpen && 'rotate-180'
            )}
          />
        </button>
        {mobileOpen && (
          <div className="mt-2 rounded-xl border border-border bg-white p-4 shadow-sm">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop: always visible sidebar */}
      <aside
        className={cn(
          'hidden lg:block w-64 shrink-0 rounded-xl border border-border bg-white p-5 shadow-sm self-start sticky top-20',
          className
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
        </div>
        {filterContent}
      </aside>
    </>
  )
}

export default ListingFilters
