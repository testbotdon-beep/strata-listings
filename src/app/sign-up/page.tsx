'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  )
}

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agency: '',
    phone: '',
    license_no: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    if (error) setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Register
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const regData = await regRes.json()
      if (!regRes.ok) {
        setError(regData.error || 'Registration failed')
        setSubmitting(false)
        return
      }

      // Auto sign-in after successful registration
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInRes?.error) {
        setError('Account created but sign-in failed. Please sign in manually.')
        router.push('/sign-in')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
              <Building2 className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Strata <span className="text-primary">Listings</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Create your agent account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            List your properties free. Get instant buyer inquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Sarah Chen"
                value={form.name}
                onChange={update('name')}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@erarealty.com.sg"
                value={form.email}
                onChange={update('email')}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={update('password')}
                required
                minLength={8}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agency" className="text-sm font-medium">
                Agency <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agency"
                type="text"
                placeholder="ERA Realty Network"
                value={form.agency}
                onChange={update('agency')}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+65 9123 4567"
                value={form.phone}
                onChange={update('phone')}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="license_no" className="text-sm font-medium">
                CEA Licence Number
              </Label>
              <Input
                id="license_no"
                type="text"
                placeholder="R012345A (optional)"
                value={form.license_no}
                onChange={update('license_no')}
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full mt-2 gap-2 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
