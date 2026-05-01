import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { email, tenantSlug } = await request.json();
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug || 'demo']);
  const tenantId = tenantResult.rows[0]?.id;
  
  const result = await db.query('SELECT id FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
  
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Email não encontrado' }, { status: 404 });
  }
  
  // In production, send email with reset link
  return NextResponse.json({ message: 'Link de recuperação enviado para o email' });
}