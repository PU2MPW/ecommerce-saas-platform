'use client';

import { useState, useEffect } from 'react';
import { CardPaymentForm } from '@/components/checkout/CardPaymentForm';
import Link from 'next/link';

export default function CardPaymentPage({ 
  params 
}: { 
  params: Promise<{ tenantSlug: string }>;
}) {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (cardData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData?.id,
          amount: orderData?.total,
          ...cardData
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to success
        window.location.href = `/checkout/sucesso?order=${orderData?.id}&payment=${result.transactionId}`;
      } else {
        setError(result.error || 'Pagamento recusado');
      }
    } catch (err) {
      setError('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
        <Link href="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Voltar para Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Pagamento com Cartão
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white border rounded-lg p-6">
          <CardPaymentForm 
            total={orderData.total}
            onSubmit={handleSubmit}
            onCancel={() => window.location.href = '/checkout'}
          />
        </div>
      </div>
    </div>
  );
}