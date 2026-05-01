import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    const categories = data || []
    
    // Build hierarchical tree structure
    const rootCategories = categories.filter(c => !c.parent_id)
    
    const tree = rootCategories.map(cat => ({
      ...cat,
      children: categories
        .filter(c => c.parent_id === cat.id)
        .map(child => ({ ...child, children: [] }))
    }))
    
    return NextResponse.json({ categories: tree })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const body = await request.json()
    const { name, slug, description, parent_id } = body
    
    // Get tenant
    const cookies = await supabase.auth.getSession()
    const tenantSlug = cookies.data.session?.user?.email?.split('@')[1] || 'demo'
    
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }
    
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        tenant_id: tenant.id,
        name,
        slug,
        description,
        parent_id
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}