import React, { useState } from 'react';
import { 
  Grid, 
  Search, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Settings, 
  Star,
  Zap,
  MessageSquare,
  Truck,
  Mail,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

interface App {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  rating: number;
  installed: boolean;
  developer: string;
}

export default function AdminApps() {
  const [search, setSearch] = useState('');

  const apps: App[] = [
    { id: 'mailchimp', name: 'Mailchimp', description: 'Automate your marketing with email campaigns and newsletters.', icon: Mail, category: 'Marketing', rating: 4.8, installed: true, developer: 'Mailchimp' },
    { id: 'shipstation', name: 'ShipStation', description: 'Streamline your shipping and fulfillment process.', icon: Truck, category: 'Shipping', rating: 4.7, installed: false, developer: 'ShipStation' },
    { id: 'intercom', name: 'Intercom', description: 'Real-time customer support and messaging for your store.', icon: MessageSquare, category: 'Support', rating: 4.9, installed: true, developer: 'Intercom' },
    { id: 'meta-pixel', name: 'Meta Pixel', description: 'Track conversions and optimize your Facebook ads.', icon: Facebook, category: 'Analytics', rating: 4.6, installed: true, developer: 'Meta' },
    { id: 'google-analytics', name: 'Google Analytics', description: 'Advanced visitor tracking and behavioral insights.', icon: Globe, category: 'Analytics', rating: 4.9, installed: false, developer: 'Google' },
    { id: 'klaviyo', name: 'Klaviyo', description: 'Personalized email and SMS marketing for e-commerce.', icon: Zap, category: 'Marketing', rating: 4.8, installed: false, developer: 'Klaviyo' },
  ];

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apps & Integrations</h1>
          <p className="text-gray-500 text-sm mt-1">Extend your store's functionality with powerful third-party tools.</p>
        </div>
        <Button className="shadow-lg shadow-black/10">
          <Grid className="mr-2" size={18} />
          Visit App Store
        </Button>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-[32px] border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for apps, tools, or developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* App Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Marketing', 'Shipping', 'Support', 'Analytics', 'Sales'].map((cat) => (
          <button
            key={cat}
            className="px-6 py-3 bg-white border rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white p-8 rounded-[40px] border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <app.icon size={32} />
                </div>
                {app.installed && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={12} />
                    Installed
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{app.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {app.description}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-black">{app.rating}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  By {app.developer}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {app.installed ? (
                <>
                  <Button variant="outline" className="flex-grow py-4 text-xs font-bold uppercase tracking-widest">
                    <Settings size={16} className="mr-2" />
                    Configure
                  </Button>
                  <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </>
              ) : (
                <Button className="w-full py-4 text-xs font-bold uppercase tracking-widest">
                  Install App
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="bg-black text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Build your own apps</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Use our powerful API to build custom integrations and tools specifically for your store's needs.
          </p>
          <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-sm font-bold uppercase tracking-widest">
            Developer Portal
          </Button>
        </div>
        <Grid className="absolute -right-20 -bottom-20 text-white/5" size={400} />
      </div>
    </div>
  );
}
