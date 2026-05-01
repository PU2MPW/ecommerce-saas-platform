import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenantSlug).single();
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const { data: coupons } = await supabase.from('coupons').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
  return NextResponse.json({ coupons: coupons || [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tenant_slug, code, discount_type, discount_value, min_order_value, valid_until, usage_limit } = body;
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenant_slug || 'demo').single();
  
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }
  
  const { data: coupon, error } = await supabase.from('coupons').insert({
    tenant_id: tenant.id, code, discount_type, discount_value, min_order_value, valid_until, usage_limit, active: true, used_count: 0
  }).select().single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon }, { status: 201 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  
  const { data: coupon } = await supabase.from('coupons').update(body).eq('id', id).select().single();
  return NextResponse.json({ coupon });
}