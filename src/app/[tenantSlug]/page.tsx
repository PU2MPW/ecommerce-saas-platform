import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function StorePage({
  params,
}: {
  params: { tenantSlug: string }
}) {
  const supabase = await createSupabaseServerClient()
  
  // Fetch tenant info
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, logo_url, brand_color')
    .eq('slug', params.tenantSlug)
    .single()
  
  // Fetch active products for this tenant
  // Note: In production, would filter by tenant_id
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)
  
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
      
      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href={`/${params.tenantSlug}/category/roupas`}
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">👕</div>
            <span className="font-medium">Roupas</span>
          </Link>
          <Link 
            href={`/${params.tenantSlug}/category/eletronicos`}
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">📱</div>
            <span className="font-medium">Eletrônicos</span>
          </Link>
          <Link 
            href={`/${params.tenantSlug}/category/acessorios`}
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">⌚</div>
            <span className="font-medium">Acessórios</span>
          </Link>
          <Link 
            href={`/${params.tenantSlug}/category/informatica`}
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-2">💻</div>
            <span className="font-medium">Informática</span>
          </Link>
        </div>
      </section>
      
      {/* Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Produtos em Destaque</h2>
          <Link 
            href={`/${params.tenantSlug}/products`}
            className="text-sm font-medium hover:underline"
            style={{ color: brandColor }}
          >
            Ver todos →
          </Link>
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                key={product.id}
                href={`/${params.tenantSlug}/product/${product.id}`}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold" style={{ color: brandColor }}>
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        R$ {product.compare_at_price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  {product.stock > 0 ? (
                    <span className="text-xs text-green-600 mt-1 block">✓ Em estoque</span>
                  ) : (
                    <span className="text-xs text-red-600 mt-1 block">✗ Indisponível</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <span className="text-6xl mb-4 block">🛒</span>
            <p className="text-gray-500 mb-4">Nenhum produto disponível ainda.</p>
            <p className="text-sm text-gray-400">Volte em breve para ver nossos produtos!</p>
          </div>
        )}
      </section>
      
      {/* Trust Badges */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="font-semibold mb-1">Entrega Rápida</h3>
          <p className="text-sm text-gray-500">Para todo o Brasil</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-semibold mb-1">Pagamento Seguro</h3>
          <p className="text-sm text-gray-500">Pix, cartão ou boleto</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="font-semibold mb-1">Compra Garantida</h3>
          <p className="text-sm text-gray-500">7 dias para troca</p>
        </div>
      </section>
    </div>
  )
}