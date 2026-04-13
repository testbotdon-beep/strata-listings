'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'newsletter', email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-slate-300">Get weekly market updates</p>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-900/30 px-3 py-2 ring-1 ring-emerald-500/30">
          <Check className="h-4 w-4 text-emerald-400" />
          <p className="text-xs text-emerald-200">You&apos;re subscribed!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-300">Get weekly market updates</p>
      <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Newsletter signup">
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          required
          disabled={status === 'submitting'}
          className="flex-1 min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {status === 'submitting' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-rose-400">Could not subscribe. Check your email and try again.</p>
      )}
    </div>
  )
}
