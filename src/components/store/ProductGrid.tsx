'use client';

import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  images?: { url: string; alt_text?: string | null }[] | null;
  avg_rating?: number;
  review_count?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  tenantSlug: string;
}

export function ProductGrid({ products, loading, tenantSlug }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg" />
            <div className="h-4 bg-gray-200 mt-4 rounded w-3/4" />
            <div className="h-4 bg-gray-200 mt-2 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <span className="text-6xl mb-4 block">🛒</span>
        <p className="text-gray-500">Nenhum produto encontrado.</p>
        <p className="text-sm text-gray-400 mt-2">Tente ajustar seus filtros ou busca.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} tenantSlug={tenantSlug} />
      ))}
    </div>
  );
}