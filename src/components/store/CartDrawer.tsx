'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';

interface CartDrawerProps {
  tenantSlug: string;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: { 
  item: CartItem; 
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-3xl">📦</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        {item.variant && (
          <p className="text-sm text-gray-500">{item.variant}</p>
        )}
        <p className="text-sm font-medium text-gray-900 mt-1">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </p>
        
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:text-gray-900"
            >
              -
            </button>
            <span className="px-2 py-1 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:text-gray-900"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 text-sm hover:underline"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ tenantSlug }: CartDrawerProps) {
  const { state, toggleCart, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Carrinho ({totalItems})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">🛒</span>
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            state.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>
        
        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-bold text-gray-900">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <Link
              href={`/${tenantSlug}/carrinho`}
              onClick={toggleCart}
              className="block"
            >
              <Button className="w-full" size="lg">
                Ver Carrinho
              </Button>
            </Link>
            
            <Link
              href={`/${tenantSlug}/checkout`}
              onClick={toggleCart}
              className="block"
            >
              <Button variant="outline" className="w-full" size="lg">
                Finalizar Compra
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}