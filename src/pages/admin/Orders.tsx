import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Clock,
  Package
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { Order } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import Papa from 'papaparse';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (search) {
      result = result.filter(o => 
        o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
        o.shippingAddress.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }
    setFilteredOrders(result);
  }, [search, statusFilter, orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order ${newStatus} successfully!`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const exportToCSV = () => {
    const data = filteredOrders.map(o => ({
      ID: o.id,
      Date: new Date(o.createdAt).toLocaleString(),
      Customer: o.shippingAddress.fullName,
      Email: o.shippingAddress.email,
      Total: o.total,
      Status: o.status,
      Payment: o.paymentMethod,
      Items: o.items.map(i => `${i.name} (x${i.quantity})`).join('; ')
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders.</p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2" size={18} />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border-none focus:ring-2 ring-black/5 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No orders found matching your criteria.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-black">${order.total.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                          <Eye size={18} />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border p-2 z-10 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                            <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                              <Clock size={14} /> Mark Processing
                            </button>
                            <button onClick={() => handleStatusUpdate(order.id, 'shipped')} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                              <Truck size={14} /> Mark Shipped
                            </button>
                            <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                              <CheckCircle size={14} /> Mark Delivered
                            </button>
                            <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border-t mt-1 pt-3">
                              <XCircle size={14} /> Cancel Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
