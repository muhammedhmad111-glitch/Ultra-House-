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
  Layout,
  CheckCircle2,
  XCircle,
  Upload,
  Loader2
} from 'lucide-react';
import { getBanners, addBanner, updateBanner, deleteBanner } from '../../services/bannerService';
import { uploadFile } from '../../services/storageService';
import { Banner } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image: '',
    link: '/products',
    buttonText: 'Shop Now',
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        link: '/products',
        buttonText: 'Shop Now',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      toast.error("Title and Image are required");
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
        toast.success("Banner updated successfully!");
      } else {
        await addBanner(formData as Omit<Banner, 'id'>);
        toast.success("Banner added successfully!");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted successfully!");
        fetchBanners();
      } catch (error) {
        toast.error("Failed to delete banner");
      }
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}!`);
      fetchBanners();
    } catch (error) {
      toast.error("Failed to update banner status");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const bannerId = editingBanner?.id || 'new-banner';
      const extension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${extension}`;
      const path = `banners/${bannerId}/${fileName}`;
      const downloadURL = await uploadFile(file, path);
      setFormData(prev => ({ ...prev, image: downloadURL }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the hero section and promotional banners on your home page.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-black/10">
          <Plus className="mr-2" size={18} />
          Add Banner
        </Button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm">
          <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm text-gray-500 font-medium">
          No banners found. Create your first hero banner!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 aspect-video lg:aspect-auto relative overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
                      banner.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    )}>
                      {banner.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{banner.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{banner.subtitle}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Layout size={14} />
                        Link: {banner.link}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ImageIcon size={14} />
                        Button: {banner.buttonText}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button 
                      onClick={() => toggleActive(banner)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        banner.isActive ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-50 text-green-600 hover:bg-green-100"
                      )}
                    >
                      {banner.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(banner)}
                      className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Modal */}
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
                  <h2 className="text-2xl font-bold tracking-tight">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Banner Configuration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="e.g. Summer Collection 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      placeholder="e.g. Up to 50% off on all furniture"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                  <div className="flex gap-3">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <button
                        type="button"
                        className={cn(
                          "p-4 rounded-2xl transition-all border border-dashed",
                          isUploading ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        )}
                      >
                        {isUploading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Upload size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 px-2">Enter a URL or upload a file from your device.</p>
                  {formData.image && (
                    <div className="mt-2 aspect-video rounded-2xl overflow-hidden border">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Link URL</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
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
                  <span className="text-sm font-bold uppercase tracking-widest">Active Banner</span>
                </label>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="flex-grow py-5 text-base font-bold uppercase tracking-widest shadow-xl shadow-black/10">
                    <Save className="mr-2" size={20} />
                    {editingBanner ? 'Save Changes' : 'Publish Banner'}
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
