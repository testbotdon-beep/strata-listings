'use client'

import { useState } from 'react'
import { CheckCircle2, Send, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Subject = 'General Inquiry' | 'Partnership' | 'Press' | 'Support'

interface FormState {
  name: string
  email: string
  subject: Subject
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address'
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
          source: 'general-contact',
          ...form,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setErrors({ message: 'Could not send message. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange<K extends keyof FormState>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value as FormState[K] }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-emerald-50 px-6 py-12 text-center ring-1 ring-emerald-200">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <div>
          <h3 className="text-base font-semibold text-slate-900">Message received!</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Thank you for reaching out. We&apos;ll get back to you within one business day.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setForm({ name: '', email: '', subject: 'General Inquiry', message: '' })
          }}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name" className="text-sm font-medium">
          Your name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange('name')}
          aria-invalid={!!errors.name}
          className="h-10"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email" className="text-sm font-medium">
          Email address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange('email')}
          aria-invalid={!!errors.email}
          className="h-10"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-subject" className="text-sm font-medium">
          Subject
        </Label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={handleChange('subject')}
          className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Partnership">Partnership</option>
          <option value="Press">Press</option>
          <option value="Support">Support</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message" className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contact-message"
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={handleChange('message')}
          aria-invalid={!!errors.message}
          className="min-h-32 resize-none"
          rows={5}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="h-11 w-full gap-2 font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
