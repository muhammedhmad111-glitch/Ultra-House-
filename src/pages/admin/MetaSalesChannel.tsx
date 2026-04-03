import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Settings,
  ExternalLink,
  Zap,
  MessageSquare
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

export default function AdminMetaSalesChannel() {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 via-red-500 to-yellow-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-red-500/20">
            <Instagram size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facebook & Instagram</h1>
            <p className="text-gray-500 text-sm mt-1">Sell your products directly on Meta platforms.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest">
              <CheckCircle2 size={16} />
              Connected
            </div>
          ) : (
            <Button className="shadow-lg shadow-black/10">
              Connect Account
            </Button>
          )}
        </div>
      </div>

      {/* Meta Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm group hover:shadow-md transition-all">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Meta Sales</p>
          <h3 className="text-3xl font-bold">$4,231.00</h3>
          <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
            <ArrowUpRight size={14} />
            +15.2% this month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm group hover:shadow-md transition-all">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Product Sync</p>
          <h3 className="text-3xl font-bold">124 / 124</h3>
          <div className="mt-4 flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} />
            All synced
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm group hover:shadow-md transition-all">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ad Performance</p>
          <h3 className="text-3xl font-bold">4.2x ROAS</h3>
          <div className="mt-4 flex items-center gap-2 text-purple-500 text-xs font-bold uppercase tracking-widest">
            <TrendingUp size={14} />
            Above average
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Catalog */}
        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xl font-bold tracking-tight">Product Catalog</h3>
            <Button variant="outline" className="text-xs font-bold uppercase tracking-widest">
              Manage Catalog
            </Button>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border shadow-sm">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Instagram Shopping</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active • 124 Products</p>
                </div>
              </div>
              <button className="p-3 hover:bg-gray-200 rounded-xl transition-colors">
                <Settings size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border shadow-sm">
                  <Facebook size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Facebook Shop</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active • 124 Products</p>
                </div>
              </div>
              <button className="p-3 hover:bg-gray-200 rounded-xl transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Marketing Tools */}
        <div className="bg-black text-white p-10 rounded-[40px] shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Meta Marketing</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Run automated ads, track conversions with the Meta Pixel, and engage with customers through Messenger and Instagram Direct.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <Zap className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-bold">Advantage+ Ads</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <MessageSquare className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-bold">Messenger</p>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-white p-10 rounded-[40px] border shadow-sm">
        <h3 className="text-xl font-bold tracking-tight mb-8">Setup Checklist</h3>
        <div className="space-y-4">
          {[
            { task: 'Connect Facebook Page', status: true },
            { task: 'Connect Instagram Business Account', status: true },
            { task: 'Upload Product Catalog', status: true },
            { task: 'Install Meta Pixel', status: true },
            { task: 'Set up Commerce Manager', status: false },
          ].map((item, index) => (
            <div key={item.task} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  item.status ? "bg-black border-black text-white" : "border-gray-200 text-gray-200"
                )}>
                  {item.status ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                <span className={cn("text-sm font-bold", item.status ? "text-black" : "text-gray-400")}>{item.task}</span>
              </div>
              {!item.status && (
                <Button variant="outline" className="text-[10px] font-bold uppercase tracking-widest py-2">
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
