import { CartProvider } from '@/hooks/useCart';
import { CartPageContent } from '@/components/store/CartPageContent';

interface CartPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { tenantSlug } = await params;
  
  return (
    <CartProvider>
      <CartPageContent tenantSlug={tenantSlug} />
    </CartProvider>
  );
}