import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const result = await db.query('SELECT * FROM coupons WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantResult.rows[0].id]);
  return NextResponse.json({ coupons: result.rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tenant_slug, code, discount_type, discount_value, min_order_value, valid_until, usage_limit } = body;
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenant_slug || 'demo']);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const result = await db.query(
    'INSERT INTO coupons (tenant_id, code, discount_type, discount_value, min_order_value, valid_until, usage_limit, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
    [tenantResult.rows[0].id, code, discount_type, discount_value, min_order_value, valid_until, usage_limit]
  );
  
  return NextResponse.json({ coupon: result.rows[0] }, { status: 201 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  
  const result = await db.query('UPDATE coupons SET is_active = $1 WHERE id = $2 RETURNING *', [body.active, id]);
  return NextResponse.json({ coupon: result.rows[0] });
}