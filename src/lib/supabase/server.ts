import db from '@/lib/db'

// Wrapper that provides Supabase-like interface using PostgreSQL
export async function createSupabaseServerClient() {
  const client = {
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (field: string, value: any) => ({
          single: async () => {
            const cols = columns === '*' ? '*' : columns.split(',').map(c => c.trim())
            const query = cols === '*' 
              ? `SELECT * FROM ${table} WHERE ${field} = $1`
              : `SELECT ${cols} FROM ${table} WHERE ${field} = $1`
            const result = await db.query(query, [value])
            return { data: result.rows[0] || null, error: null }
          },
          then: (cb: any) => cb({ data: [], error: null })
        }),
        order: (field: string, opts: any = {}) => ({
          limit: (n: number) => ({
            then: async (cb: any) => {
              const result = await db.query(
                `SELECT * FROM ${table} ORDER BY ${field} ${opts.ascending ? 'ASC' : 'DESC'} LIMIT ${n}`
              )
              return cb({ data: result.rows, error: null })
            }
          }),
          then: async (cb: any) => {
            const result = await db.query(`SELECT * FROM ${table} ORDER BY ${field}`)
            return cb({ data: result.rows, error: null })
          }
        }),
        range: async (start: number, end: number) => {
          const result = await db.query(`SELECT * FROM ${table} OFFSET ${start} LIMIT ${end - start + 1}`)
          return { data: result.rows, error: null }
        }
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const keys = Object.keys(data)
            const values = Object.values(data)
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
            const cols = keys.join(', ')
            const result = await db.query(
              `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`,
              values
            )
            return { data: result.rows[0], error: null }
          }
        })
      }),
      update: (data: any) => ({
        eq: (field: string, value: any) => ({
          select: () => ({
            single: async () => {
              const keys = Object.keys(data)
              const values = Object.values(data)
              const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
              const result = await db.query(
                `UPDATE ${table} SET ${setClause} WHERE ${field} = $${keys.length + 1} RETURNING *`,
                [...values, value]
              )
              return { data: result.rows[0], error: null }
            }
          })
        })
      }),
      delete: () => ({
        eq: (field: string, value: any) => ({
          then: async (cb: any) => {
            await db.query(`DELETE FROM ${table} WHERE ${field} = $1`, [value])
            return cb({ error: null })
          }
        })
      })
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null })
    }
  }
  return client
}

export async function getCurrentTenant() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const tenantSlug = cookieStore.get('x-tenant-slug')?.value || 'demo';
  
  const result = await db.query('SELECT * FROM tenants WHERE slug = $1', [tenantSlug]);
  return result.rows[0] || null;
}

export async function setTenantCookie(tenantSlug: string) {}

export async function getUserTenantId() {
  return null
}

export function getTenantFromSubdomain(host: string): string {
  if (host.includes('localhost')) return 'demo'
  const parts = host.split('.')
  return parts.length >= 3 ? parts[0] : 'demo'
}