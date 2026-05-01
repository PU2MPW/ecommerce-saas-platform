export default function TermsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      <div className="prose prose-sm">
        <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceitação</h2>
        <p className="mb-4">Ao utilizar nossa loja, você aceita estes termos e condições.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Compras</h2>
        <p className="mb-4">Ao realizar uma compra, você concorda em fornecer informações verdadeiras e pagar o valor total do pedido.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Preços</h2>
        <p className="mb-4">Os preços podem ser alterados sem aviso prévio. O preço do pedido é confirmado no momento da finalização.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Entrega</h2>
        <p className="mb-4">Os prazos de entrega são estimados e podem variar conforme a região.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Devoluções</h2>
        <p className="mb-4">Consulte nossa política de trocas para informações sobre devoluções e reembolsos.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Responsabilidade</h2>
        <p className="mb-4">Não nos responsabilizamos por danos indiretos ou consequenciais.</p>
      </div>
    </div>
  );
}