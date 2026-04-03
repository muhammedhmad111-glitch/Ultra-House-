import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { getOrders } from '../../services/orderService';
import { getProducts } from '../../services/productService';
import { Order, Product, Analytics } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        getOrders(),
        getProducts()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateAnalytics = (): Analytics => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.shippingAddress.email)).size;
    
    // Mock daily reports based on orders
    const dailyReports = orders.reduce((acc: any[], order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const existing = acc.find(r => r.date === date);
      if (existing) {
        existing.revenue += order.total;
        existing.orders += 1;
      } else {
        acc.push({ date, revenue: order.total, orders: 1 });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Best selling products
    const productSales = orders.reduce((acc: any, order) => {
      order.items.forEach(item => {
        if (!acc[item.id]) {
          acc[item.id] = { name: item.name, sales: 0, revenue: 0 };
        }
        acc[item.id].sales += item.quantity;
        acc[item.id].revenue += item.price * item.quantity;
      });
      return acc;
    }, {});

    const bestSellingProducts = Object.entries(productSales)
      .map(([id, data]: [string, any]) => ({ id, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      conversionRate: (totalOrders / 1000) * 100, // Mock traffic
      bestSellingProducts,
      dailyReports
    };
  };

  const analytics = calculateAnalytics();

  const handleSyncSheets = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders, products })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Synced to Google Sheets!");
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error("Failed to connect to sync server");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600', trend: '+12.5%', isUp: true },
    { label: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', trend: '+5.2%', isUp: true },
    { label: 'Total Customers', value: analytics.totalCustomers, icon: Users, color: 'bg-purple-50 text-purple-600', trend: '+8.1%', isUp: true },
    { label: 'Conversion Rate', value: `${analytics.conversionRate.toFixed(2)}%`, icon: TrendingUp, color: 'bg-orange-50 text-orange-600', trend: '-1.2%', isUp: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time store performance and analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSyncSheets} disabled={syncing}>
            <FileSpreadsheet className={`mr-2 ${syncing ? 'animate-spin' : ''}`} size={18} />
            {syncing ? 'Syncing...' : 'Sync to Sheets'}
          </Button>
          <Button>
            <Download className="mr-2" size={18} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={analytics.dailyReports}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Best Selling Products</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={analytics.bestSellingProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666'}} width={120} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#000" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
