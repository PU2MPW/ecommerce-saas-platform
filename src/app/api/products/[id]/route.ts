import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    
    // Try to fetch by slug first, then by id
    let query = supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*), variants:product_variants(*), reviews:reviews(*)')
      .eq('is_active', true)
    
    // Check if it's a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }
    
    const { data: product, error } = await query.single()
    
    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Calculate average rating
    const reviews = product.reviews || []
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviews.length
      : 0
    
    const response = {
      ...product,
      avg_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length
    }
    
    return NextResponse.json({ product: response })
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
    const supabase = await createSupabaseServerClient()
    
    const body = await request.json()
    const { 
      name, slug, description, price, compare_at_price, sku, 
      category_id, is_active, is_featured 
    } = body
    
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        slug,
        description,
        price,
        compare_at_price,
        sku,
        category_id,
        is_active,
        is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}