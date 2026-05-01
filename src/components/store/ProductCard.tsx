'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number | null;
    images?: { url: string; alt_text?: string | null }[] | null;
    avg_rating?: number;
    review_count?: number;
  };
  tenantSlug: string;
}

export function ProductCard({ product, tenantSlug }: ProductCardProps) {
  const mainImage = product.images?.[0]?.url || null;
  const discount = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  return (
    <Link href={`/${tenantSlug}/produtos/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
        <div className="relative aspect-square bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">
              📦
            </div>
          )}
          {discount && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                R$ {product.compare_at_price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          {product.avg_rating && product.avg_rating > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600">
                {product.avg_rating.toFixed(1)} ({product.review_count})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}