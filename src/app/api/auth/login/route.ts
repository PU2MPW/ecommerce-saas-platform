import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { email, password, tenantSlug } = await request.json();
  
  const tenantResult = await db.query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug || 'demo']);
  const tenantId = tenantResult.rows[0]?.id;
  
  const result = await db.query('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
  
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
  }
  
  const user = result.rows[0];
  // In production, verify password with bcrypt
  if (user.password_hash !== password) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token: 'demo-token-' + user.id
  });
}