import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'demo';
    const productId = searchParams.get('id');
    
    const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    const tenantId = tenantResult.rows[0].id;
    
    if (productId) {
      const productResult = await db.query('SELECT * FROM products WHERE id = $1 AND tenant_id = $2', [productId, tenantId]);
      return NextResponse.json({ product: productResult.rows[0] });
    }
    
    const productsResult = await db.query('SELECT * FROM products WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
    return NextResponse.json({ products: productsResult.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenant_slug, name, description, price, compare_price, stock, sku, category_id, image_url, active } = body;
    
    const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenant_slug || 'demo']);
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    
    const result = await db.query(
      `INSERT INTO products (tenant_id, name, description, price, compare_at_price, stock, sku, category_id, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [tenantResult.rows[0].id, name, description, price, compare_price, stock, sku, category_id, image_url, active ?? true]
    );
    
    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const body = await request.json();
    
    const keys = Object.keys(body);
    const values = Object.values(body);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    
    const result = await db.query(`UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`, [...values, productId]);
    return NextResponse.json({ product: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    await db.query('UPDATE products SET is_active = false WHERE id = $1', [productId]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}