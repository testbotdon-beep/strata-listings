type Active = 'strata' | 'listings' | 'propreels' | null

const PRODUCTS: { key: Exclude<Active, null>; label: string; href: string }[] = [
  { key: 'strata', label: 'Strata', href: 'https://strata.uqlabs.co' },
  { key: 'listings', label: 'Listings', href: 'https://listings.uqlabs.co' },
  { key: 'propreels', label: 'PropReels', href: 'https://propreels.uqlabs.co' },
]

export function UniqHeader({ active }: { active?: Active }) {
  return (
    <div className="bg-black text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between gap-4">
        <a href="https://uqlabs.co" className="text-xs font-bold tracking-tight whitespace-nowrap">
          Uniq Labs
        </a>
        <nav className="flex items-center gap-3 sm:gap-5 text-xs overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {PRODUCTS.map((p) => (
            <a
              key={p.key}
              href={p.href}
              className={
                active === p.key
                  ? 'text-white font-semibold whitespace-nowrap'
                  : 'text-white/60 hover:text-white transition whitespace-nowrap'
              }
            >
              {p.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
