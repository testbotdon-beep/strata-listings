import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  // Protect /dashboard/* routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    const signInUrl = new URL('/sign-in', req.nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect signed-in users away from auth pages
  if ((pathname === '/sign-in' || pathname === '/sign-up') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}
