import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Strata Listings',
  description:
    'Sign in to your Strata Listings agent account to manage your property listings and inquiries.',
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
