import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  X,
  Save,
  Image as ImageIcon,
  Tag,
  LayoutGrid
} from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { Category } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.image) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Category updated successfully!");
      } else {
        await addCategory(formData as Omit<Category, 'id'>);
        toast.success("Category added successfully!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into logical collections.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-black/10">
          <Plus className="mr-2" size={18} />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-3xl border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search categories by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm">
          <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm text-gray-500 font-medium">
          No categories found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-video relative overflow-hidden">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleOpenModal(category)} className="p-3 bg-white text-black rounded-2xl hover:bg-gray-100 transition-colors shadow-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Slug: {category.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
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
              className="relative bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Category Configuration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="e.g. Living Room"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug (URL Friendly)</label>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="e.g. living-room"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2 aspect-video rounded-2xl overflow-hidden border">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Button type="submit" className="w-full py-5 text-base font-bold uppercase tracking-widest shadow-xl shadow-black/10">
                    <Save className="mr-2" size={20} />
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full py-5 text-base font-bold uppercase tracking-widest">
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
