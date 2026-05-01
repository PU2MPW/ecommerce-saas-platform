import { NextResponse } from 'next/server';
import { generateBoleto } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const { orderId, amount, payer } = await request.json();
    
    if (!payer?.name || !payer?.document) {
      return NextResponse.json(
        { error: 'Dados do pagador incompletos' },
        { status: 400 }
      );
    }
    
    // In production, would call Mercado Pago API here
    const result = await generateBoleto({
      orderId,
      amount,
      payer
    });
    
    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      barcode: result.barcode,
      pdfUrl: result.pdfUrl,
      dueDate: result.dueDate,
      instructions: result.instructions
    });
    
  } catch (error) {
    console.error('Boleto generation error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar boleto' },
      { status: 500 }
    );
  }
}