import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')
    const search = searchParams.get('search')
    const category_id = searchParams.get('category_id')
    const is_featured = searchParams.get('is_featured')
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
    
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    
    if (category_id) {
      query = query.eq('category_id', category_id)
    }
    
    if (is_featured === 'true') {
      query = query.eq('is_featured', true)
    }
    
    const { data, count, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        pageSize,
        hasMore: false
      })
    }
    
    const productIds = data.map(p => p.id)
    
    const [imagesRes, variantsRes, reviewsRes] = await Promise.all([
      supabase.from('product_images').select('*').in('product_id', productIds).order('position'),
      supabase.from('product_variants').select('*').in('product_id', productIds).eq('is_active', true),
      supabase.from('reviews').select('id, product_id, rating').in('product_id', productIds)
    ])
    
    const products = data.map(product => {
      const productImages = imagesRes.data?.filter(img => img.product_id === product.id) || []
      const productVariants = variantsRes.data?.filter(v => v.product_id === product.id) || []
      const productReviews = reviewsRes.data?.filter(r => r.product_id === product.id) || []
      
      const avgRating = productReviews.length > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length
        : 0
      
      return {
        ...product,
        images: productImages,
        variants: productVariants,
        avg_rating: Math.round(avgRating * 10) / 10,
        review_count: productReviews.length
      }
    })
    
    return NextResponse.json({
      products,
      total: count || 0,
      page,
      pageSize,
      hasMore: (page * pageSize) < (count || 0)
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const body = await request.json()
    const { 
      name, slug, description, price, compare_at_price, sku, 
      category_id, is_active, is_featured, images, variants 
    } = body
    
    // Get tenant from cookie
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
    
    // Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name,
        slug,
        description,
        price,
        compare_at_price,
        sku,
        category_id,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Add images if provided
    if (images && images.length > 0) {
      const imagesToInsert = images.map((url: string, index: number) => ({
        product_id: product.id,
        url,
        position: index
      }))
      
      await supabase.from('product_images').insert(imagesToInsert)
    }
    
    // Add variants if provided
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((v: { size?: string; color?: string; price?: number; inventory?: number; sku?: string }) => ({
        product_id: product.id,
        size: v.size,
        color: v.color,
        price: v.price,
        inventory: v.inventory ?? 0,
        sku: v.sku
      }))
      
      await supabase.from('product_variants').insert(variantsToInsert)
    }
    
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}