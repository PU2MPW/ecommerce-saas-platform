import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_BeIS7i6dUQcf@ep-cold-cake-acizzbtv.sa-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

export const db = {
  query: async (text: string, params?: any[]) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    return res;
  },
  getClient: async () => pool.connect()
};

export default db;