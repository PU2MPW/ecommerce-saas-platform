import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hash } from 'bcryptjs'
import { setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name, tenantSlug } = await request.json()
    
    const supabase = await createSupabaseServerClient()
    
    // Get tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug || 'demo')
      .single()
    
    const tenantId = tenant?.id
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Invalid tenant' }, { status: 400 })
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    
    // Hash password
    const passwordHash = await hash(password, 12)
    
    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        tenant_id: tenantId,
        email,
        name,
        password_hash: passwordHash,
        role: 'customer'
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Set session
    await setSession(user.id, tenantId, email)
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}