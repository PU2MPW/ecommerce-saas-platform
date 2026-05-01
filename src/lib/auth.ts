import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'session'
export const TENANT_COOKIE = 'tenantSlug'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)
  
  if (!sessionCookie?.value) return null
  
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function setSession(userId: string, tenantId: string, email: string) {
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE, JSON.stringify({
    userId,
    tenantId,
    email,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getUserFromSession() {
  const session = await getSession()
  if (!session) return null

  return {
    userId: session.userId,
    tenantId: session.tenantId,
    email: session.email
  }
}