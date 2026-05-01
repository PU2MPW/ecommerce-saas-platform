'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { calculateInstallments, formatCardNumber, formatCardExpiry } from '@/lib/payment';

interface CardPaymentFormProps {
  total: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CardPaymentForm({ total, onSubmit, onCancel }: CardPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  
  const installmentsOptions = calculateInstallments(total);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardHolder,
      expirationMonth: expiry.split('/')[0],
      expirationYear: '20' + expiry.split('/')[1],
      cvv,
      installments
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Dados do Cartão</h3>
      
      <Input
        label="Número do Cartão"
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        required
      />
      
      <Input
        label="Nome do Titular"
        value={cardHolder}
        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
        placeholder="NOME COMPLETO"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Validade (MM/AA)"
          value={expiry}
          onChange={(e) => setExpiry(formatCardExpiry(e.target.value))}
          placeholder="12/25"
          maxLength={5}
          required
        />
        
        <Input
          label="CVV"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
          placeholder="123"
          maxLength={4}
          required
        />
      </div>
      
      {/* Installments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parcelas
        </label>
        <select
          value={installments}
          onChange={(e) => setInstallments(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {installmentsOptions.map((opt) => (
            <option key={opt.count} value={opt.count}>
              {opt.count}x de R$ {opt.amount.toFixed(2).replace('.', ',')} 
              {opt.hasInterest ? ' com juros' : ' sem juros'}
            </option>
          ))}
        </select>
      </div>
      
      {/* Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total:</span>
          <span className="text-xl font-bold text-gray-900">
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {installments}x de R$ {installmentsOptions[installments - 1].amount.toFixed(2).replace('.', ',')}
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>
      </div>
    </form>
  );
}