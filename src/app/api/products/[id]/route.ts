import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    let query = 'SELECT * FROM products WHERE is_active = true AND '
    if (isUUID) {
      query += 'id = $1'
    } else {
      query += 'slug = $1'
    }
    
    const result = await db.query(query, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ product: result.rows[0] })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, price, compare_at_price, sku, category_id, is_active, is_featured } = body
    
    const result = await db.query(
      `UPDATE products SET name=$1, slug=$2, description=$3, price=$4, compare_at_price=$5, sku=$6, category_id=$7, is_active=$8, is_featured=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, slug, description, price, compare_at_price, sku, category_id, is_active, is_featured, id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ product: result.rows[0] })
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.query('DELETE FROM products WHERE id = $1', [id])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}