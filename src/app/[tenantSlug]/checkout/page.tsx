import { CartProvider } from '@/hooks/useCart';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import db from '@/lib/db';

interface CheckoutPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { tenantSlug } = await params;
  
  // Fetch tenant Pix configuration
  const result = await db.query(
    'SELECT pix_key FROM tenants WHERE slug = $1',
    [tenantSlug || 'demo']
  );
  
  const tenant = result.rows[0];
  const tenantPixKey = tenant?.pix_key || null;
  
  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm tenantSlug={tenantSlug} tenantPixKey={tenantPixKey} />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}