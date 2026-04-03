import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  Globe, 
  ArrowUpRight,
  Clock,
  Eye,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LiveEvent {
  id: string;
  type: 'view' | 'cart' | 'purchase';
  user: string;
  location: string;
  time: string;
  amount?: number;
}

export default function AdminLiveView() {
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 50) + 10);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [stats, setStats] = useState({
    views: 1240,
    carts: 85,
    purchases: 12
  });

  useEffect(() => {
    // Simulate real-time activity
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(5, prev + change);
      });

      const types: ('view' | 'cart' | 'purchase')[] = ['view', 'view', 'view', 'cart', 'purchase'];
      const type = types[Math.floor(Math.random() * types.length)];
      const locations = ['New York, US', 'London, UK', 'Paris, FR', 'Berlin, DE', 'Tokyo, JP', 'Dubai, AE', 'Cairo, EG'];
      
      const newEvent: LiveEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        user: `User_${Math.floor(Math.random() * 1000)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        time: new Date().toLocaleTimeString(),
        amount: type === 'purchase' ? Math.floor(Math.random() * 500) + 50 : undefined
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 10));
      
      setStats(prev => ({
        ...prev,
        [type === 'view' ? 'views' : type === 'cart' ? 'carts' : 'purchases']: prev[type === 'view' ? 'views' : type === 'cart' ? 'carts' : 'purchases'] + 1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live View</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time monitoring of your store's activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest animate-pulse">
          <Activity size={16} />
          Live Now
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Active Visitors</p>
            <h2 className="text-5xl font-bold tracking-tighter">{activeUsers}</h2>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
              <ArrowUpRight size={14} />
              +12% from last hour
            </div>
          </div>
          <Users className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-500" size={160} />
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Page Views</p>
            <h3 className="text-3xl font-bold">{stats.views.toLocaleString()}</h3>
          </div>
          <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
            <Eye size={20} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Add to Carts</p>
            <h3 className="text-3xl font-bold">{stats.carts}</h3>
          </div>
          <div className="mt-4 p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Purchases</p>
            <h3 className="text-3xl font-bold">{stats.purchases}</h3>
          </div>
          <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-2xl w-fit">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
            <Activity className="text-gray-400" size={20} />
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        event.type === 'view' ? "bg-blue-50 text-blue-600" :
                        event.type === 'cart' ? "bg-purple-50 text-purple-600" :
                        "bg-green-50 text-green-600"
                      )}>
                        {event.type === 'view' ? <MousePointer2 size={20} /> :
                         event.type === 'cart' ? <ShoppingBag size={20} /> :
                         <DollarSign size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {event.type === 'view' ? 'Viewed a product' :
                           event.type === 'cart' ? 'Added to cart' :
                           `Purchased items for $${event.amount}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} />
                            {event.location}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} />
                            {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{event.user}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xl font-bold tracking-tight">Top Locations</h3>
            <Globe className="text-gray-400" size={20} />
          </div>
          <div className="p-8 space-y-6">
            {[
              { city: 'New York', country: 'US', visitors: 42, percentage: 35 },
              { city: 'London', country: 'UK', visitors: 28, percentage: 24 },
              { city: 'Paris', country: 'FR', visitors: 15, percentage: 12 },
              { city: 'Berlin', country: 'DE', visitors: 12, percentage: 10 },
              { city: 'Tokyo', country: 'JP', visitors: 8, percentage: 6 },
            ].map((loc) => (
              <div key={loc.city} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">{loc.city}, {loc.country}</span>
                  <span className="text-gray-400 font-bold">{loc.visitors} visitors</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loc.percentage}%` }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
