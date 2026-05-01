import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Verify webhook signature (in production)
    // const signature = request.headers.get('x-signature');
    
    const { type, data } = payload;
    
    if (type === 'payment.created' || type === 'payment.updated') {
      const { id, status, order_id } = data;
      
      const supabase = await createSupabaseServerClient();
      
      // Map payment status
      let orderStatus = 'pending';
      let paymentStatus = 'pending';
      
      switch (status) {
        case 'approved':
        case 'accredited':
          orderStatus = 'confirmed';
          paymentStatus = 'paid';
          break;
        case 'pending':
        case 'in_process':
          orderStatus = 'pending';
          paymentStatus = 'pending';
          break;
        case 'rejected':
        case 'cancelled':
          orderStatus = 'cancelled';
          paymentStatus = 'failed';
          break;
        case 'refunded':
        case 'charged_back':
          orderStatus = 'refunded';
          paymentStatus = 'refunded';
          break;
      }
      
      // Update order in database
      if (order_id) {
        await supabase
          .from('orders')
          .update({ 
            status: orderStatus,
            payment_status: paymentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', order_id);
      }
      
      return NextResponse.json({ received: true });
    }
    
    return NextResponse.json({ received: true, type: type || 'unknown' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}