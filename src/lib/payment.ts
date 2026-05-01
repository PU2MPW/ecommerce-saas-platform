export interface CardPaymentRequest {
  orderId: string;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  installments: number;
}

export interface CardPaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  message?: string;
}

export interface BoletoPaymentRequest {
  orderId: string;
  amount: number;
  payer: {
    name: string;
    document: string;
    email: string;
  };
}

export interface BoletoPaymentResponse {
  success: boolean;
  transactionId: string;
  barcode: string;
  pdfUrl: string;
  dueDate: string;
  instructions: string[];
}

export function processCardPayment(data: CardPaymentRequest): Promise<CardPaymentResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate payment processing
      const isValid = data.cardNumber.length >= 13 && data.cvv.length >= 3;
      
      if (isValid) {
        resolve({
          success: true,
          transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'approved',
          message: 'Pagamento aprovado'
        });
      } else {
        resolve({
          success: false,
          transactionId: '',
          status: 'failed',
          message: 'Dados do cartão inválidos'
        });
      }
    }, 1000);
  });
}

export function generateBoleto(data: BoletoPaymentRequest): Promise<BoletoPaymentResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionId = `BOLETO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      
      // Generate mock barcode
      const barcode = `${Math.random().toString().substr(2, 3)}${Math.random().toString().substr(2, 5)}${Math.random().toString().substr(2, 5)}${Math.random().toString().substr(2, 5)}${Math.random().toString().substr(2, 10)}`;
      
      resolve({
        success: true,
        transactionId,
        barcode,
        pdfUrl: `/api/payment/boleto/${transactionId}/pdf`,
        dueDate: dueDate.toISOString(),
        instructions: [
          'Imprima o boleto e pague em qualquer banco autorizado',
          'Ou utilize o código de barras para pagamento online',
          'O prazo para pagamento é de 3 dias úteis',
          'Após o pagamento, a confirmação pode levar até 2 dias úteis'
        ]
      });
    }, 800);
  });
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const matches = cleaned.match(/\d{1,4}/g);
  return (matches?.join(' ') || '').substr(0, 19);
}

export function formatCardExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
  }
  return cleaned;
}

export function getInstallmentAmount(total: number, installments: number): number {
  return total / installments;
}

export function calculateInstallments(total: number): Array<{ 
  count: number; 
  amount: number; 
  total: number;
  hasInterest: boolean;
}> {
  const installments = [];
  
  for (let i = 1; i <= 12; i++) {
    let amount = total / i;
    let hasInterest = i > 1;
    
    // Add small interest for installments > 6 (simulated)
    if (i > 6) {
      amount = amount * 1.0299; // ~3% total interest
      hasInterest = true;
    }
    
    installments.push({
      count: i,
      amount: Math.round(amount * 100) / 100,
      total: Math.round(amount * i * 100) / 100,
      hasInterest
    });
  }
  
  return installments;
}