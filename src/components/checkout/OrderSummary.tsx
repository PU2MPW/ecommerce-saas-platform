'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

interface OrderSummaryProps {
  shippingCost?: number;
}

export function OrderSummary({ shippingCost = 0 }: OrderSummaryProps) {
  const { state, totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
      
      {/* Items */}
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
        {state.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              <p className="text-sm font-medium text-gray-900">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        ))}
        
        {state.items.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Carrinho vazio</p>
        )}
      </div>
      
      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({state.items.length} itens)</span>
          <span className="text-gray-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete</span>
          <span className="text-gray-900">
            {shippingCost > 0 
              ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` 
              : 'Calcular depois'}
          </span>
        </div>
        
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
}