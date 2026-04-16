import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description:
    'Calculate your monthly mortgage repayment for Singapore property. Includes full amortisation schedule, total interest, and payment breakdown.',
}

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return children
}
