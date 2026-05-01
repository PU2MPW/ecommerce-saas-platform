import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase.from('tenants').select('*').eq('slug', tenantSlug).single();
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  return NextResponse.json({ tenant });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { tenant_slug, name, email, cnpj, pix_key, pix_key_type, brand_color, logo_url } = body;
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenant_slug || 'demo').single();
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const { data: updated } = await supabase.from('tenants').update({ name, email, cnpj, pix_key, pix_key_type, brand_color, logo_url }).eq('id', tenant.id).select().single();
  return NextResponse.json({ tenant: updated });
}