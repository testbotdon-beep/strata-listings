'use client'

export function FooterNewsletter() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-300">Get weekly market updates</p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-2"
        aria-label="Newsletter signup"
      >
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email address"
          className="flex-1 min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}
