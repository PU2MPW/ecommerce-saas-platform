import { NextResponse } from 'next/server';
import { processCardPayment } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const {
      orderId,
      amount,
      cardNumber,
      cardHolder,
      expirationMonth,
      expirationYear,
      cvv,
      installments
    } = await request.json();
    
    if (!cardNumber || !cardHolder || !expirationMonth || !expirationYear || !cvv) {
      return NextResponse.json(
        { error: 'Dados do cartão incompletos' },
        { status: 400 }
      );
    }
    
    // In production, would call Mercado Pago API here
    const result = await processCardPayment({
      orderId,
      amount,
      cardNumber,
      cardHolder,
      expirationMonth,
      expirationYear,
      cvv,
      installments
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        status: result.status,
        message: result.message
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || 'Pagamento recusado'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Card payment error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}