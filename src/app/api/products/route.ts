import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')
    const search = searchParams.get('search')
    const category_id = searchParams.get('category_id')
    const is_featured = searchParams.get('is_featured')
    
    let whereClause = "WHERE is_active = true"
    const params: any[] = []
    let paramCount = 0
    
    if (search) {
      paramCount++
      whereClause += ` AND name ILIKE $${paramCount}`
      params.push(`%${search}%`)
    }
    
    if (category_id) {
      paramCount++
      whereClause += ` AND category_id = $${paramCount}`
      params.push(category_id)
    }
    
    if (is_featured === 'true') {
      whereClause += ` AND is_featured = true`
    }
    
    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].count)
    
    // Get products
    paramCount++
    const offset = (page - 1) * pageSize
    const productsResult = await db.query(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount} OFFSET ${offset}`,
      params
    )
    
    return NextResponse.json({
      products: productsResult.rows,
      total,
      page,
      pageSize,
      hasMore: (page * pageSize) < total
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, slug, description, price, compare_at_price, sku, 
      category_id, is_active, is_featured, images, variants, tenant_slug 
    } = body
    
    // Get tenant ID
    const tenantSlug = tenant_slug || 'demo'
    const tenantResult = await db.query(
      'SELECT id FROM tenants WHERE slug = $1',
      [tenantSlug]
    )
    
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }
    
    const tenantId = tenantResult.rows[0].id
    
    // Create product
    const productResult = await db.query(
      `INSERT INTO products (tenant_id, name, slug, description, price, compare_at_price, sku, category_id, is_active, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [tenantId, name, slug, description, price, compare_at_price, sku, category_id, is_active ?? true, is_featured ?? false]
    )
    
    const product = productResult.rows[0]
    
    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Produto com este slug já existe' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}