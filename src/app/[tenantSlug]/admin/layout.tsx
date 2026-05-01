import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { tenantSlug } = await params;
  
  const navItems = [
    { href: `/${tenantSlug}/admin/dashboard`, label: 'Dashboard', icon: '📊' },
    { href: `/${tenantSlug}/admin/produtos`, label: 'Produtos', icon: '📦' },
    { href: `/${tenantSlug}/admin/categorias`, label: 'Categorias', icon: '🏷️' },
    { href: `/${tenantSlug}/admin/pedidos`, label: 'Pedidos', icon: '🛒' },
    { href: `/${tenantSlug}/admin/cupons`, label: 'Cupons', icon: '🎫' },
    { href: `/${tenantSlug}/admin/configuracoes`, label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href={`/${tenantSlug}/admin/dashboard`} className="text-xl font-bold text-gray-900">
                Admin
              </Link>
              <nav className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Link 
              href={`/${tenantSlug}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Ver Loja →
            </Link>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}