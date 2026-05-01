import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProductReviews } from '@/components/store/ProductReviews';
import { AddToCartButton } from '@/components/store/AddToCartButton';

interface ProductDetailProps {
  params: Promise<{ tenantSlug: string; slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(name, slug), images:product_images(*, position), variants:product_variants(*), reviews:reviews(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return {
    ...product,
    images: (product.images || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  };
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
    );
  }
  
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl">
                📦
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img: { id: string; url: string }, idx: number) => (
                <div key={img.id} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors">
                  <Image
                    src={img.url}
                    alt={`${product.name} - ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          {product.category && (
            <span className="text-sm text-gray-500">{product.category.name}</span>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-900">{product.name}</h1>
          
          {/* Rating */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${star <= Math.round(avgRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews.length} avaliação{product.reviews.length !== 1 ? 'ções' : ''})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl lg:text-4xl font-bold text-gray-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  R$ {product.compare_at_price.toFixed(2).replace('.', ',')}
                </span>
                <span className="bg-red-600 text-white text-sm font-medium px-2 py-0.5 rounded">
                  -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                </span>
              </>
            )}
          </div>
          
          {/* Variants and Add to Cart */}
          <div className="mt-8">
            <AddToCartButton product={product} tenantSlug={tenantSlug} />
          </div>
          
          {/* SKU */}
          {product.sku && (
            <p className="mt-4 text-sm text-gray-500">SKU: {product.sku}</p>
          )}
          
          {/* Description */}
          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {product.description.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Avaliações</h2>
        <div className="bg-white rounded-lg border p-6">
          <ProductReviews reviews={product.reviews || []} />
        </div>
      </div>
    </div>
  );
}