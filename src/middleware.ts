import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip non-tenant routes (static files, etc)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Skip API routes that don't need tenant context
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Extract tenant from hostname
  const hostname = request.headers.get('host') || ''
  const isLocalhost = hostname.includes('localhost')
  
  let tenantSlug: string | null = null
  
  if (isLocalhost) {
    // Local development: use query param or path segment
    // Default to 'demo' tenant
    tenantSlug = 'demo'
  } else {
    // Production: extract from subdomain (tenant.example.com)
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      const subdomain = parts[0]
      if (subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'admin') {
        tenantSlug = subdomain
      }
    }
  }
  
  // If no tenant identified, use default
  if (!tenantSlug) {
    tenantSlug = 'demo'
  }
  
  // Set tenant header for downstream usage
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)
  
  // For store routes, rewrite to tenant-scoped path
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const tenantPath = `/${tenantSlug}${pathname === '/' ? '' : pathname}`
    const url = request.nextUrl.clone()
    url.pathname = tenantPath
    
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }
  
  // For admin routes, set tenant header and continue
  if (pathname.startsWith('/admin')) {
    const adminPath = `/admin/${tenantSlug}${pathname.replace('/admin', '')}`
    const url = request.nextUrl.clone()
    url.pathname = adminPath
    
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }
  
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}