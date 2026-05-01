export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  carrier: string;
}

export interface ShippingCalculationParams {
  cep: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export async function calculateShipping(params: ShippingCalculationParams): Promise<ShippingOption[]> {
  // In production, this would call a real shipping API (Correios, Melhor Envio, etc.)
  // For demo purposes, we return simulated shipping options
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Demo shipping options
  const options: ShippingOption[] = [
    {
      id: 'pac',
      name: 'PAC',
      price: 15.90 + (Math.random() * 10),
      days: '5-7 dias úteis',
      carrier: 'Correios'
    },
    {
      id: 'sedex',
      name: 'SEDEX',
      price: 25.90 + (Math.random() * 15),
      days: '1-2 dias úteis',
      carrier: 'Correios'
    },
    {
      id: 'normal',
      name: 'Entrega Normal',
      price: 9.90 + (Math.random() * 5),
      days: '7-12 dias úteis',
      carrier: 'Transportadora'
    }
  ];
  
  // Return options sorted by price
  return options.sort((a, b) => a.price - b.price);
}

export function validateCEP(cep: string): boolean {
  // Simple CEP validation (XXXXX-XXX)
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
}