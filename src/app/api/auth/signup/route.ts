import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { email, password, name, tenantSlug } = await request.json();
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug || 'demo']);
  const tenantId = tenantResult.rows[0]?.id;
  
  const existing = await db.query('SELECT id FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
  
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
  }
  
  const result = await db.query(
    'INSERT INTO users (tenant_id, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role',
    [tenantId, email, name, password, 'customer']
  );
  
  const user = result.rows[0];
  return NextResponse.json({ user, token: 'demo-token-' + user.id }, { status: 201 });
}