'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

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

interface AddressFormProps {
  onChange: (data: AddressFormData) => void;
}

export function AddressForm({ onChange }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    cpf: '',
    phone: '',
    zipcode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const handleChange = (field: keyof AddressFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
      
      <Input
        label="Nome Completo"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Seu nome completo"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="CPF"
          value={formData.cpf}
          onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        
        <Input
          label="Telefone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="CEP"
          value={formData.zipcode}
          onChange={(e) => handleChange('zipcode', formatCEP(e.target.value))}
          placeholder="00000-000"
          maxLength={9}
        />
        
        <div className="md:col-span-2">
          <Input
            label="Rua/Avenida"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Nome da rua"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Número"
          value={formData.number}
          onChange={(e) => handleChange('number', e.target.value)}
          placeholder="123"
          required
        />
        
        <Input
          label="Complemento"
          value={formData.complement}
          onChange={(e) => handleChange('complement', e.target.value)}
          placeholder="Apto, sala, etc"
        />
        
        <Input
          label="Bairro"
          value={formData.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
          placeholder="Bairro"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Cidade"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Cidade"
          required
        />
        
        <Input
          label="Estado"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          placeholder="SP"
          maxLength={2}
          required
        />
      </div>
    </div>
  );
}