import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'

// In production, use Redis/DB to store reset tokens
const resetTokens = new Map<string, { email: string; tenantId: string; expires: number }>()

export async function POST(request: Request) {
  try {
    const { email, tenantSlug } = await request.json()
    
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
    
    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('email', email)
      .single()
    
    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({ success: true })
    }
    
    // Generate reset token
    const token = randomBytes(32).toString('hex')
    resetTokens.set(token, {
      email,
      tenantId: tenant.id,
      expires: Date.now() + 3600000 // 1 hour
    })
    
    // In production: send email with reset link
    // For demo purposes, log the token
    console.log(`Password reset token for ${email}: ${token}`)
    
    return NextResponse.json({ success: true, message: 'Reset instructions sent to email' })
  } catch (error) {
    console.error('Recovery error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { token, newPassword } = await request.json()
    
    const stored = resetTokens.get(token)
    
    if (!stored || stored.expires < Date.now()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }
    
    const supabase = await createSupabaseServerClient()
    
    // Update password
    const passwordHash = await hash(newPassword, 12)
    
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('tenant_id', stored.tenantId)
      .eq('email', stored.email)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    resetTokens.delete(token)
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}