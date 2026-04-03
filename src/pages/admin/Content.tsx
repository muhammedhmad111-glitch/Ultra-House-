import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Layout, 
  BookOpen, 
  Settings, 
  ChevronRight,
  Clock,
  User,
  Globe
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'blog';
  status: 'published' | 'draft';
  author: string;
  lastUpdated: string;
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'pages' | 'blog'>('pages');
  const [search, setSearch] = useState('');

  const content: ContentItem[] = [
    { id: '1', title: 'About Us', type: 'page', status: 'published', author: 'Admin', lastUpdated: '2 days ago' },
    { id: '2', title: 'Contact Us', type: 'page', status: 'published', author: 'Admin', lastUpdated: '1 week ago' },
    { id: '3', title: 'Privacy Policy', type: 'page', status: 'published', author: 'Admin', lastUpdated: '1 month ago' },
    { id: '4', title: 'Terms of Service', type: 'page', status: 'published', author: 'Admin', lastUpdated: '1 month ago' },
    { id: '5', title: 'The Future of Furniture Design', type: 'blog', status: 'published', author: 'Jane Doe', lastUpdated: '3 days ago' },
    { id: '6', title: 'How to Choose the Right Sofa', type: 'blog', status: 'draft', author: 'John Smith', lastUpdated: 'Just now' },
    { id: '7', title: 'Sustainability in Home Decor', type: 'blog', status: 'published', author: 'Jane Doe', lastUpdated: '2 weeks ago' },
  ];

  const filteredContent = content.filter(item => 
    item.type === activeTab &&
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your store's pages and blog posts.</p>
        </div>
        <Button className="shadow-lg shadow-black/10">
          <Plus className="mr-2" size={18} />
          Create {activeTab === 'pages' ? 'Page' : 'Post'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-3xl border shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('pages')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
            activeTab === 'pages' ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-black hover:bg-gray-50"
          )}
        >
          <Layout size={18} />
          Pages
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
            activeTab === 'blog' ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-black hover:bg-gray-50"
          )}
        >
          <BookOpen size={18} />
          Blog Posts
        </button>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-[32px] border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* Content List */}
      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="divide-y">
          {filteredContent.map((item) => (
            <div key={item.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      item.status === 'published' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <User size={12} />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Updated {item.lastUpdated}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe size={12} />
                      / {item.title.toLowerCase().replace(/ /g, '-')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                  <Eye size={18} />
                </button>
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-4 bg-red-50 rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black text-white p-10 rounded-[40px] shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">SEO Settings</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Optimize your content for search engines with custom meta tags, social sharing images, and URL structures.
          </p>
          <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-xs font-bold uppercase tracking-widest">
            Configure SEO
          </Button>
        </div>
        <div className="bg-white p-10 rounded-[40px] border shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Navigation</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Manage your store's menus, footers, and internal linking structure to help customers find what they need.
          </p>
          <Button variant="outline" className="px-8 py-4 text-xs font-bold uppercase tracking-widest">
            Manage Menus
          </Button>
        </div>
      </div>
    </div>
  );
}
