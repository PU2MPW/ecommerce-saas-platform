import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generatePixQRCode } from '@/lib/pix';

export async function POST(request: Request) {
  try {
    const { orderId, amount, tenantSlug } = await request.json();
    
    const supabase = await createSupabaseServerClient();
    
    // Get tenant Pix configuration
    const { data: tenant } = await supabase
      .from('tenants')
      .select('pix_key, pix_key_type, name')
      .eq('slug', tenantSlug || 'demo')
      .single();
    
    if (!tenant?.pix_key) {
      return NextResponse.json(
        { error: 'Chave Pix não configurada para esta loja' },
        { status: 400 }
      );
    }
    
    // Generate Pix QR Code
    const pixPayment = generatePixQRCode({
      amount,
      pixKey: tenant.pix_key,
      beneficiaryName: tenant.name,
      description: `Pedido ${orderId}`,
      merchantId: 'ECOMMERCE-SAAS'
    });
    
    // In production, would store payment in database
    // For demo, return the generated QR code
    
    return NextResponse.json({
      success: true,
      paymentId: pixPayment.paymentId,
      qrCode: pixPayment.qrCode,
      qrCodeImage: pixPayment.qrCodeImage,
      expiresAt: pixPayment.expiresAt,
      amount: pixPayment.amount,
      instructions: [
        '1. Abra o app do seu banco',
        '2. Escolha a opção Pix (QR Code)',
        '3. Escaneie o código ao lado',
        '4. Confirme o pagamento'
      ]
    });
    
  } catch (error) {
    console.error('Pix payment error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento Pix' },
      { status: 500 }
    );
  }
}