'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';

interface CartPageContentProps {
  tenantSlug: string;
}

export function CartPageContent({ tenantSlug }: CartPageContentProps) {
  const { state, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="text-8xl block mb-6">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-8">Parece que você ainda não adicionou nenhum produto.</p>
        <Link href={`/${tenantSlug}/produtos`}>
          <Button size="lg">Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
        <button
          onClick={clearCart}
          className="text-red-600 text-sm hover:underline"
        >
          Limpar carrinho
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border divide-y">
            {state.items.map((item) => (
              <div key={item.id} className="flex gap-6 p-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">📦</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link 
                        href={`/${tenantSlug}/produtos/${item.productId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                    
                    <span className="text-lg font-bold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} itens)</span>
                <span className="text-gray-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span className="text-gray-400">Calcular no checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <Link href={`/${tenantSlug}/checkout`} className="block mt-6">
              <Button className="w-full" size="lg">
                Finalizar Compra
              </Button>
            </Link>
            
            <Link href={`/${tenantSlug}/produtos`} className="block mt-3">
              <Button variant="ghost" className="w-full">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}