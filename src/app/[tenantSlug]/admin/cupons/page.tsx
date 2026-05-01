'use client';

import { useState, useEffect } from 'react';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value?: number;
  valid_until?: string;
  active: boolean;
  usage_limit?: number;
  used_count: number;
}

export default function CouponsAdminPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantSlug, setTenantSlug] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discount_type: 'percent', discount_value: 10, min_order_value: 0, valid_until: '', usage_limit: 0
  });

  useEffect(() => {
    const load = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      const res = await fetch(`/api/admin/coupons?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
      setLoading(false);
    };
    load();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, tenant_slug: tenantSlug })
    });
    if (res.ok) {
      const data = await res.json();
      setCoupons([...coupons, data.coupon]);
      setShowForm(false);
      setFormData({ code: '', discount_type: 'percent', discount_value: 10, min_order_value: 0, valid_until: '', usage_limit: 0 });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/coupons?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) });
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !current } : c));
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {showForm ? 'Cancelar' : '+ Novo Cupom'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Código do cupom" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="px-3 py-2 border rounded" required />
            <select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value })} className="px-3 py-2 border rounded">
              <option value="percent">Porcentagem (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
            <input type="number" placeholder="Valor do desconto" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" required />
            <input type="date" placeholder="Válido até" value={formData.valid_until} onChange={e => setFormData({ ...formData, valid_until: e.target.value })} className="px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Criar Cupom</button>
        </form>
      )}

      <div className="bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left">Código</th><th className="px-4 py-3 text-left">Desconto</th><th className="px-4 py-3 text-left">Validade</th><th className="px-4 py-3 text-left">Usos</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y">
            {coupons.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Nenhum cupom</td></tr> : coupons.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.discount_type === 'percent' ? `${c.discount_value}%` : `R$ ${c.discount_value}`}</td>
                <td className="px-4 py-3">{c.valid_until ? new Date(c.valid_until).toLocaleDateString('pt-BR') : 'Sem prazo'}</td>
                <td className="px-4 py-3">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{c.active ? 'Ativo' : 'Inativo'}</span></td>
                <td className="px-4 py-3 text-right"><button onClick={() => toggleActive(c.id, c.active)} className="text-blue-600">{c.active ? 'Desativar' : 'Ativar'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}