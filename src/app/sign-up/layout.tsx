import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Create Your Agent Account',
  description:
    'Create a Strata Listings agent account. Post unlimited property listings in Singapore for $79/month. Free for Strata AI subscribers.',
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
