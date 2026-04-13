'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Upload, X, CheckCircle2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SG_DISTRICTS, PROPERTY_TYPE_LABELS, POPULAR_MRTS } from '@/types/listing'

const AMENITIES_OPTIONS = [
  'Pool', 'Gym', 'Concierge', 'Tennis Court', 'BBQ Pit', 'Function Room',
  'Playground', 'Sky Garden', 'Rooftop Terrace', 'Parking', 'Security',
  'Near MRT', 'Near Schools', 'Hawker Centre', 'Helper\'s Room',
  'Smart Home', 'Marina Berth', '24/7 Access', 'Meeting Rooms', 'Pantry',
]

const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'partial', label: 'Partially Furnished' },
  { value: 'fully', label: 'Fully Furnished' },
]

const TENURE_OPTIONS = [
  'Freehold',
  '999 years from 1885',
  '99 years from 2023',
  '99 years from 2015',
  '99 years from 2010',
  '99 years from 2005',
  '99 years from 2000',
  '99 years from 1995',
  '99 years from 1990',
  '99 years from 1985',
  '99 years from 1980',
]

type FormMode = 'draft' | 'published' | null

export default function NewListingPage() {
  const [listingType, setListingType] = useState<'rent' | 'sale'>('sale')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [submitMode, setSubmitMode] = useState<FormMode>(null)
  const [submitted, setSubmitted] = useState(false)

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (mode: 'draft' | 'published') => {
    setSubmitMode(mode)
    // Capture the form snapshot and log it via /api/lead so Don can see
    // new listing submissions in Vercel logs. Full persistence to a database
    // comes with Supabase integration.
    const formEl = document.querySelector('[data-new-listing-form]') as HTMLElement | null
    const snapshot: Record<string, string> = {
      listingType,
      amenities: selectedAmenities.join(', '),
    }
    if (formEl) {
      formEl.querySelectorAll('input, textarea').forEach((el) => {
        const input = el as HTMLInputElement | HTMLTextAreaElement
        const label = input.getAttribute('aria-label') || input.placeholder || input.id || 'field'
        if (input.value) snapshot[label] = input.value
      })
    }
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'new-listing',
          name: `Agent submission (${mode})`,
          email: 'agent@strata-listings.sg',
          message: `New listing ${mode}. Fields: ${JSON.stringify(snapshot)}`,
        }),
      })
    } catch {
      // Silent — demo flow still continues
    }
    setTimeout(() => setSubmitted(true), 400)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {submitMode === 'draft' ? 'Saved as Draft' : 'Listing Published!'}
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          {submitMode === 'draft'
            ? 'Your listing has been saved. You can publish it whenever you\'re ready.'
            : 'Your listing is now live and visible to buyers and renters.'}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" render={<Link href="/dashboard/listings" />}>
            View All Listings
          </Button>
          <Button onClick={() => { setSubmitted(false); setSubmitMode(null) }}>
            Add Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8" data-new-listing-form>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/dashboard/listings" />}>
          <ChevronLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">New Listing</h2>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details for your property listing.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section: Basic Info */}
        <FormSection title="Listing Details" description="Core information about the property.">
          {/* Listing type toggle */}
          <div className="col-span-2">
            <Label className="text-xs font-medium text-gray-700 mb-2 block">Listing Type</Label>
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1">
              {(['sale', 'rent'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setListingType(type)}
                  className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    listingType === type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type === 'sale' ? 'For Sale' : 'For Rent'}
                </button>
              ))}
            </div>
          </div>

          {/* Property type */}
          <FormField label="Property Type" required>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Title */}
          <div className="col-span-2">
            <FormField label="Listing Title" required>
              <Input placeholder="e.g. Luxury 3BR at The Orchard Residences" />
            </FormField>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <FormField label="Description" required>
              <Textarea
                placeholder="Describe the property — highlights, nearby amenities, what makes it special..."
                className="min-h-[120px] resize-y"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Section: Pricing */}
        <FormSection title="Pricing" description="Set your asking price.">
          <FormField label={listingType === 'rent' ? 'Monthly Rent (SGD)' : 'Asking Price (SGD)'} required>
            <Input type="number" placeholder={listingType === 'rent' ? '3500' : '1200000'} />
          </FormField>
          <FormField label="Price PSF (SGD, optional)">
            <Input type="number" placeholder="1800" />
          </FormField>
        </FormSection>

        {/* Section: Property Details */}
        <FormSection title="Property Details" description="Physical specifications of the property.">
          <FormField label="Bedrooms" required>
            <Input type="number" min={0} placeholder="3" />
          </FormField>
          <FormField label="Bathrooms" required>
            <Input type="number" min={1} placeholder="2" />
          </FormField>
          <FormField label="Floor Area (sqft)" required>
            <Input type="number" placeholder="1200" />
          </FormField>
          <FormField label="Floor Level">
            <Input placeholder="e.g. High (25-30)" />
          </FormField>
          <FormField label="Tenure">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tenure" />
              </SelectTrigger>
              <SelectContent>
                {TENURE_OPTIONS.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="TOP Year">
            <Input type="number" placeholder="2018" min={1950} max={2030} />
          </FormField>
          <FormField label="Furnishing" required>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select furnishing" />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_OPTIONS.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>

        {/* Section: Location */}
        <FormSection title="Location" description="Address and district details.">
          <div className="col-span-2">
            <FormField label="Street Address" required>
              <Input placeholder="e.g. 238 Orchard Boulevard" />
            </FormField>
          </div>
          <FormField label="District" required>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SG_DISTRICTS).map(([num, name]) => (
                  <SelectItem key={num} value={num}>D{num} — {name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Postal Code" required>
            <Input placeholder="238652" maxLength={6} />
          </FormField>
          <FormField label="Nearest MRT">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select MRT" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_MRTS.map(mrt => (
                  <SelectItem key={mrt} value={mrt}>{mrt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="MRT Distance (metres)">
            <Input type="number" placeholder="300" min={0} />
          </FormField>
        </FormSection>

        {/* Section: Amenities */}
        <FormSection title="Amenities" description="Select all facilities available.">
          <div className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map(amenity => {
                const selected = selectedAmenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {selected && <X className="size-3" />}
                    {amenity}
                  </button>
                )
              })}
            </div>
            {selectedAmenities.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                {selectedAmenities.length} selected: {selectedAmenities.join(', ')}
              </p>
            )}
          </div>
        </FormSection>

        {/* Section: Photos */}
        <FormSection title="Photos" description="Upload high-quality photos to attract more interest.">
          <div className="col-span-2">
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer">
              <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm mx-auto mb-3">
                <Upload className="size-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Drag &amp; drop photos here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse · PNG, JPG up to 10MB each</p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Tip: Upload at least 5 photos. Listings with more photos get 3× more inquiries.
            </p>
          </div>
        </FormSection>

        {/* Action bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button variant="outline" render={<Link href="/dashboard/listings" />}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={submitMode !== null}
            >
              {submitMode === 'draft' ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={() => handleSubmit('published')}
              disabled={submitMode !== null}
              className="flex items-center gap-1.5"
            >
              {submitMode === 'published' ? 'Publishing...' : (
                <>
                  Publish Listing
                  <ArrowUpRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper sub-components
function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
        {children}
      </div>
    </div>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}
