import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  X,
  Save,
  Percent,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { getDiscounts, addDiscount, updateDiscount, deleteDiscount } from '../../services/discountService';
import { Discount } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState<Partial<Discount>>({
    code: '',
    type: 'percentage',
    value: 0,
    minPurchase: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    usageLimit: 0,
    isActive: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (error) {
      toast.error("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        ...discount,
        startDate: discount.startDate.split('T')[0],
        endDate: discount.endDate ? discount.endDate.split('T')[0] : ''
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        usageLimit: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.value) {
      toast.error("Code and Value are required");
      return;
    }

    const finalData = {
      ...formData,
      code: formData.code.toUpperCase(),
      startDate: new Date(formData.startDate!).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
    };

    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, finalData);
        toast.success("Discount updated successfully!");
      } else {
        await addDiscount(finalData as Omit<Discount, 'id' | 'createdAt' | 'usageCount'>);
        toast.success("Discount added successfully!");
      }
      setIsModalOpen(false);
      fetchDiscounts();
    } catch (error) {
      toast.error("Failed to save discount");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await deleteDiscount(id);
        toast.success("Discount deleted successfully!");
        fetchDiscounts();
      } catch (error) {
        toast.error("Failed to delete discount");
      }
    }
  };

  const toggleActive = async (discount: Discount) => {
    try {
      await updateDiscount(discount.id, { isActive: !discount.isActive });
      toast.success(`Discount ${discount.isActive ? 'deactivated' : 'activated'}!`);
      fetchDiscounts();
    } catch (error) {
      toast.error("Failed to update discount status");
    }
  };

  const filteredDiscounts = discounts.filter(d => 
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discounts & Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage coupon codes, seasonal sales, and customer rewards.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-black/10">
          <Plus className="mr-2" size={18} />
          Create Discount
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="relative bg-white p-4 rounded-3xl border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by discount code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* Discounts List */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm">
          <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Discounts...</p>
        </div>
      ) : filteredDiscounts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm text-gray-500 font-medium">
          No discounts found. Create your first promotion!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDiscounts.map((discount) => (
            <div key={discount.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  discount.isActive ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                )}>
                  <Percent size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold tracking-tight">{discount.code}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      discount.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} />
                      {discount.type === 'percentage' ? `${discount.value}% OFF` : `$${discount.value} OFF`}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Used {discount.usageCount} times
                    </span>
                    {discount.endDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Expires {new Date(discount.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleActive(discount)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    discount.isActive ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-50 text-green-600 hover:bg-green-100"
                  )}
                >
                  {discount.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleOpenModal(discount)}
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(discount.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discount Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{editingDiscount ? 'Edit Discount' : 'Create Discount'}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configure Promotion Rules</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Discount Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-xl font-bold outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all uppercase tracking-widest"
                    placeholder="e.g. SUMMER2026"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Discount Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Discount Value</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        {formData.type === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min. Purchase ($)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: Number(e.target.value) }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="0 for unlimited"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">End Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest">Active Promotion</span>
                </label>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="flex-grow py-5 text-base font-bold uppercase tracking-widest shadow-xl shadow-black/10">
                    <Save className="mr-2" size={20} />
                    {editingDiscount ? 'Save Changes' : 'Create Discount'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="px-10 py-5 text-base font-bold uppercase tracking-widest">
                    Discard
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
