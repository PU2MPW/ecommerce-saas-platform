import Link from 'next/link';

export default function LegalPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <div className="prose prose-sm">
        <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Coleta de Dados</h2>
        <p className="mb-4">Coletamos dados pessoais fornecidos por você, como nome, email, CPF e endereço, apenas para finalidade de entrega e cobrança.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Uso dos Dados</h2>
        <p className="mb-4">Seus dados são utilizados para: processamento de pedidos, comunicação sobre status de entrega, envio de promoções (com seu consentimento).</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Proteção</h2>
        <p className="mb-4">Implementamos medidas de segurança para proteger seus dados contra acesso não autorizado.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Compartilhamento</h2>
        <p className="mb-4">Seus dados podem ser compartilhados com terceiros necessários para entrega (transportadoras) e processamento de pagamento.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Seus Direitos</h2>
        <p className="mb-4">Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Contato</h2>
        <p className="mb-4">Para exercer seus direitos ou tirar dúvidas, entre em contato pelo email da loja.</p>
      </div>
    </div>
  );
}