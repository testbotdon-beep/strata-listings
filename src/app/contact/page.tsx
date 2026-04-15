import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact — Strata Listings',
  description:
    'Get in touch with the Strata Listings team. We respond within one business day.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl text-balance">
            Get in touch
          </h1>
          <p className="mt-5 text-base text-slate-600 leading-relaxed">
            Questions, partnerships, or support — send us a message and
            we&apos;ll reply within one business day.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
