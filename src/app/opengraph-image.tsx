import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Strata Listings — Singapore Property'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)',
          padding: '80px',
          fontFamily: 'system-ui',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Strata</span>
            <span style={{ color: '#2563eb' }}>Listings</span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Headline */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Find a home you&apos;ll love</span>
          <span>in Singapore</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#475569',
            marginTop: 24,
            display: 'flex',
          }}
        >
          HDB · Condos · Landed · Commercial across all 28 districts
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              background: '#0f172a',
              color: 'white',
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 600,
              display: 'flex',
            }}
          >
            listings.uqlabs.co
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#64748b',
              display: 'flex',
            }}
          >
            10,000+ verified listings · 500+ licensed agents
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
