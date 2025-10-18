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

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Redirect to the default locale
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  
  const locale = pathname.split('/')[1]

  // Auth logic
  const isLoggedIn = !!session
  const isLoginPage = pathname.endsWith('/login')
  const isPublicPage = pathname.includes('/public')

  if (isPublicPage) {
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
     * - uat.html (UAT document)
     * - en/uat.html (UAT document in English locale)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|uat\.html|en/uat\.html|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
