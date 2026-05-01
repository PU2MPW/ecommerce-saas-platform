'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
  onChange: (method: string, data?: any) => void;
  total: number;
  tenantPixKey?: string;
}

export function PaymentMethodSelector({ onChange, total, tenantPixKey }: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<string>('');
  
  const methods = [
    {
      id: 'pix',
      name: 'Pix',
      icon: '💰',
      description: 'Instantâneo - Aprovação em segundos',
      available: !!tenantPixKey
    },
    {
      id: 'card',
      name: 'Cartão de Crédito',
      icon: '💳',
      description: 'Parcele em até 12x',
      available: true
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: '📄',
      description: 'Vencimento em 3 dias úteis',
      available: true
    }
  ];

  const handleSelect = (methodId: string) => {
    setSelected(methodId);
    onChange(methodId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Forma de Pagamento</h3>
      
      <div className="space-y-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
              selected === method.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'hover:border-gray-400'
            } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => method.available && handleSelect(method.id)}
              disabled={!method.available}
              className="mt-1 w-4 h-4 text-blue-600"
            />
            
            <div className="text-2xl">{method.icon}</div>
            
            <div className="flex-1">
              <p className="font-medium text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
              
              {!method.available && (
                <p className="text-xs text-red-500 mt-1">Indisponível - Configure sua chave Pix</p>
              )}
            </div>
            
            <div className="text-sm font-medium text-gray-900">
              R$ {total.toFixed(2).replace('.', ',')}
            </div>
          </label>
        ))}
      </div>

      {/* Pix Details - shown when Pix is selected */}
      {selected === 'pix' && tenantPixKey && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Pagamento via Pix</strong><br />
            O QR Code será gerado após confirmar o pedido.<br />
            O pagamento expire em 24 horas.
          </p>
        </div>
      )}

      {/* Card Details */}
      {selected === 'card' && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Cartão de Crédito</strong><br />
            Você será redirecionado para inserir os dados do cartão.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white border rounded text-xs">Visa</span>
            <span className="px-2 py-1 bg-white border rounded text-xs">Mastercard</span>
            <span className="px-2 py-1 bg-white border rounded text-xs">ELO</span>
          </div>
        </div>
      )}

      {/* Boleto Details */}
      {selected === 'boleto' && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Boleto Bancário</strong><br />
            O boleto será gerado após confirmar o pedido.<br />
            Vencimento em 3 dias úteis. Após o pagamento, a aprovação pode levar até 2 dias úteis.
          </p>
        </div>
      )}
    </div>
  );
}