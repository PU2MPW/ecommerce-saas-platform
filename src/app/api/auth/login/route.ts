import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { verify } from 'bcryptjs'
import { setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, tenantSlug } = await request.json()
    
    const supabase = await createSupabaseServerClient()
    
    // Get tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug || 'demo')
      .single()
    
    if (!tenant) {
      return NextResponse.json({ error: 'Invalid tenant' }, { status: 400 })
    }
    
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('email', email)
      .single()
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Verify password
    const isValid = await verify(password, user.password_hash)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Set session
    await setSession(user.id, tenant.id, email)
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}