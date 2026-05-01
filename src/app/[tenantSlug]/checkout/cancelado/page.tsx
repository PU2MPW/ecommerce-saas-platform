import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface CancelPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function CancelPage({ params }: CancelPageProps) {
  const { tenantSlug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-red-600">✕</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Cancelado</h1>
        
        <p className="text-gray-600 mb-8">
          O pagamento não foi concluído. Você pode tentar novamente ou retornar ao checkout.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${tenantSlug}/checkout`}>
            <Button size="lg">Tentar Novamente</Button>
          </Link>
          
          <Link href={`/${tenantSlug}`}>
            <Button variant="outline" size="lg">
              Voltar à Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}