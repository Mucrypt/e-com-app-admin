import { type NextRequest } from 'next/server'
import { updateSession } from '@/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Configuration object for middleware route matching.
 *
 * @remarks
 * The `matcher` property defines an array of path patterns that the middleware should apply to.
 * This pattern matches all request paths except for:
 * - Paths starting with `_next/static` (static files)
 * - Paths starting with `_next/image` (image optimization files)
 * - Requests for `favicon.ico` (favicon file)
 * - Paths starting with `api` (API routes)
 * - Requests for common image file extensions (`.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`)
 * - The root path (`/`)
 *
 * You can modify the pattern to include or exclude additional paths as needed.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|^/$).*)',
  ],
}
