import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Create Your Agent Account',
  description:
    'Create a Strata Listings agent account. 5 listings free for everyone, 15 free for Strata subscribers, or $30/month for 15.',
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
