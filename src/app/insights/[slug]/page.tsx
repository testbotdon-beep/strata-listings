import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Calendar,
  Clock,
  ChevronLeft,
  User,
  Share2,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Home,
  DollarSign,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getArticleBySlug, getRelatedArticles, ARTICLES, type Article } from '@/lib/articles'

interface PageProps {
  params: Promise<{ slug: string }>
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

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article not found — Strata Listings' }

  return {
    title: `${article.title} | Strata Listings`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'long',
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

function parseContent(content: string) {
  const blocks = content.split('\n\n').filter(Boolean)
  return blocks.map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          {block.slice(3)}
        </h2>
      )
    }
    if (block.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-semibold text-slate-900 mt-8 mb-3">
          {block.slice(4)}
        </h3>
      )
    }
    if (block.startsWith('- ')) {
      const items = block.split('\n').map((l) => l.replace(/^-\s*/, ''))
      return (
        <ul key={i} className="list-disc ml-6 space-y-2 my-4 text-slate-600">
          {items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="text-slate-600 leading-relaxed my-4">
        {block}
      </p>
    )
  })
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <CategoryBadge category={article.category} />
        <h4 className="mt-2 text-sm font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h4>
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readMinutes} min read
          </span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  )
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) notFound()

  const related = getRelatedArticles(slug, 3)

  const initials = article.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            All Insights
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Category */}
          <CategoryBadge category={article.category} />

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold text-slate-900 leading-tight sm:text-4xl">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg text-slate-500 leading-relaxed">
            {article.subtitle}
          </p>

          {/* Author line */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {/* Avatar placeholder */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-tight">{article.author}</p>
              <p className="text-xs text-slate-500">{article.authorRole}</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.readMinutes} min read
              </span>
            </div>
          </div>

          {/* Cover image */}
          <div className="mt-8 overflow-hidden rounded-xl aspect-video relative bg-slate-100">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* Article content */}
          <article className="mt-10">
            {parseContent(article.content)}
          </article>

          <Separator className="my-10" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-500 font-medium mr-1">Tags:</span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 h-auto">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Share / Save */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-slate-100 pt-14">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-bold text-slate-900">Related Articles</h2>
              <div className="flex-1 h-px bg-slate-200" />
              <Link
                href="/insights"
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <RelatedCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
