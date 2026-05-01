import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'demo';
    const productId = searchParams.get('id');
    
    const supabase = await createSupabaseServerClient();
    
    // Get tenant ID
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    
    if (productId) {
      // Get single product
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('tenant_id', tenant.id)
        .single();
      
      return NextResponse.json({ product });
    }
    
    // Get all products for tenant
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false });
    
    return NextResponse.json({ products: products || [] });
    
  } catch (error) {
    console.error('Admin products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenant_slug, name, description, price, compare_price, stock, sku, category_id, image_url, active } = body;
    
    if (!name || !price) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
    }
    
    const supabase = await createSupabaseServerClient();
    
    // Get tenant ID
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenant_slug || 'demo')
      .single();
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    
    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenant.id,
        name,
        description,
        price,
        compare_price,
        stock,
        sku,
        category_id,
        image_url,
        active: active ?? true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Product insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ product }, { status: 201 });
    
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    
    const { data: product, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ product });
    
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const supabase = await createSupabaseServerClient();
    
    // Soft delete - set active to false
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', productId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}