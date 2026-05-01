import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SuccessPageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { tenantSlug } = await params;
  const { order } = await searchParams;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-green-600">✓</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pedido Confirmado!</h1>
        
        <p className="text-gray-600 mb-2">
          Obrigado pela sua compra! Recebemos o seu pedido e ele está sendo processado.
        </p>
        
        {order && (
          <p className="text-sm text-gray-500 mb-8">
            Número do pedido: <span className="font-mono font-medium">{order}</span>
          </p>
        )}
        
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-medium text-blue-900 mb-2">Próximos passos:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Você receberá um email de confirmação</li>
            <li>• O pagamento será processado</li>
            <li>• Você receberá atualizações sobre o envio</li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${tenantSlug}/produtos`}>
            <Button size="lg">Continuar Comprando</Button>
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