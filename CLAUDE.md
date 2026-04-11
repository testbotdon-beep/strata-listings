@AGENTS.md

# Strata Listings

Singapore property listings website — PropertyGuru competitor integrated with Strata AI assistant.

## Stack
- Next.js 16, React 19, TypeScript
- Tailwind v4, shadcn/ui (base-nova)
- Supabase (planned — currently using mock data)
- Deploy: Vercel at listings.uqlabs.co

## Dev
```bash
npm run dev    # starts on port 3000
npm run build  # production build
npm run lint   # eslint
```

## Structure
- `src/app/` — pages (App Router)
- `src/components/` — shared components
- `src/components/ui/` — shadcn/ui primitives
- `src/lib/data.ts` — mock data (replace with Supabase later)
- `src/types/listing.ts` — TypeScript types

## Key decisions
- Mock data in `src/lib/data.ts` until Supabase is connected
- Agent auth is placeholder (hardcoded agent-1) — Supabase Auth coming
- `strata_agent_id` field on agents enables Strata integration (phase 2)
- Images from Unsplash for demo, Supabase Storage for production
