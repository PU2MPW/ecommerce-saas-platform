import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenantSlug: string }
}) {
  const session = await getSession()
  
  // In production, check if user has admin role for this tenant
  // For now, redirect to login if no session
  if (!session) {
    redirect(`/${params.tenantSlug}/auth/login?redirect=/admin/${params.tenantSlug}`)
  }
  
  const navItems = [
    { href: `/${params.tenantSlug}/admin`, label: 'Dashboard', icon: '📊' },
    { href: `/${params.tenantSlug}/admin/products`, label: 'Produtos', icon: '📦' },
    { href: `/${params.tenantSlug}/admin/orders`, label: 'Pedidos', icon: '🛒' },
    { href: `/${params.tenantSlug}/admin/customers`, label: 'Clientes', icon: '👥' },
    { href: `/${params.tenantSlug}/admin/coupons`, label: 'Cupons', icon: '🏷️' },
    { href: `/${params.tenantSlug}/admin/settings`, label: 'Configurações', icon: '⚙️' },
  ]
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href={`/${params.tenantSlug}`} className="font-semibold text-xl text-blue-600">
            Admin
          </Link>
          <p className="text-sm text-gray-500 mt-1">Loja: {params.tenantSlug}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Link
            href={`/${params.tenantSlug}`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <span>🏪</span>
            <span className="font-medium">Ver Loja</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full"
            >
              <span>🚪</span>
              <span className="font-medium">Sair</span>
            </button>
          </form>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}