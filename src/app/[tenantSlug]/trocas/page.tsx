export default function ExchangePage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Política de Trocas e Devoluções</h1>
      <div className="prose prose-sm">
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Prazo</h2>
        <p className="mb-4">Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Condições</h2>
        <p className="mb-4">O produto deve estar em sua embalagem original, sem uso e com todas as etiquetas.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Como Solicitar</h2>
        <p className="mb-4">Entre em contato pelo email ou WhatsApp da loja informando o número do pedido e motivo da troca.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Reembolso</h2>
        <p className="mb-4">O reembolso será realizado pelo mesmo método de pagamento em até 10 dias úteis após recebimento do produto.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Frete</h2>
        <p className="mb-4">O cliente arca com o frete de devolução, exceto em caso de defeito.</p>
      </div>
    </div>
  );
}