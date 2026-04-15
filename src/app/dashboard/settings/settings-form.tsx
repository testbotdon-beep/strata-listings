'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { StoredUser } from '@/lib/storage'

type SafeUser = Omit<StoredUser, 'password_hash'>

interface SettingsFormProps {
  user: SafeUser
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()

  const [form, setForm] = useState({
    name: user.name ?? '',
    email: user.email ?? '',
    agency: user.agency ?? '',
    phone: user.phone ?? '',
    license_no: user.license_no ?? '',
    bio: user.bio ?? '',
    photo_url: user.photo_url ?? '',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSaved(false)
    setError(null)
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          agency: form.agency,
          phone: form.phone,
          license_no: form.license_no,
          bio: form.bio,
          photo_url: form.photo_url,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Failed to save changes.')
        return
      }

      setSaved(true)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      agency: user.agency ?? '',
      phone: user.phone ?? '',
      license_no: user.license_no ?? '',
      bio: user.bio ?? '',
      photo_url: user.photo_url ?? '',
    })
    setSaved(false)
    setError(null)
  }

  const initials = form.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your agent profile and account details.</p>
      </div>

      {/* Profile photo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <Avatar className="size-20">
            <AvatarImage src={form.photo_url} alt={form.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{form.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{form.agency}</p>
          </div>
        </div>
        <SettingsField label="Photo URL" description="Paste a direct image URL to update your avatar.">
          <Input
            value={form.photo_url}
            onChange={handleChange('photo_url')}
            placeholder="https://example.com/your-photo.jpg"
          />
        </SettingsField>
      </div>

      {/* Personal details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2">
          <User className="size-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Personal Details</h3>
        </div>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Full Name" required>
            <Input
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Your full name"
            />
          </SettingsField>

          <SettingsField label="Email Address" description="Email cannot be changed.">
            <Input
              type="email"
              value={form.email}
              readOnly
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </SettingsField>

          <SettingsField label="Phone Number" required>
            <Input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+65 9123 4567"
            />
          </SettingsField>

          <SettingsField label="CEA License Number">
            <Input
              value={form.license_no}
              onChange={handleChange('license_no')}
              placeholder="R012345A"
            />
          </SettingsField>
        </div>
      </div>

      {/* Agency */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">Agency</h3>
        <Separator />
        <SettingsField label="Agency Name" required>
          <Input
            value={form.agency}
            onChange={handleChange('agency')}
            placeholder="Your agency name"
          />
        </SettingsField>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">Bio</h3>
        <Separator />
        <SettingsField label="About You" description="Shown on your public profile and listings.">
          <Textarea
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Tell buyers and renters about your experience and specialisations..."
            className="min-h-[100px] resize-y"
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length} / 500</p>
        </SettingsField>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-4">
        <div>
          {saved && (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="size-4" />
              <span className="text-sm font-medium">Changes saved</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 text-red-600">
              <AlertCircle className="size-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          {!saved && !error && (
            <p className="text-sm text-gray-500">Make sure to save your changes.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={saving}
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SettingsField({
  label,
  required,
  description,
  children,
}: {
  label: string
  required?: boolean
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-gray-400 -mt-0.5">{description}</p>
      )}
      {children}
    </div>
  )
}
