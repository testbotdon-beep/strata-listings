'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Building2,
  LayoutDashboard,
  ListFilter,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  CreditCard,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/listings', label: 'My Listings', icon: ListFilter },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface SidebarAgent {
  name: string
  email: string
  image?: string | null
}

function SidebarContent({
  pathname,
  agent,
  onLinkClick,
}: {
  pathname: string
  agent: SidebarAgent
  onLinkClick?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
          <Building2 className="size-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-white tracking-tight">Strata Listings</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Agent profile */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {agent.image && <AvatarImage src={agent.image} alt={agent.name} />}
            <AvatarFallback className="bg-slate-700 text-slate-200 text-xs">
              {agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{agent.name}</p>
            <p className="text-xs text-slate-500 truncate">{agent.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-slate-500 hover:text-white hover:bg-slate-800 shrink-0"
            aria-label="Sign out"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, status: sessionStatus } = useSession()
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  const agent: SidebarAgent = {
    name: session?.user?.name ?? 'Agent',
    email: session?.user?.email ?? '',
    image: session?.user?.image,
  }

  // Fetch subscription status for the banner
  useEffect(() => {
    if (sessionStatus !== 'authenticated') return
    let cancelled = false
    fetch('/api/users/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!cancelled && u?.subscription_status) {
          setSubscriptionStatus(u.subscription_status)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [sessionStatus, pathname])

  const showActivationBanner =
    subscriptionStatus !== null &&
    subscriptionStatus !== 'active' &&
    !pathname.startsWith('/dashboard/billing')

  const currentPage = NAV_LINKS.find((l) =>
    l.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(l.href)
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900">
        <SidebarContent pathname={pathname} agent={agent} />
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="lg:hidden text-gray-500">
                    <Menu className="size-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                }
              />
              <SheetContent side="left" className="w-60 p-0 bg-slate-900 border-slate-800" showCloseButton={false}>
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarContent
                  pathname={pathname}
                  agent={agent}
                  onLinkClick={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex size-6 items-center justify-center rounded bg-blue-600">
                <Building2 className="size-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Strata Listings</span>
            </div>

            {/* Desktop page title */}
            <h1 className="hidden lg:block text-sm font-semibold text-gray-900">
              {currentPage?.label ?? 'Dashboard'}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-500">{agent.email}</span>
            <Avatar size="sm">
              {agent.image && <AvatarImage src={agent.image} alt={agent.name} />}
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                {agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {showActivationBanner && (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-900">
                      Activate your account to publish listings
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Subscribe for $79/month or apply a promo code to get started.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/billing"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  Activate account
                </Link>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
