import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affordability Calculator — TDSR & MSR',
  description:
    'Find out how much property you can afford in Singapore. Calculates your maximum purchase price based on TDSR, MSR, income, and existing debts.',
}

export default function AffordabilityLayout({ children }: { children: React.ReactNode }) {
  return children
}
