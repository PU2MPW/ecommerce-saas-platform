'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SettingsPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const [tenantSlug, setTenantSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cnpj: '',
    pix_key: '',
    pix_key_type: 'cpf',
    brand_color: '#2563eb',
    logo_url: ''
  });

  useEffect(() => {
    const load = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      
      const res = await fetch(`/api/admin/settings?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tenant) {
          setFormData({
            name: data.tenant.name || '',
            email: data.tenant.email || '',
            cnpj: data.tenant.cnpj || '',
            pix_key: data.tenant.pix_key || '',
            pix_key_type: data.tenant.pix_key_type || 'cpf',
            brand_color: data.tenant.brand_color || '#2563eb',
            logo_url: data.tenant.logo_url || ''
          });
        }
      }
      setLoading(false);
    };
    load();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, tenant_slug: tenantSlug })
    });
    
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="py-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Configurações da Loja</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Informações da Loja</h3>
          <div className="space-y-4">
            <Input label="Nome da Loja" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Email de Contato" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="CNPJ" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} placeholder="00.000.000/0001-00" />
          </div>
        </div>

        {/* Pix Settings */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Configurações Pix</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Chave</label>
              <select value={formData.pix_key_type} onChange={e => setFormData({...formData, pix_key_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">Email</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>
            <Input label="Chave Pix" value={formData.pix_key} onChange={e => setFormData({...formData, pix_key: e.target.value})} placeholder="Sua chave Pix" />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Aparência</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor da Marca</label>
              <div className="flex gap-4 items-center">
                <input type="color" value={formData.brand_color} onChange={e => setFormData({...formData, brand_color: e.target.value})} className="w-12 h-12 border rounded cursor-pointer" />
                <input type="text" value={formData.brand_color} onChange={e => setFormData({...formData, brand_color: e.target.value})} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <Input label="URL do Logo" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} placeholder="https://exemplo.com/logo.png" />
            {formData.logo_url && <img src={formData.logo_url} alt="Logo preview" className="h-16 object-contain border rounded p-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          </div>
        </div>

        <Button type="submit" isLoading={saving} className="w-full">
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
}