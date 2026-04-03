import React, { useState } from 'react';
import { 
  Globe2, 
  Plus, 
  Search, 
  ChevronRight, 
  DollarSign, 
  Languages, 
  MapPin, 
  Settings, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

interface Market {
  id: string;
  name: string;
  regions: string[];
  currency: string;
  language: string;
  status: 'active' | 'inactive';
  isPrimary?: boolean;
}

export default function AdminMarkets() {
  const [markets, setMarkets] = useState<Market[]>([
    { id: 'primary', name: 'Primary Market', regions: ['United States', 'Canada'], currency: 'USD', language: 'English', status: 'active', isPrimary: true },
    { id: 'europe', name: 'European Union', regions: ['France', 'Germany', 'Italy', 'Spain'], currency: 'EUR', language: 'Multiple', status: 'active' },
    { id: 'uk', name: 'United Kingdom', regions: ['United Kingdom'], currency: 'GBP', language: 'English', status: 'active' },
    { id: 'japan', name: 'Japan', regions: ['Japan'], currency: 'JPY', language: 'Japanese', status: 'inactive' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage international pricing, languages, and regional settings.</p>
        </div>
        <Button className="shadow-lg shadow-black/10">
          <Plus className="mr-2" size={18} />
          Add Market
        </Button>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Total Markets</p>
            <h2 className="text-4xl font-bold tracking-tight">{markets.length}</h2>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
              <CheckCircle2 size={14} />
              3 Active Markets
            </div>
          </div>
          <Globe2 className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-500" size={140} />
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">International Sales</p>
            <h3 className="text-2xl font-bold">$12,432.00</h3>
          </div>
          <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Global Reach</p>
            <h3 className="text-2xl font-bold">12 Countries</h3>
          </div>
          <div className="mt-4 p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
            <MapPin size={20} />
          </div>
        </div>
      </div>

      {/* Markets List */}
      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold tracking-tight">Active Markets</h3>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border text-gray-400">
            <Search size={16} />
            <input type="text" placeholder="Search markets..." className="bg-transparent border-none outline-none text-xs text-black w-40" />
          </div>
        </div>
        <div className="divide-y">
          {markets.map((market) => (
            <div key={market.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  market.status === 'active' ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                )}>
                  <Globe2 size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold tracking-tight">{market.name}</h3>
                    {market.isPrimary && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Primary
                      </span>
                    )}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      market.status === 'active' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {market.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {market.regions.length} Regions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={12} />
                      {market.currency}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Languages size={12} />
                      {market.language}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="px-6 py-3 text-xs font-bold uppercase tracking-widest">
                  <Settings size={16} className="mr-2" />
                  Manage
                </Button>
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'International Pricing', desc: 'Set specific prices or exchange rate rules for each market.', icon: DollarSign, color: 'bg-green-50 text-green-600' },
          { title: 'Local Domains', desc: 'Assign unique domains or subfolders to target specific regions.', icon: Globe2, color: 'bg-blue-50 text-blue-600' },
          { title: 'Duties & Taxes', desc: 'Automatically calculate and collect duties at checkout.', icon: ShieldCheck, color: 'bg-purple-50 text-purple-600' },
        ].map((feature) => (
          <div key={feature.title} className="bg-white p-8 rounded-[40px] border shadow-sm hover:shadow-md transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", feature.color)}>
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
