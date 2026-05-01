import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  const supabase = await createSupabaseServerClient();
  
  const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenantSlug).single();
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const [{ count: products }, { data: orders }, { data: orderItems }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('active', true),
    supabase.from('orders').select('total').eq('tenant_id', tenant.id),
    supabase.from('order_items').select('unit_price,quantity')
  ]);
  
  const totalRevenue = orders?.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) || 0;
  
  return NextResponse.json({
    products: products || 0,
    orders: orders?.length || 0,
    revenue: totalRevenue
  });
}