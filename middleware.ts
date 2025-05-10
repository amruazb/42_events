import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of supported locales
const locales = ["en", "ar", "fr"]

// Get the preferred locale from request
function getLocale(request: NextRequest) {
  // Check if there's a cookie with a preferred locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Check for locale in pathname
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  if (pathnameLocale) return pathnameLocale

  // Check for Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const headerLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0])
      .find((lang) => locales.includes(lang))

    if (headerLocale) return headerLocale
  }

  // Default to English
  return "en"
}

export function middleware(request: NextRequest) {
  // Get the locale from the request
  const locale = getLocale(request)

  // Get the pathname without the locale
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // If the pathname doesn't have a locale, redirect to the pathname with the locale
  if (!pathnameHasLocale) {
    // Create a new URL with the locale
    const newUrl = new URL(`/${locale}${pathname}`, request.url)

    // Copy the search params
    newUrl.search = request.nextUrl.search

    // Return a redirect response
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
