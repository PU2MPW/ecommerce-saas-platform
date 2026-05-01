import Image from 'next/image';
import db from '@/lib/db';
import { AddToCartButton } from '@/components/store/AddToCartButton';

interface ProductDetailProps {
  params: Promise<{ tenantSlug: string; slug: string }>;
}

async function getProduct(slug: string) {
  const result = await db.query(
    'SELECT * FROM products WHERE slug = $1 AND is_active = true',
    [slug]
  )
  return result.rows[0] || null
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { tenantSlug, slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
        <p className="text-gray-600 mt-2">O produto que você procura não existe ou foi removido.</p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              📦
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              R$ {Number(product.price).toFixed(2).replace('.', ',')}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-gray-400 line-through">
                R$ {Number(product.compare_at_price).toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          
          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
          
          <AddToCartButton product={product} tenantSlug={tenantSlug} />
        </div>
      </div>
    </div>
  )
}