'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { ListingType, PropertyType } from '@/types/listing'
import { PROPERTY_TYPE_LABELS } from '@/types/listing'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  defaultType?: ListingType
  className?: string
}

export function SearchBar({ defaultType = 'sale', className }: SearchBarProps) {
  const router = useRouter()
  const [listingType, setListingType] = useState<ListingType>(defaultType)
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [query, setQuery] = useState('')

  function handleSearch() {
    const params = new URLSearchParams()
    params.set('type', listingType)
    if (propertyType) params.set('property_type', propertyType)
    if (query.trim()) params.set('query', query.trim())
    router.push(`/listings?${params.toString()}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={cn('w-full rounded-2xl bg-white p-2 shadow-xl ring-1 ring-border/60', className)}>
      {/* Buy / Rent toggle */}
      <div className="mb-2 flex rounded-xl bg-muted p-1">
        {(['sale', 'rent'] as ListingType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setListingType(t)}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-sm font-medium transition-all duration-150',
              listingType === t
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'sale' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      {/* Search row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Text input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location, MRT, or project name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 rounded-xl border-input pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-primary/30"
          />
        </div>

        {/* Property type */}
        <Select
          value={propertyType || undefined}
          onValueChange={(v) => setPropertyType(v as PropertyType)}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-input sm:w-40">
            <SelectValue placeholder="Property type" />
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

        {/* Search button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="h-10 w-full shrink-0 gap-2 rounded-xl font-semibold sm:w-auto"
        >
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
