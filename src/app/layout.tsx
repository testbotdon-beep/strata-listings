import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://listings.uqlabs.co'),
  title: {
    default: 'Strata Listings — Singapore Property',
    template: '%s | Strata Listings',
  },
  description:
    'Find your next home in Singapore. Browse HDB flats, condos, landed homes, and commercial listings across every district. Verified by licensed CEA agents.',
  keywords: [
    'Singapore property',
    'HDB for sale',
    'condo for rent',
    'Singapore real estate',
    'Singapore property marketplace',
    'Singapore agents',
    'PropertyGuru alternative',
  ],
  openGraph: {
    title: 'Strata Listings — Singapore Property',
    description:
      'Find your next home in Singapore. HDB · Condos · Landed · Commercial across all 28 districts.',
    url: 'https://listings.uqlabs.co',
    siteName: 'Strata Listings',
    type: 'website',
    locale: 'en_SG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strata Listings — Singapore Property',
    description:
      'Find your next home in Singapore. HDB · Condos · Landed · Commercial across all 28 districts.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
