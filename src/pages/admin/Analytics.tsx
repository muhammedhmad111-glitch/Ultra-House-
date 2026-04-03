import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MousePointer2,
  Clock
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
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const COLORS = ['#000000', '#444444', '#888888', '#CCCCCC', '#EEEEEE'];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const revenueData = [
    { date: 'Mon', revenue: 4200, orders: 45 },
    { date: 'Tue', revenue: 3800, orders: 38 },
    { date: 'Wed', revenue: 5100, orders: 52 },
    { date: 'Thu', revenue: 4600, orders: 48 },
    { date: 'Fri', revenue: 6200, orders: 65 },
    { date: 'Sat', revenue: 7800, orders: 82 },
    { date: 'Sun', revenue: 5900, orders: 60 },
  ];

  const categoryData = [
    { name: 'Living Room', value: 45 },
    { name: 'Bedroom', value: 25 },
    { name: 'Office', value: 15 },
    { name: 'Kitchen', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const trafficData = [
    { name: 'Direct', value: 400 },
    { name: 'Search', value: 300 },
    { name: 'Social', value: 200 },
    { name: 'Referral', value: 100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into your store's performance data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border rounded-2xl p-1 flex items-center gap-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  timeRange === range ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-black hover:bg-gray-50"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '$45,231.89', trend: '+20.1%', isUp: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
          { label: 'Avg. Order Value', value: '$124.50', trend: '+4.5%', isUp: true, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
          { label: 'Conversion Rate', value: '3.24%', trend: '-1.2%', isUp: false, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Sessions', value: '12,432', trend: '+12.3%', isUp: true, icon: Users, color: 'bg-orange-50 text-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.color)}>
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                stat.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Over Time */}
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Sales Over Time</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Sales by Category</h3>
            <Filter className="text-gray-400" size={20} />
          </div>
          <div className="h-[300px] flex items-center gap-4">
            <div className="flex-grow h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-xs font-bold text-gray-600">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold tracking-tight mb-8">Traffic Sources</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#000" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-2">Customer Retention</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Your returning customer rate has increased by 15% this month.
            </p>
          </div>
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">New Customers</span>
              <span className="text-xl font-bold">842</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Returning</span>
              <span className="text-xl font-bold">324</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-500">
              72% Customer Satisfaction Score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
