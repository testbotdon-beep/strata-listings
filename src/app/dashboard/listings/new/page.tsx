'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Image as ImageIcon, X, CheckCircle2, ChevronLeft, Upload, Loader2 } from 'lucide-react'
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
import { SG_DISTRICTS, PROPERTY_TYPE_LABELS, POPULAR_MRTS, HDB_TYPE_LABELS, FACING_LABELS, CONDITION_LABELS } from '@/types/listing'
import type { ListingType, PropertyType, FurnishingLevel, HdbType, Facing, PropertyCondition } from '@/types/listing'

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
  // PropertyGuru-parity fields
  available_from: string
  lease_term_months: string
  pets_allowed: '' | 'yes' | 'no'
  cooking_allowed: '' | 'yes' | 'no'
  hdb_type: HdbType | ''
  negotiable: boolean
  facing: Facing | ''
  parking_lots: string
  balcony: '' | 'yes' | 'no'
  property_condition: PropertyCondition | ''
  listing_reference: string
  co_broke: boolean
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
  available_from: '',
  lease_term_months: '',
  pets_allowed: '',
  cooking_allowed: '',
  hdb_type: '',
  negotiable: false,
  facing: '',
  parking_lots: '',
  balcony: '',
  property_condition: '',
  listing_reference: '',
  co_broke: false,
}

type FormMode = 'draft' | 'published' | null

export default function NewListingPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [submitMode, setSubmitMode] = useState<FormMode>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdListing, setCreatedListing] = useState<{ id: string } | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoUploading, setPhotoUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function compressAndUpload(file: File) {
    setPhotoUploading(true)
    try {
      const bitmap = await createImageBitmap(file)
      const maxDim = 1200
      let w = bitmap.width
      let h = bitmap.height
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      const canvas = new OffscreenCanvas(w, h)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0, w, h)
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.75 })
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataUrl, name: file.name, type: 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setPhotos((prev) => [...prev, data.url])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed')
    } finally {
      setPhotoUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    if (photos.length + files.length > 8) {
      setError('Maximum 8 photos per listing')
      return
    }
    Array.from(files).forEach((f) => compressAndUpload(f))
    e.target.value = ''
  }

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
      photos,
      furnishing: form.furnishing,
      floor_level: form.floor_level || undefined,
      tenure: form.tenure || undefined,
      top_year: form.top_year ? Number(form.top_year) : undefined,
      mrt_nearest: form.mrt_nearest || undefined,
      mrt_distance_m: form.mrt_distance_m ? Number(form.mrt_distance_m) : undefined,
      // PropertyGuru-parity additions (all optional on backend)
      available_from: form.available_from || undefined,
      lease_term_months: form.lease_term_months ? Number(form.lease_term_months) : undefined,
      pets_allowed: form.pets_allowed === '' ? undefined : form.pets_allowed === 'yes',
      cooking_allowed: form.cooking_allowed === '' ? undefined : form.cooking_allowed === 'yes',
      hdb_type: form.hdb_type || undefined,
      negotiable: form.negotiable,
      facing: form.facing || undefined,
      parking_lots: form.parking_lots ? Number(form.parking_lots) : undefined,
      balcony: form.balcony === '' ? undefined : form.balcony === 'yes',
      property_condition: form.property_condition || undefined,
      listing_reference: form.listing_reference.trim() || undefined,
      co_broke: form.co_broke,
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

        <FormSection
          title="Property Details"
          description="Extra fields buyers and tenants always ask about."
        >
          {form.property_type === 'hdb' && (
            <FormField label="HDB Type">
              <Select
                value={form.hdb_type}
                onValueChange={(v) => update('hdb_type', (v ?? '') as HdbType | '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select HDB type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HDB_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField label="Available From">
            <Input
              type="date"
              value={form.available_from}
              onChange={(e) => update('available_from', e.target.value)}
            />
          </FormField>

          {form.type === 'rent' && (
            <>
              <FormField label="Minimum Lease (months)">
                <Input
                  type="number"
                  placeholder="12"
                  min={1}
                  value={form.lease_term_months}
                  onChange={(e) => update('lease_term_months', e.target.value)}
                />
              </FormField>
              <FormField label="Pets Allowed">
                <Select value={form.pets_allowed} onValueChange={(v) => update('pets_allowed', (v ?? '') as 'yes' | 'no' | '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pets" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Cooking Allowed">
                <Select value={form.cooking_allowed} onValueChange={(v) => update('cooking_allowed', (v ?? '') as 'yes' | 'no' | '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Cooking" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </>
          )}

          <FormField label="Facing">
            <Select value={form.facing} onValueChange={(v) => update('facing', (v ?? '') as Facing | '')}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Compass direction" /></SelectTrigger>
              <SelectContent>
                {Object.entries(FACING_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Property Condition">
            <Select value={form.property_condition} onValueChange={(v) => update('property_condition', (v ?? '') as PropertyCondition | '')}>
              <SelectTrigger className="w-full"><SelectValue placeholder="New / Renovated / Original" /></SelectTrigger>
              <SelectContent>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Parking Lots">
            <Input
              type="number"
              placeholder="1"
              min={0}
              value={form.parking_lots}
              onChange={(e) => update('parking_lots', e.target.value)}
            />
          </FormField>

          <FormField label="Balcony">
            <Select value={form.balcony} onValueChange={(v) => update('balcony', (v ?? '') as 'yes' | 'no' | '')}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Has balcony?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Listing Reference (optional)">
            <Input
              placeholder="Your internal reference"
              value={form.listing_reference}
              onChange={(e) => update('listing_reference', e.target.value)}
            />
          </FormField>

          <div className="col-span-2 flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.negotiable}
                onChange={(e) => update('negotiable', e.target.checked)}
                className="size-4"
              />
              <span>Price is negotiable</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.co_broke}
                onChange={(e) => update('co_broke', e.target.checked)}
                className="size-4"
              />
              <span>Open to co-broke (commission split with buyer&apos;s agent)</span>
            </label>
          </div>
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

        <FormSection title="Photos" description="Upload up to 8 photos. They'll be compressed automatically.">
          <div className="col-span-2">
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {photos.map((url, i) => (
                  <div key={url} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {photos.length < 8 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {photoUploading ? (
                  <Loader2 className="size-5 text-slate-400 mx-auto mb-2 animate-spin" />
                ) : (
                  <Upload className="size-5 text-slate-400 mx-auto mb-2" />
                )}
                <p className="text-sm font-medium text-slate-700">
                  {photoUploading ? 'Uploading…' : 'Click to upload photos'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG or PNG, max 8 photos. Auto-compressed to save space.
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
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
