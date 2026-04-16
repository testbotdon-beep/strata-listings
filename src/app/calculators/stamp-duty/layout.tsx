import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stamp Duty Calculator — BSD & ABSD',
  description:
    "Calculate Singapore stamp duty for property purchases. Includes Buyer's Stamp Duty (BSD) and Additional Buyer's Stamp Duty (ABSD) for all buyer profiles — SC, PR, foreigner, and entity.",
}

export default function StampDutyLayout({ children }: { children: React.ReactNode }) {
  return children
}
