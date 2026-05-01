import db from '@/lib/db'
import Link from 'next/link'

export default async function StorePage({
  params,
}: {
  params: { tenantSlug: string }
}) {
  // Fetch tenant info
  const tenantResult = await db.query(
    'SELECT name, logo_url, brand_color FROM tenants WHERE slug = $1',
    [params.tenantSlug]
  )
  const tenant = tenantResult.rows[0]
  
  // Fetch active products
  const productsResult = await db.query(
    'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT 12'
  )
  const products = productsResult.rows

  const tenantName = tenant?.name || 'Loja'
  const brandColor = tenant?.brand_color || '#2563eb'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Bem-vindo à {tenantName}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encontre os melhores produtos com preços imperdíveis. 
          Qualidade garantida e entrega rápida para todo o Brasil.
        </p>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Destaques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link 
              key={product.id}
              href={`/${params.tenantSlug}/produtos/${product.slug}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      R$ {Number(product.price).toFixed(2).replace('.', ',')}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-sm text-gray-400 line-through">
                        R$ {Number(product.compare_at_price).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Nenhum produto encontrado
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link 
          href={`/${params.tenantSlug}/produtos`}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ver Todos os Produtos
        </Link>
      </section>
    </div>
  )
}