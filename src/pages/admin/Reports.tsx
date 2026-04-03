import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp,
  FileSpreadsheet,
  FileJson,
  FileCode
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Sales' | 'Customers' | 'Inventory' | 'Marketing';
}

export default function AdminReports() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const reportTypes: ReportType[] = [
    { id: 'sales-summary', name: 'Sales Summary', description: 'Total sales, orders, and average order value over time.', icon: DollarSign, category: 'Sales' },
    { id: 'product-performance', name: 'Product Performance', description: 'Detailed breakdown of sales by individual product.', icon: ShoppingBag, category: 'Sales' },
    { id: 'customer-growth', name: 'Customer Growth', description: 'New vs returning customers and acquisition trends.', icon: Users, category: 'Customers' },
    { id: 'inventory-status', name: 'Inventory Status', description: 'Current stock levels, low stock alerts, and value.', icon: FileSpreadsheet, category: 'Inventory' },
    { id: 'discount-usage', name: 'Discount Usage', description: 'Performance of your active and past promotions.', icon: TrendingUp, category: 'Marketing' },
    { id: 'tax-report', name: 'Tax Report', description: 'Summary of taxes collected by region and period.', icon: FileText, category: 'Sales' },
  ];

  const categories = ['All', 'Sales', 'Customers', 'Inventory', 'Marketing'];

  const filteredReports = selectedCategory === 'All' 
    ? reportTypes 
    : reportTypes.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Generate detailed business reports for your store.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                    selectedCategory === cat ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Custom Report</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">
              Need a specific data view? Build a custom report.
            </p>
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Build Now
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white p-8 rounded-[40px] border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <report.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {report.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">{report.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {report.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="flex-grow py-4 text-xs font-bold uppercase tracking-widest">
                  <Download size={16} className="mr-2" />
                  Generate
                </Button>
                <div className="flex gap-2">
                  <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                    <FileSpreadsheet size={18} />
                  </button>
                  <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                    <FileJson size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold tracking-tight">Recent Downloads</h3>
          <Calendar className="text-gray-400" size={20} />
        </div>
        <div className="divide-y">
          {[
            { name: 'Sales_Summary_March_2026.csv', date: '2 hours ago', size: '1.2 MB' },
            { name: 'Inventory_Status_Weekly.xlsx', date: '5 hours ago', size: '2.4 MB' },
            { name: 'Customer_Growth_Q1.pdf', date: 'Yesterday', size: '4.8 MB' },
          ].map((file) => (
            <div key={file.name} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">{file.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{file.date} • {file.size}</p>
                </div>
              </div>
              <button className="p-3 hover:bg-gray-200 rounded-xl transition-colors">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
