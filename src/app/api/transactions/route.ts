import { NextRequest, NextResponse } from 'next/server'

// Recent HDB resale + URA private transactions for the area, fetched from
// data.gov.sg. Free public dataset, no API key needed. Used by the
// "Recent transactions" widget on listing detail pages.
//
// Query params:
//   - town: e.g. "PUNGGOL", "ANG MO KIO" (HDB town code)
//   - property_type: "hdb" | "condo" | "landed" — only HDB is wired up for now
//   - limit: defaults to 6
//
// Returns: { records: [{ month, address, sqft, price, flat_type, storey_range, ... }] }

const HDB_RESALE_DATASET = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc'
const DATA_GOV_BASE = 'https://data.gov.sg/api/action/datastore_search'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // cache 1h server-side

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const town = (searchParams.get('town') || '').toUpperCase().trim()
  const propertyType = (searchParams.get('property_type') || 'hdb').toLowerCase()
  const limit = Math.min(20, Number(searchParams.get('limit') || 6))

  // Only HDB resale is publicly free + clean. For condo/landed we'd need URA's
  // private-residential dataset (separate IDs, slightly different schema).
  if (propertyType !== 'hdb' || !town) {
    return NextResponse.json({ records: [], source: 'unsupported' })
  }

  try {
    const url = new URL(DATA_GOV_BASE)
    url.searchParams.set('resource_id', HDB_RESALE_DATASET)
    url.searchParams.set('q', town)
    url.searchParams.set('sort', '_id desc')
    url.searchParams.set('limit', String(limit))

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) {
      return NextResponse.json({ records: [], source: 'fetch_failed' })
    }
    const data = await res.json()
    const records = (data?.result?.records ?? []) as Array<{
      month: string
      town: string
      flat_type: string
      block: string
      street_name: string
      storey_range: string
      floor_area_sqm: string
      resale_price: string
      remaining_lease: string
    }>

    return NextResponse.json({
      records: records.map((r) => ({
        month: r.month,
        flat_type: r.flat_type,
        address: `Blk ${r.block} ${r.street_name}`,
        storey_range: r.storey_range,
        sqft: Math.round(parseFloat(r.floor_area_sqm) * 10.7639),
        sqm: parseFloat(r.floor_area_sqm),
        price: parseInt(r.resale_price, 10),
        remaining_lease: r.remaining_lease,
      })),
      source: 'data.gov.sg',
    })
  } catch (err) {
    console.error('[api/transactions] failed:', err)
    return NextResponse.json({ records: [], source: 'error' })
  }
}
