'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, X, CheckCircle2, ChevronLeft } from 'lucide-react'
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
import type { ListingType, PropertyType, FurnishingLevel } from '@/types/listing'

const AMENITIES_OPTIONS = [
  'Pool', 'Gym', 'Concierge', 'Tennis Court', 'BBQ Pit', 'Function Room',
  'Playground', 'Sky Garden', 'Rooftop Terrace', 'Parking', 'Security',
  'Near MRT', 'Near Schools', 'Hawker Centre', "Helper's Room",
  'Smart Home', 'Marina Berth', '24/7 Access', 'Meeting Rooms', 'Pantry',
]

const FURNISHING_OPTIONS: { value: FurnishingLevel; label: string }[] = [
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

interface FormState {
  type: ListingType
  property_type: PropertyType | ''
  title: string
  description: string
  price: string
  price_psf: string
  bedrooms: string
  bathrooms: string
  sqft: string
  floor_level: string
  tenure: string
  top_year: string
  furnishing: FurnishingLevel | ''
  address: string
  district: string
  postal_code: string
  mrt_nearest: string
  mrt_distance_m: string
}

const INITIAL_FORM: FormState = {
  type: 'sale',
  property_type: '',
  title: '',
  description: '',
  price: '',
  price_psf: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  floor_level: '',
  tenure: '',
  top_year: '',
  furnishing: '',
  address: '',
  district: '',
  postal_code: '',
  mrt_nearest: '',
  mrt_distance_m: '',
}

type FormMode = 'draft' | 'published' | null

export default function NewListingPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [submitMode, setSubmitMode] = useState<FormMode>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdListing, setCreatedListing] = useState<{ id: string } | null>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (mode: 'draft' | 'published') => {
    // Validation
    if (!form.title.trim()) return setError('Title is required')
    if (form.description.trim().length < 20)
      return setError('Description must be at least 20 characters')
    if (!form.property_type) return setError('Property type is required')
    if (!form.price || Number(form.price) <= 0) return setError('Valid price is required')
    if (!form.bedrooms) return setError('Bedrooms required')
    if (!form.bathrooms) return setError('Bathrooms required')
    if (!form.sqft || Number(form.sqft) <= 0) return setError('Floor area is required')
    if (!form.address.trim()) return setError('Address is required')
    if (!form.district) return setError('District is required')
    if (!form.furnishing) return setError('Furnishing is required')

    setSubmitMode(mode)
    setError(null)

    const payload = {
      type: form.type,
      property_type: form.property_type,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      price_psf: form.price_psf ? Number(form.price_psf) : undefined,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sqft: Number(form.sqft),
      address: form.address.trim(),
      district: Number(form.district),
      postal_code: form.postal_code.trim(),
      amenities: selectedAmenities,
      photos: [], // no upload yet — stored API will use a placeholder
      furnishing: form.furnishing,
      floor_level: form.floor_level || undefined,
      tenure: form.tenure || undefined,
      top_year: form.top_year ? Number(form.top_year) : undefined,
      mrt_nearest: form.mrt_nearest || undefined,
      mrt_distance_m: form.mrt_distance_m ? Number(form.mrt_distance_m) : undefined,
      status: mode === 'draft' ? 'draft' : 'active',
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save listing')
        setSubmitMode(null)
        return
      }
      setCreatedListing({ id: data.listing.id })
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
      setSubmitMode(null)
    }
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
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          {submitMode === 'draft'
            ? "Your listing has been saved. You can publish it whenever you're ready."
            : 'Your listing is now live and visible to buyers and renters across Singapore.'}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" render={<Link href="/dashboard/listings" />}>
            View All Listings
          </Button>
          {createdListing && submitMode === 'published' && (
            <Button render={<Link href={`/listing/${createdListing.id}`} />}>
              View Live Listing
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              setSubmitted(false)
              setSubmitMode(null)
              setForm(INITIAL_FORM)
              setSelectedAmenities([])
              setCreatedListing(null)
            }}
          >
            Add Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Section: Basic Info */}
        <FormSection title="Listing Details" description="Core information about the property.">
          {/* Listing type toggle */}
          <div className="col-span-2">
            <Label className="text-xs font-medium text-gray-700 mb-2 block">Listing Type</Label>
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1">
              {(['sale', 'rent'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update('type', type)}
                  className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    form.type === type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type === 'sale' ? 'For Sale' : 'For Rent'}
                </button>
              ))}
            </div>
          </div>

          <FormField label="Property Type" required>
            <Select
              value={form.property_type}
              onValueChange={(v) => update('property_type', (v ?? '') as PropertyType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="col-span-2">
            <FormField label="Listing Title" required>
              <Input
                placeholder="e.g. Luxury 3BR at The Orchard Residences"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </FormField>
          </div>

          <div className="col-span-2">
            <FormField label="Description" required>
              <Textarea
                placeholder="Describe the property — highlights, nearby amenities, what makes it special..."
                className="min-h-[120px] resize-y"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Pricing" description="Set your asking price.">
          <FormField
            label={form.type === 'rent' ? 'Monthly Rent (SGD)' : 'Asking Price (SGD)'}
            required
          >
            <Input
              type="number"
              placeholder={form.type === 'rent' ? '3500' : '1200000'}
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
            />
          </FormField>
          <FormField label="Price PSF (SGD, optional)">
            <Input
              type="number"
              placeholder="1800"
              value={form.price_psf}
              onChange={(e) => update('price_psf', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="Property Details" description="Physical specifications of the property.">
          <FormField label="Bedrooms" required>
            <Input
              type="number"
              min={0}
              placeholder="3"
              value={form.bedrooms}
              onChange={(e) => update('bedrooms', e.target.value)}
            />
          </FormField>
          <FormField label="Bathrooms" required>
            <Input
              type="number"
              min={1}
              placeholder="2"
              value={form.bathrooms}
              onChange={(e) => update('bathrooms', e.target.value)}
            />
          </FormField>
          <FormField label="Floor Area (sqft)" required>
            <Input
              type="number"
              placeholder="1200"
              value={form.sqft}
              onChange={(e) => update('sqft', e.target.value)}
            />
          </FormField>
          <FormField label="Floor Level">
            <Input
              placeholder="e.g. High (25-30)"
              value={form.floor_level}
              onChange={(e) => update('floor_level', e.target.value)}
            />
          </FormField>
          <FormField label="Tenure">
            <Select value={form.tenure} onValueChange={(v) => update('tenure', v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tenure" />
              </SelectTrigger>
              <SelectContent>
                {TENURE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="TOP Year">
            <Input
              type="number"
              placeholder="2018"
              min={1950}
              max={2030}
              value={form.top_year}
              onChange={(e) => update('top_year', e.target.value)}
            />
          </FormField>
          <FormField label="Furnishing" required>
            <Select
              value={form.furnishing}
              onValueChange={(v) => update('furnishing', (v ?? '') as FurnishingLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select furnishing" />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>

        <FormSection title="Location" description="Address and district details.">
          <div className="col-span-2">
            <FormField label="Street Address" required>
              <Input
                placeholder="e.g. 238 Orchard Boulevard"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="District" required>
            <Select value={form.district} onValueChange={(v) => update('district', v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SG_DISTRICTS).map(([num, name]) => (
                  <SelectItem key={num} value={num}>
                    D{num} — {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Postal Code">
            <Input
              placeholder="238652"
              maxLength={6}
              value={form.postal_code}
              onChange={(e) => update('postal_code', e.target.value)}
            />
          </FormField>
          <FormField label="Nearest MRT">
            <Select value={form.mrt_nearest} onValueChange={(v) => update('mrt_nearest', v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select MRT" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_MRTS.map((mrt) => (
                  <SelectItem key={mrt} value={mrt}>
                    {mrt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="MRT Distance (metres)">
            <Input
              type="number"
              placeholder="300"
              min={0}
              value={form.mrt_distance_m}
              onChange={(e) => update('mrt_distance_m', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="Amenities" description="Select all facilities available.">
          <div className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((amenity) => {
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
                {selectedAmenities.length} selected
              </p>
            )}
          </div>
        </FormSection>

        <FormSection title="Photos" description="Photo upload coming soon — listings will use a placeholder image for now.">
          <div className="col-span-2">
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm mx-auto mb-3">
                <Upload className="size-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Photo upload coming soon</p>
              <p className="text-xs text-gray-400 mt-1">
                Listings will display a placeholder image until upload is enabled.
              </p>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Submit row */}
      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white/90 backdrop-blur border-t border-gray-200 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={submitMode !== null}>
          Save as Draft
        </Button>
        <Button onClick={() => handleSubmit('published')} disabled={submitMode !== null}>
          {submitMode === 'published' ? 'Publishing…' : 'Publish Listing'}
        </Button>
      </div>
    </div>
  )
}

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
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
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
    <div>
      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  )
}
