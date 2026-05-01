import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Partial<CookieOptions> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  )
}

export async function getCurrentTenant() {
  const cookieStore = await cookies()
  const tenantSlug = cookieStore.get('x-tenant-slug')?.value

  if (!tenantSlug) {
    // Fallback: try to get from header (for API routes)
    const headers = await cookies()
    return null
  }

  const supabase = await createSupabaseServerClient()
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', tenantSlug)
    .single()

  return tenant
}

export async function setTenantCookie(tenantSlug: string) {
  const cookieStore = await cookies()
  cookieStore.set('x-tenant-slug', tenantSlug, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function getUserTenantId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get tenant_id from user metadata or session
  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  return userData?.tenant_id || null
}

export function getTenantFromSubdomain(host: string): string | null {
  // Handle localhost
  if (host.includes('localhost')) {
    return 'demo'
  }

  // Extract subdomain from host (e.g., demo.store.com -> demo)
  const parts = host.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }

  // If no subdomain, default to demo
  return 'demo'
}