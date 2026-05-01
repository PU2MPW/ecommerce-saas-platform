import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const result = await db.query('SELECT * FROM orders WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantResult.rows[0].id]);
  return NextResponse.json({ orders: result.rows });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');
  const body = await request.json();
  
  const result = await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [body.status, orderId]);
  return NextResponse.json({ order: result.rows[0] });
}