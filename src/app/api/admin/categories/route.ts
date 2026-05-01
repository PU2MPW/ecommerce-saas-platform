import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || 'demo';
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const result = await db.query('SELECT * FROM categories WHERE tenant_id = $1 ORDER BY name', [tenantResult.rows[0].id]);
  return NextResponse.json({ categories: result.rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tenant_slug, name, description } = body;
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenant_slug || 'demo']);
  if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const result = await db.query(
    'INSERT INTO categories (tenant_id, name, slug, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [tenantResult.rows[0].id, name, slug, description]
  );
  
  return NextResponse.json({ category: result.rows[0] }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, description } = body;
  const result = await db.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
  return NextResponse.json({ category: result.rows[0] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await db.query('DELETE FROM categories WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}