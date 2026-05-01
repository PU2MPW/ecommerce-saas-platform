export interface PixPaymentRequest {
  amount: number;
  pixKey: string;
  beneficiaryName: string;
  description: string;
  merchantId?: string;
}

export interface PixPaymentResponse {
  qrCode: string;
  qrCodeImage: string;
  paymentId: string;
  expiresAt: string;
  amount: number;
}

export function generatePixQRCode(data: PixPaymentRequest): PixPaymentResponse {
  const paymentId = `PIX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  const pixPayload = formatPixPayload({
    key: data.pixKey,
    amount: data.amount,
    beneficiary: data.beneficiaryName,
    description: data.description,
    merchantId: data.merchantId || 'ECOMMERCE-SAAS',
    transactionId: paymentId
  });
  
  return {
    qrCode: pixPayload,
    qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixPayload)}`,
    paymentId,
    expiresAt,
    amount: data.amount
  };
}

function formatPixPayload(params: {
  key: string;
  amount: number;
  beneficiary: string;
  description: string;
  merchantId: string;
  transactionId: string;
}): string {
  const formatField = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };
  
  const fields = [
    formatField('00', '01'),
    formatField('01', '11'),
    formatField('02', params.key),
    formatField('03', params.amount.toFixed(2)),
    formatField('04', params.amount.toFixed(2)),
    formatField('05', params.beneficiary),
    formatField('06', 'BR.GOV.BCB.PIX'),
    formatField('07', params.transactionId),
    formatField('08', params.merchantId),
    formatField('09', params.description.substring(0, 25)),
    formatField('99', 'BR.GOV.BCB.PIX')
  ];
  
  return fields.join('');
}

export function validatePixKey(key: string): { valid: boolean; type: string } {
  const cleaned = key.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return { valid: true, type: 'cpf' };
  }
  if (cleaned.length === 14) {
    return { valid: true, type: 'cnpj' };
  }
  if (key.includes('@')) {
    return { valid: true, type: 'email' };
  }
  if (cleaned.length >= 32) {
    return { valid: true, type: 'random' };
  }
  
  return { valid: false, type: 'unknown' };
}

export function formatPixAmount(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}