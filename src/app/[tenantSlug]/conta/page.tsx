'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProfilePageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [formData, setFormData] = useState({ name: 'Cliente', email: 'cliente@exemplo.com' });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Meus Dados</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <Button type="submit">{saved ? 'Salvo!' : 'Salvar'}</Button>
      </form>
    </div>
  );
}