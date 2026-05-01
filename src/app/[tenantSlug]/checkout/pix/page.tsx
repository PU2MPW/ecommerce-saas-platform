'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PixPaymentPageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default function PixPaymentPage({ params, searchParams }: PixPaymentPageProps) {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadOrderData = async () => {
      const { tenantSlug } = await params;
      const { order } = await searchParams;
      
      const stored = localStorage.getItem('lastOrder');
      if (stored) {
        const data = JSON.parse(stored);
        setOrderData(data);
        
        // In production, would call API to create Pix payment
        // For demo, simulate QR code
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    loadOrderData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Gerando QR Code...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
        <Link href={`/`}>
          <Button>Voltar para a Página Inicial</Button>
        </Link>
      </div>
    );
  }

  const amount = orderData.total || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Pagar com Pix
        </h1>
        
        {/* QR Code */}
        <div className="bg-white border rounded-lg p-6 text-center mb-6">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 inline-block mb-4">
            <Image 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX0001br.gov.bcb.pix${amount}ECOMMERCE${Date.now()}`}
              alt="QR Code Pix"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          
          <p className="text-lg font-bold text-gray-900 mb-2">
            R$ {amount.toFixed(2).replace('.', ',')}
          </p>
          
          <p className="text-sm text-gray-500">
            Escaneie o QR Code com seu banco
          </p>
        </div>
        
        {/* Copy Code */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Ou copie o código:</p>
          <div className="flex gap-2">
            <input 
              type="text"
              value="PIX0001br.gov.bcb.pix"
              readOnly
              className="flex-1 px-3 py-2 border rounded text-sm font-mono"
            />
            <Button 
              variant="outline"
              onClick={() => copyToClipboard('PIX0001br.gov.bcb.pix')}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Como pagar:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha a opção Pix (QR Code ou Copia e Cola)</li>
            <li>3. Escaneie ou cole o código</li>
            <li>4. Confirme o pagamento</li>
          </ol>
        </div>
        
        {/* Expiry */}
        <p className="text-center text-sm text-gray-500 mb-6">
          O código expira em 24 horas
        </p>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href={`/checkout/sucesso?order=${orderData.id}`}>
            <Button className="w-full">
              Já paguei - Confirmar
            </Button>
          </Link>
          
          <Link href={`/checkout/cancelado`}>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}