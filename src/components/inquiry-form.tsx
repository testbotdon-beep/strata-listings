'use client'

import { useState } from 'react'
import { CheckCircle, Send, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InquiryFormProps {
  listingId: string
  agentName: string
  className?: string
  idPrefix?: string
}

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

export function InquiryForm({ listingId, agentName, className, idPrefix = 'inquiry' }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: `Hi ${agentName}, I am interested in this property. Please get in touch with me.`,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email'
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'listing-inquiry',
          listingId,
          agentName,
          ...form,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setErrors({ message: 'Could not send inquiry. Please try again or call the agent directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 rounded-xl bg-emerald-50 px-6 py-10 text-center ring-1 ring-emerald-200',
          className
        )}
      >
        <CheckCircle className="h-12 w-12 text-emerald-500" />
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Inquiry sent!
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your inquiry will be sent directly to the agent. {agentName} will be in touch shortly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setForm({
              name: '',
              email: '',
              phone: '',
              message: `Hi ${agentName}, I am interested in this property. Please get in touch with me.`,
            })
          }}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-4', className)} noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
          Your name <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-name`}
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange('name')}
          aria-invalid={!!errors.name}
          className="h-10"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
          Email address <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange('email')}
          aria-invalid={!!errors.email}
          className="h-10"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-phone`} className="text-sm font-medium">
          Phone number
        </Label>
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          placeholder="+65 9123 4567"
          value={form.phone}
          onChange={handleChange('phone')}
          className="h-10"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-message`} className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id={`${idPrefix}-message`}
          placeholder="I am interested in this property..."
          value={form.message}
          onChange={handleChange('message')}
          aria-invalid={!!errors.message}
          className="min-h-24 resize-none"
          rows={4}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="h-10 w-full gap-2 font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Inquiry
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your details are shared only with the listing agent.
      </p>
    </form>
  )
}
