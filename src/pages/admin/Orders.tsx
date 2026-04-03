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
  Package,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { Order } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

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
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
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
      Phone: o.shippingAddress.phone,
      Address: `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.country}`,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders in real-time.</p>
        </div>
        <Button variant="outline" onClick={exportToCSV} className="shadow-sm">
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
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No orders found matching your criteria.</td>
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
                      <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-black">${order.total.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        getStatusColor(order.status)
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black"
                        >
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

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Order #{selectedOrder.id.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 lg:p-12 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left Column: Items */}
                  <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-black">
                        <Package size={20} />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Order Items</h3>
                      </div>
                      <div className="bg-gray-50 rounded-3xl overflow-hidden border">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b bg-gray-100/50">
                              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Qty</th>
                              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Price</th>
                              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedOrder.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <img src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" referrerPolicy="no-referrer" />
                                    <span className="text-sm font-bold text-gray-900">{item.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium">{item.quantity}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">${item.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-100/50">
                              <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold uppercase tracking-widest text-gray-500">Grand Total</td>
                              <td className="px-6 py-4 text-right text-lg font-bold text-black">${selectedOrder.total.toLocaleString()}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-black">
                        <Clock size={20} />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Order Status History</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
                          const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= idx;
                          return (
                            <div key={status} className="flex flex-col items-center gap-2 flex-grow">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                isCompleted ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-300"
                              )}>
                                {isCompleted ? <CheckCircle size={20} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                isCompleted ? "text-black" : "text-gray-400"
                              )}>{status}</span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Customer Info */}
                  <div className="space-y-8">
                    <section className="bg-gray-50 rounded-3xl p-6 border space-y-6">
                      <h3 className="font-bold uppercase tracking-widest text-sm border-b pb-4">Customer Info</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-xl border shadow-sm text-gray-400">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</p>
                            <p className="text-sm font-bold">{selectedOrder.shippingAddress.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-xl border shadow-sm text-gray-400">
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</p>
                            <p className="text-sm font-bold">{selectedOrder.shippingAddress.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-xl border shadow-sm text-gray-400">
                            <Phone size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</p>
                            <p className="text-sm font-bold">{selectedOrder.shippingAddress.phone}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="bg-gray-50 rounded-3xl p-6 border space-y-6">
                      <h3 className="font-bold uppercase tracking-widest text-sm border-b pb-4">Shipping Address</h3>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-xl border shadow-sm text-gray-400">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-relaxed">
                            {selectedOrder.shippingAddress.address}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="bg-gray-50 rounded-3xl p-6 border space-y-6">
                      <h3 className="font-bold uppercase tracking-widest text-sm border-b pb-4">Payment Info</h3>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-xl border shadow-sm text-gray-400">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</p>
                          <p className="text-sm font-bold uppercase">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-10 border-t flex flex-wrap gap-3">
                  <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')} variant={selectedOrder.status === 'processing' ? 'default' : 'outline'} className="flex-grow">
                    <Clock className="mr-2" size={18} /> Processing
                  </Button>
                  <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')} variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'} className="flex-grow">
                    <Truck className="mr-2" size={18} /> Shipped
                  </Button>
                  <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')} variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'} className="flex-grow">
                    <CheckCircle className="mr-2" size={18} /> Delivered
                  </Button>
                  <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')} variant="outline" className="flex-grow text-red-600 hover:bg-red-50 hover:border-red-200">
                    <XCircle className="mr-2" size={18} /> Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
