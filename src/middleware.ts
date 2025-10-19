import { createClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const {supabase, response} = createClient(request)

  // Refresh session if expired - required for Server Components
  const { 
    data: { session }, 
  } = await supabase.auth.getSession()

  const defaultLocale = 'en'
  const { pathname } = request.nextUrl
  const locales = ['en', 'th']

  // Check if pathname is a static file or public file
  const isStaticFile = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|html|htm|txt|xml|css|js|mp4)$/i.test(pathname)

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Don't redirect if it's a static file
  if (pathnameIsMissingLocale && !isStaticFile) {
    // Redirect to the default locale
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  
  const locale = pathname.split('/')[1]

  // Auth logic
  const isLoggedIn = !!session
  const isLoginPage = pathname.endsWith('/login')
  const isPublicPage = pathname.includes('/public')
  const isWinnersPage = pathname.includes('/winners')
  const isPublicWinnersPage = pathname.includes('/public/winners')

  if (isPublicPage || isWinnersPage || isPublicWinnersPage) {
    return response
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url))
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All static files and public files (make them publicly accessible)
     * - winners page (publicly accessible)
     * - public/winners page (publicly accessible)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|html|htm|txt|xml|css|js|mp4)$|winners|public/winners).*)',
  ],
}
