'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
}

interface CategoriesAdminPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function CategoriesAdminPage({ params }: CategoriesAdminPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantSlug, setTenantSlug] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const loadData = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      
      const res = await fetch(`/api/admin/categories?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
      setLoading(false);
    };
    
    loadData();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/admin/categories', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        tenant_slug: tenantSlug,
        id: editingId
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (editingId) {
        setCategories(categories.map(c => c.id === editingId ? data.category : c));
      } else {
        setCategories([...categories, data.category]);
      }
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir categoria?')) return;
    
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({ name: cat.name, description: cat.description || '' });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nova Categoria'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6 space-y-4">
          <h3 className="font-semibold">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editingId ? 'Salvar' : 'Criar'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma categoria encontrada
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                      {cat.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 mr-3">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600">Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}