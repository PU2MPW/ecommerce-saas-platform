'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';

interface NewProductPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function NewProductPage({ params }: NewProductPageProps) {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const { tenantSlug } = await params;
    
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        tenant_slug: tenantSlug
      })
    });

    if (res.ok) {
      router.push(`/${tenantSlug}/admin/produtos`);
    } else {
      const error = await res.json();
      alert(error.message || 'Erro ao criar produto');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
        <p className="text-gray-500">Preencha os dados do produto</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}