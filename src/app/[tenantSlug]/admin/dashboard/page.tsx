'use client';

import { useState, useEffect } from 'react';

interface DashboardProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function DashboardPage({ params }: DashboardProps) {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [tenantSlug, setTenantSlug] = useState('');

  useEffect(() => {
    const load = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      
      const res = await fetch(`/api/admin/dashboard?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    };
    load();
  }, [params]);

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Produtos</p>
          <p className="text-3xl font-bold text-blue-600">{stats.products}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Pedidos</p>
          <p className="text-3xl font-bold text-green-600">{stats.orders}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Receita Total</p>
          <p className="text-3xl font-bold text-purple-600">R$ {stats.revenue.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href={`/${tenantSlug}/admin/produtos/novo`} className="p-4 border rounded-lg text-center hover:bg-gray-50">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm">Novo Produto</div>
          </a>
          <a href={`/${tenantSlug}/admin/pedidos`} className="p-4 border rounded-lg text-center hover:bg-gray-50">
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-sm">Ver Pedidos</div>
          </a>
          <a href={`/${tenantSlug}/admin/cupons`} className="p-4 border rounded-lg text-center hover:bg-gray-50">
            <div className="text-2xl mb-2">🎫</div>
            <div className="text-sm">Criar Cupom</div>
          </a>
          <a href={`/${tenantSlug}/admin/configuracoes`} className="p-4 border rounded-lg text-center hover:bg-gray-50">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm">Configurações</div>
          </a>
        </div>
      </div>
    </div>
  );
}