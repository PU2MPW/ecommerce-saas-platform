import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name')
    const categories = result.rows
    
    const tree = categories
      .filter(c => !c.parent_id)
      .map(cat => ({
        ...cat,
        children: categories.filter(c => c.parent_id === cat.id).map(child => ({ ...child, children: [] }))
      }))
    
    return NextResponse.json({ categories: tree })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, parent_id, tenant_slug } = body
    
    const tenantSlug = tenant_slug || 'demo'
    const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug])
    
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }
    
    const tenantId = tenantResult.rows[0].id
    
    const result = await db.query(
      `INSERT INTO categories (tenant_id, name, slug, description, parent_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tenantId, name, slug, description, parent_id]
    )
    
    return NextResponse.json({ category: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}