'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  inventory: number;
}

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    variants?: ProductVariant[] | null;
  };
  tenantSlug: string;
}

export function AddToCartButton({ product, tenantSlug }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get available sizes/colors
  const sizes = hasVariants 
    ? [...new Set(product.variants?.map(v => v.size).filter(Boolean))] as string[]
    : [];
  const colors = hasVariants
    ? [...new Set(product.variants?.map(v => v.color).filter(Boolean))] as string[]
    : [];

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // In a real app, this would add to the cart via API
      // For now, we'll just redirect to cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        variant: selectedVariant
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      
      router.push(`/${tenantSlug}/carrinho`);
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {hasVariants && sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size: string) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedVariant(size)}
                className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                  selectedVariant === size
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {hasVariants && colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedVariant(color)}
                className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                  selectedVariant === color
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            -
          </button>
          <span className="px-3 py-2 font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-gray-600 hover:text-gray-900"
          >
            +
          </button>
        </div>
        
        <Button 
          onClick={handleAddToCart} 
          isLoading={loading}
          className="flex-1"
          size="lg"
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}