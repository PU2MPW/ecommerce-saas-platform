'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  shipping_address?: any;
}

interface OrdersAdminPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default function OrdersAdminPage({ params }: OrdersAdminPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantSlug, setTenantSlug] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { tenantSlug } = await params;
      setTenantSlug(tenantSlug);
      
      const res = await fetch(`/api/admin/orders?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
      setLoading(false);
    };
    
    loadData();
  }, [params]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/admin/orders?id=${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const filteredOrders = orders.filter(o => 
    filter === 'all' || o.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-purple-100 text-purple-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Todos</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Pagamento</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{order.id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 font-medium">R$ {order.total?.toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 
                      order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100'
                    }`}>
                      {order.payment_status === 'paid' ? 'Pago' : 
                       order.payment_status === 'pending' ? 'Pendente' : 'Falhou'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pedido {selectedOrder.id.substring(0, 8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span>{new Date(selectedOrder.created_at).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="font-bold">R$ {selectedOrder.total?.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {statusLabels[selectedOrder.status] || selectedOrder.status}
                </span>
              </div>
              
              {selectedOrder.shipping_address && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shipping_address.name}</p>
                    <p>{selectedOrder.shipping_address.street}, {selectedOrder.shipping_address.number}</p>
                    <p>{selectedOrder.shipping_address.neighborhood} - {selectedOrder.shipping_address.city}/{selectedOrder.shipping_address.state}</p>
                    <p>CEP: {selectedOrder.shipping_address.zipcode}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}