import db from '@/lib/db';
import Link from 'next/link';

interface ProductsPageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ page?: string; search?: string; category_id?: string }>;
}

async function getProducts(search: string | undefined, categoryId: string | undefined, page: number) {
  const pageSize = 12
  let whereClause = "WHERE is_active = true"
  const params: any[] = []
  let paramCount = 0
  
  if (search) {
    paramCount++
    whereClause += ` AND name ILIKE $${paramCount}`
    params.push(`%${search}%`)
  }
  
  if (categoryId) {
    paramCount++
    whereClause += ` AND category_id = $${paramCount}`
    params.push(categoryId)
  }
  
  const countResult = await db.query(`SELECT COUNT(*) FROM products ${whereClause}`, params)
  const total = parseInt(countResult.rows[0].count)
  
  paramCount++
  const offset = (page - 1) * pageSize
  const result = await db.query(
    `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount} OFFSET ${offset}`,
    params
  )
  
  return { products: result.rows, total }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { tenantSlug } = await params
  const { page, search, category_id } = await searchParams
  
  const currentPage = parseInt(page || '1')
  const { products, total } = await getProducts(search, category_id, currentPage)
  const totalPages = Math.ceil(total / 12)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>
      
      {/* Search */}
      <form className="mb-6">
        <input 
          type="text" 
          name="search" 
          defaultValue={search}
          placeholder="Buscar produtos..." 
          className="w-full px-4 py-2 border rounded-lg"
        />
      </form>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <Link 
            key={product.id}
            href={`/${tenantSlug}/produtos/${product.slug}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">Nenhum produto encontrado</p>
      )}
    </div>
  )
}