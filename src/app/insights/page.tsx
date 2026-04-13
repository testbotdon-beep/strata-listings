import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, TrendingUp, Home, DollarSign, FileText, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getArticles, getFeaturedArticles, type Article } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Property Insights — Singapore Market Reports & Guides | Strata Listings',
  description:
    'Expert analysis, market reports, buyer guides, and investment insights on Singapore property. Stay informed with Strata Listings.',
  openGraph: {
    title: 'Property Insights — Strata Listings',
    description:
      'Expert analysis, market reports, buyer guides, and investment insights on Singapore property.',
    type: 'website',
  },
}

const CATEGORY_CONFIG: Record<
  Article['category'],
  { label: string; color: string; icon: React.ReactNode }
> = {
  'market-insights': {
    label: 'Market Insights',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  guides: {
    label: 'Guides',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <Home className="h-3.5 w-3.5" />,
  },
  'new-launches': {
    label: 'New Launches',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: <Home className="h-3.5 w-3.5" />,
  },
  investment: {
    label: 'Investment',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <DollarSign className="h-3.5 w-3.5" />,
  },
  'legal-tax': {
    label: 'Legal & Tax',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: <FileText className="h-3.5 w-3.5" />,
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function CategoryBadge({ category }: { category: Article['category'] }) {
  const cfg = CATEGORY_CONFIG[category]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readMinutes} min
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow items-start"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="112px"
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <CategoryBadge category={article.category} />
        <h3 className="mt-1.5 text-sm font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  )
}

type CategoryFilter = Article['category'] | 'all'

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const { category } = await searchParams

  const activeCategory: CategoryFilter =
    category && category in CATEGORY_CONFIG
      ? (category as Article['category'])
      : 'all'

  const featured = getFeaturedArticles()
  const allArticles =
    activeCategory === 'all'
      ? getArticles()
      : getArticles({ category: activeCategory as Article['category'] })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 text-xs font-medium">
            Singapore Property
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl leading-tight">
            Property Insights
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
            Market reports, buyer guides, and expert analysis to help you make
            smarter decisions in Singapore&apos;s property market.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Featured section — only show when no category filter */}
        {activeCategory === 'all' && featured.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Featured</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 3).map((article) => (
                <FeaturedCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Category filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/insights"
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            All Articles
          </Link>
          {(Object.entries(CATEGORY_CONFIG) as [Article['category'], (typeof CATEGORY_CONFIG)[Article['category']]][]).map(
            ([key, cfg]) => (
              <Link
                key={key}
                href={`/insights?category=${key}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                  activeCategory === key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {cfg.label}
              </Link>
            )
          )}
        </div>

        {/* Article grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {activeCategory === 'all'
                ? 'All Articles'
                : CATEGORY_CONFIG[activeCategory as Article['category']].label}
            </h2>
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">{allArticles.length} articles</span>
          </div>
          {allArticles.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {allArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
