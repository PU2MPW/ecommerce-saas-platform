import db from '@/lib/db'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { CookieConsent } from '@/components/ui/CookieConsent'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenantSlug: string }
}) {
  const cookieStore = await cookies()
  
  // Set tenant in context for database queries
  cookieStore.set('x-tenant-slug', params.tenantSlug, { path: '/' })
  
  // Fetch tenant configuration
  const result = await db.query(
    'SELECT name, logo_url, brand_color FROM tenants WHERE slug = $1',
    [params.tenantSlug]
  )
  
  const tenant = result.rows[0]
  const brandColor = tenant?.brand_color || '#2563eb'
  const tenantName = tenant?.name || 'Loja'
  const tenantLogo = tenant?.logo_url || null
  
  return (
    <html lang="pt-BR">
      <head>
        <title>{tenantName}</title>
        <meta name="description" content={`Loja virtual ${tenantName}`} />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-brand: ${brandColor};
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                {tenant?.logo_url ? (
                  <Link href={`/${params.tenantSlug}`} className="flex items-center">
                    <img src={tenant.logo_url} alt={tenantName} className="h-8" />
                  </Link>
                ) : (
                  <Link href={`/${params.tenantSlug}`} className="font-semibold text-xl" style={{ color: brandColor }}>
                    {tenantName}
                  </Link>
                )}
                
                <div className="hidden md:flex items-center gap-6">
                  <Link href={`/${params.tenantSlug}`} className="text-gray-600 hover:text-gray-900">
                    Início
                  </Link>
                  <Link href={`/${params.tenantSlug}/products`} className="text-gray-600 hover:text-gray-900">
                    Produtos
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  href={`/${params.tenantSlug}/cart`}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>
                
                <Link 
                  href={`/${params.tenantSlug}/auth/login`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Entrar
                </Link>
              </div>
            </nav>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Cookie Consent */}
        <CookieConsent />
        
        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="font-semibold mb-2">{tenantName}</h3>
                <p className="text-gray-500">Sua loja virtual confiável</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Institucional</h4>
                <ul className="space-y-1 text-gray-500">
                  <li><Link href={`/${params.tenantSlug}/about`} className="hover:text-gray-900">Sobre nós</Link></li>
                  <li><Link href={`/${params.tenantSlug}/contact`} className="hover:text-gray-900">Contato</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Políticas</h4>
                <ul className="space-y-1 text-gray-500">
                  <li><Link href={`/${params.tenantSlug}/privacy`} className="hover:text-gray-900">Privacidade</Link></li>
                  <li><Link href={`/${params.tenantSlug}/terms`} className="hover:text-gray-900">Termos de uso</Link></li>
                  <li><Link href={`/${params.tenantSlug}/exchange`} className="hover:text-gray-900">Trocas e devoluções</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Atendimento</h4>
                <p className="text-gray-500">Segunda a sexta, das 9h às 18h</p>
                <p className="text-gray-500">contato@{params.tenantSlug}.com</p>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} {tenantName}. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}