import { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Mail,
  MoreVertical,
  Eye,
  RefreshCw
} from 'lucide-react';
import { getOrders } from '../../services/orderService';
import { Order, Customer } from '../../types';
import Button from '../../components/ui/Button';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const orders = await getOrders();
      
      // Group orders by customer email to build customer profiles
      const customerMap = orders.reduce((acc: any, order) => {
        const email = order.shippingAddress.email;
        if (!acc[email]) {
          acc[email] = {
            uid: order.userId || email,
            email: email,
            displayName: order.shippingAddress.fullName,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
            createdAt: order.createdAt // Fallback
          };
        }
        acc[email].totalOrders += 1;
        acc[email].totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(acc[email].lastOrderDate)) {
          acc[email].lastOrderDate = order.createdAt;
        }
        return acc;
      }, {});

      setCustomers(Object.values(customerMap));
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Database</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your customer relationships.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border shadow-sm">
          <Users className="text-purple-600" size={20} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Customers</p>
            <p className="text-lg font-bold">{customers.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-3xl border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Orders</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Total Spent</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Last Order</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-500">Loading customers...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                          {customer.displayName?.[0] || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{customer.displayName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} /> {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="text-blue-500" size={14} />
                        <span className="text-sm font-bold">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-green-500" size={14} />
                        <span className="text-sm font-bold">${customer.totalSpent.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400" size={14} />
                        <span className="text-xs text-gray-500">{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black">
                          <MoreVertical size={18} />
                        </button>
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
