'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  image_url?: string;
  category_id?: string;
}

interface ProductsAdminPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function ProductsAdminPage({ params }: ProductsAdminPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantSlug, setTenantSlug] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const loadData = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      
      // Fetch products from API
      try {
        const res = await fetch(`/api/admin/products?tenant=${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      }
      setLoading(false);
    };
    
    loadData();
  }, [params]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && p.active) || 
      (filter === 'inactive' && !p.active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link 
          href={`/${tenantSlug}/admin/produtos/novo`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Imagem</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Preço</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estoque</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} width={48} height={48} className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-2xl">📦</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-900">R$ {product.price?.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock} un
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      href={`/${tenantSlug}/admin/produtos/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
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