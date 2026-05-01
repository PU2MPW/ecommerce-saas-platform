import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  const client = await pool.connect();
  
  try {
    // Create tenant
    await client.query(`
      INSERT INTO tenants (slug, name, email, brand_color)
      VALUES ('demo', 'Loja Demo', 'admin@demo.com', '#2563eb')
      ON CONFLICT (slug) DO NOTHING
    `);
    
    const tenantResult = await client.query("SELECT id FROM tenants WHERE slug = 'demo'");
    const tenantId = tenantResult.rows[0].id;
    
    // Create category
    await client.query(`
      INSERT INTO categories (tenant_id, name, slug, description)
      VALUES ($1, 'Roupas', 'roupas', 'Roupas em geral')
    `, [tenantId]);
    
    const catResult = await client.query("SELECT id FROM categories WHERE slug = 'roupas'");
    const categoryId = catResult.rows[0].id;
    
    // Create products
    const products = [
      { name: 'Camiseta Básica', slug: 'camiseta-basica', description: 'Camiseta 100% algodão, confortável e versátil.', price: 49.90, compare: 79.90, sku: 'CAM-001', stock: 100, featured: true },
      { name: 'Calça Jeans', slug: 'calca-jeans', description: 'Calça jeans tradicional, caimento perfeito.', price: 129.90, compare: 189.90, sku: 'CAL-001', stock: 50, featured: false },
      { name: 'Jaqueta de Couro', slug: 'jaqueta-couro', description: 'Jaqueta de couro sintético, estilo e durabilidade.', price: 299.90, compare: null, sku: 'JAQ-001', stock: 20, featured: true },
    ];
    
    for (const p of products) {
      await client.query(`
        INSERT INTO products (tenant_id, category_id, name, slug, description, price, compare_at_price, sku, stock, is_active, is_featured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
      `, [tenantId, categoryId, p.name, p.slug, p.description, p.price, p.compare, p.sku, p.stock, p.featured]);
    }
    
    console.log('Seed completo!');
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();