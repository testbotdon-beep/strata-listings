'use client'

import { useState } from 'react'
import { CheckCircle2, Camera, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const MOCK_AGENT = {
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  phone: '+65 9123 4567',
  agency: 'ERA Realty Network',
  license_no: 'R012345A',
  bio: 'Specialising in District 9-11 luxury condos with 12 years of experience. Trusted by over 200 families to find their dream home in Singapore.',
  photo_url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&backgroundColor=c0aede',
}

export default function SettingsPage() {
  const [form, setForm] = useState({ ...MOCK_AGENT })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSaved(false)
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulated async save
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
  }

  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your agent profile and account details.</p>
      </div>

      {/* Profile photo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={form.photo_url} alt={form.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{form.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{form.agency}</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              Upload New Photo
            </Button>
          </div>
        </div>
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

          <SettingsField label="Email Address" required>
            <Input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
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

          <SettingsField label="Agency">
            <Input
              value={form.agency}
              onChange={handleChange('agency')}
              placeholder="Your agency name"
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

        <SettingsField label="Bio" description="Shown on your public profile and listings.">
          <Textarea
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Tell buyers and renters about your experience and specialisations..."
            className="min-h-[100px] resize-y"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length} / 500</p>
        </SettingsField>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-4">
        <div>
          {saved ? (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="size-4" />
              <span className="text-sm font-medium">Changes saved</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Make sure to save your changes.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => { setForm({ ...MOCK_AGENT }); setSaved(false) }}
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
