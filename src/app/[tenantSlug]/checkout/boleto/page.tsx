'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BoletoPaymentPage({ 
  params 
}: { 
  params: Promise<{ tenantSlug: string }>;
}) {
  const [orderData, setOrderData] = useState<any>(null);
  const [boleto, setBoleto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const generateBoleto = async () => {
      const stored = localStorage.getItem('lastOrder');
      if (stored) {
        const data = JSON.parse(stored);
        setOrderData(data);
        
        // Call API to generate boleto
        try {
          const response = await fetch('/api/payment/boleto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.id,
              amount: data.total,
              payer: {
                name: data.address?.name || 'Cliente',
                document: data.address?.cpf || '',
                email: ''
              }
            })
          });
          
          const result = await response.json();
          if (result.success) {
            setBoleto(result);
          }
        } catch (err) {
          console.error('Error generating boleto:', err);
        }
      }
      setLoading(false);
    };
    
    generateBoleto();
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Gerando boleto...</p>
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

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Boleto Bancário
        </h1>
        
        {/* Amount */}
        <div className="bg-white border rounded-lg p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
          <p className="text-3xl font-bold text-gray-900">
            R$ {orderData.total?.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Vencimento: {dueDate.toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        {/* Barcode */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Código de Barras</p>
          <div className="flex gap-2 items-center">
            <input 
              type="text"
              value={boleto?.barcode || '000000000000000000000000000000000000000000000'}
              readOnly
              className="flex-1 px-3 py-2 border rounded text-sm font-mono"
            />
            <button
              onClick={() => copyToClipboard(boleto?.barcode || '', 'barcode')}
              className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
            >
              {copied === 'barcode' ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Como pagar:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Imprima ou copie o código de barras acima</li>
            <li>2. Vá até um banco, lotérica ou use o internet banking</li>
            <li>3. Cole o código ou escane o código de barras</li>
            <li>4. Confirme o pagamento</li>
          </ol>
        </div>
        
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> O boleto vence em 3 dias úteis. 
            Após o pagamento, a confirmação pode levar até 2 dias úteis.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href={`/checkout/sucesso?order=${orderData.id}`}>
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Já paguei - Confirmar
            </button>
          </Link>
          
          <Link href={`/checkout/cancelado`}>
            <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}