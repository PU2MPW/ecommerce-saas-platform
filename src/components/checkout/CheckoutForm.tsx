'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm } from './AddressForm';
import { OrderSummary } from './OrderSummary';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

interface AddressFormData {
  name: string;
  cpf: string;
  phone: string;
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CheckoutFormProps {
  tenantSlug: string;
  tenantPixKey?: string;
}

export function CheckoutForm({ tenantSlug, tenantPixKey }: CheckoutFormProps) {
  const router = useRouter();
  const { state, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  const shippingOptions = [
    { id: 'pac', name: 'PAC', price: 15.90, days: '5-7 dias úteis' },
    { id: 'sedex', name: 'SEDEX', price: 25.90, days: '1-2 dias úteis' },
    { id: 'normal', name: 'Entrega Normal', price: 9.90, days: '7-12 dias úteis' },
  ];
  
  const selectedShipping = shippingOptions.find(o => o.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const total = totalPrice + shippingCost;

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Por favor, preencha o endereço de entrega.');
      return;
    }
    
    if (!shippingMethod) {
      alert('Por favor, selecione o método de entrega.');
      return;
    }
    
    if (!paymentMethod) {
      alert('Por favor, selecione o método de pagamento.');
      return;
    }
    
    if (state.items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }
    
    setLoading(true);
    
    try {
      const orderId = `ORD-${Date.now()}`;
      
      // Store order info in localStorage for the success page
      localStorage.setItem('lastOrder', JSON.stringify({
        id: orderId,
        items: state.items,
        address,
        shipping: selectedShipping,
        paymentMethod,
        total,
        createdAt: new Date().toISOString()
      }));
      
      // Clear cart
      clearCart();
      
      // Redirect based on payment method
      if (paymentMethod === 'pix') {
        router.push(`/${tenantSlug}/checkout/pix?order=${orderId}`);
      } else if (paymentMethod === 'boleto') {
        router.push(`/${tenantSlug}/checkout/boleto?order=${orderId}`);
      } else {
        router.push(`/${tenantSlug}/checkout/sucesso?order=${orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Address Section */}
      <section>
        <AddressForm onChange={setAddress} />
      </section>
      
      {/* Shipping Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forma de Entrega</h3>
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                shippingMethod === option.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={shippingMethod === option.id}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-500">{option.days}</p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                R$ {option.price.toFixed(2).replace('.', ',')}
              </span>
            </label>
          ))}
        </div>
      </section>
      
      {/* Payment Section */}
      <section>
        <PaymentMethodSelector 
          onChange={handlePaymentChange}
          total={total}
          tenantPixKey={tenantPixKey}
        />
      </section>
      
      {/* Order Summary */}
      <section>
        <OrderSummary shippingCost={shippingCost} />
      </section>
      
      {/* Submit */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        isLoading={loading}
        disabled={state.items.length === 0}
      >
        Finalizar Pedido - R$ {total.toFixed(2).replace('.', ',')}
      </Button>
    </form>
  );
}