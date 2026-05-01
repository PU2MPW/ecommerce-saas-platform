import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const tenantId = tenantResult.rows[0].id;
  
  const productsResult = await db.query('SELECT COUNT(*) FROM products WHERE tenant_id = $1 AND is_active = true', [tenantId]);
  const ordersResult = await db.query('SELECT COUNT(*), COALESCE(SUM(total), 0) as revenue FROM orders WHERE tenant_id = $1', [tenantId]);
  
  return NextResponse.json({
    products: parseInt(productsResult.rows[0].count),
    orders: parseInt(ordersResult.rows[0].count),
    revenue: parseFloat(ordersResult.rows[0].revenue)
  });
}