import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { Product, Order } from '../types';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, user, isAuthReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthReady && !isAdmin) {
      navigate('/');
      toast.error('Access denied. Admins only.');
    }
  }, [isAdmin, isAuthReady, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(true); // Should be false, but wait
      setIsLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Total Sales', 
      value: `$${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up' 
    },
    { 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+8.2%', 
      trend: 'up' 
    },
    { 
      label: 'Total Products', 
      value: products.length.toString(), 
      change: '+5.4%', 
      trend: 'up' 
    },
    { 
      label: 'Avg. Order Value', 
      value: `$${orders.length > 0 ? (orders.reduce((acc, curr) => acc + curr.total, 0) / orders.length).toFixed(0) : 0}`, 
      change: '-2.1%', 
      trend: 'down' 
    },
  ];

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-1">
            <span className="bg-black text-white px-1.5 py-0.5 rounded">ULTRA</span>
            <span>ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ChevronRight className="rotate-180" size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
            <p className="text-gray-500 text-sm">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-black" />
            </div>
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                      stat.trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="font-bold">Recent Orders</h3>
                  <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Order ID</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Customer</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Total</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold">#{order.id?.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4 text-gray-500">{order.shippingAddress.fullName}</td>
                          <td className="px-6 py-4 font-bold">${order.total}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              order.status === 'delivered' ? "bg-green-50 text-green-600" :
                              order.status === 'processing' ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                            )}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {order.createdAt ? format(order.createdAt.toDate(), 'MMM d, HH:mm') : 'Just now'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="font-bold">Top Products</h3>
                </div>
                <div className="p-6 space-y-6">
                  {products.slice(0, 4).map((product) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold truncate">{product.name}</h4>
                        <p className="text-xs text-gray-400">{product.reviewsCount} sales</p>
                      </div>
                      <div className="text-sm font-bold">${product.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Product</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Category</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Price</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Stock</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                          <span className="font-bold truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 capitalize">{product.category}</td>
                      <td className="px-6 py-4 font-bold">${product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            product.stock > 10 ? "bg-green-500" : "bg-red-500"
                          )} />
                          <span className="text-gray-500 font-medium">{product.stock} in stock</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this product?')) {
                                await deleteProduct(product.id);
                                fetchData();
                                toast.success('Product deleted');
                              }
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Order ID</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Customer</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Items</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Total</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Payment</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">#{order.id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{order.shippingAddress.fullName}</span>
                          <span className="text-xs text-gray-400">{order.shippingAddress.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.items.length} items</td>
                      <td className="px-6 py-4 font-bold">${order.total}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={async (e) => {
                            await updateOrderStatus(order.id!, e.target.value as any);
                            fetchData();
                            toast.success('Order status updated');
                          }}
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-none outline-none cursor-pointer",
                            order.status === 'delivered' ? "bg-green-50 text-green-600" :
                            order.status === 'processing' ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                          )}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-500 uppercase text-[10px] font-bold tracking-widest">{order.paymentMethod}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
