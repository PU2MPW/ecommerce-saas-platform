import Link from 'next/link';

interface AccountLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}

export default async function AccountLayout({ children, params }: AccountLayoutProps) {
  const { tenantSlug } = await params;
  
  const navItems = [
    { href: `/${tenantSlug}/conta`, label: 'Meu Perfil', icon: '👤' },
    { href: `/${tenantSlug}/conta/pedidos`, label: 'Meus Pedidos', icon: '📦' },
    { href: `/${tenantSlug}/conta/enderecos`, label: 'Endereços', icon: '📍' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <nav className="bg-white border rounded-lg p-4">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-50">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}