import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  
  const result = await db.query('SELECT * FROM tenants WHERE slug = $1', [tenantSlug]);
  if (result.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  return NextResponse.json({ tenant: result.rows[0] });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { tenant_slug, name, email, cnpj, pix_key, pix_key_type, brand_color, logo_url } = body;
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenant_slug || 'demo']);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const result = await db.query(
    'UPDATE tenants SET name = $1, email = $2, cnpj = $3, pix_key = $4, pix_key_type = $5, brand_color = $6, logo_url = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
    [name, email, cnpj, pix_key, pix_key_type, brand_color, logo_url, tenantResult.rows[0].id]
  );
  
  return NextResponse.json({ tenant: result.rows[0] });
}