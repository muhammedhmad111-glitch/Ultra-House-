import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  Upload,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getHomepageSettings, 
  updateHomepageSettings, 
  seedHomepageSettings,
  HomepageSettings 
} from '../../services/homepageService';
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial, 
  seedTestimonials 
} from '../../services/testimonialService';
import { 
  getBanners, 
  addBanner, 
  updateBanner, 
  deleteBanner 
} from '../../services/bannerService';
import { uploadFile } from '../../services/storageService';
import { Testimonial, Banner } from '../../types';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';

export default function AdminHomepage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'testimonials' | 'promo'>('settings');
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [promoBanners, setPromoBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [currentPromo, setCurrentPromo] = useState<Partial<Banner> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, t, p] = await Promise.all([
        getHomepageSettings(),
        getTestimonials(),
        getBanners(false, 'promo')
      ]);
      
      if (!s) {
        await seedHomepageSettings();
        const newSettings = await getHomepageSettings();
        setSettings(newSettings);
      } else {
        setSettings(s);
      }
      
      if (t.length === 0) {
        await seedTestimonials();
        const newTestimonials = await getTestimonials();
        setTestimonials(newTestimonials);
      } else {
        setTestimonials(t);
      }
      
      setPromoBanners(p);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      toast.error("Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    try {
      await updateHomepageSettings(settings);
      toast.success("Homepage settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial?.name || !currentTestimonial?.text) return;
    
    try {
      if (currentTestimonial.id) {
        await updateTestimonial(currentTestimonial.id, currentTestimonial);
        toast.success("Testimonial updated");
      } else {
        await addTestimonial({
          name: currentTestimonial.name,
          role: currentTestimonial.role || '',
          text: currentTestimonial.text,
          rating: currentTestimonial.rating || 5,
          isActive: true
        });
        toast.success("Testimonial added");
      }
      setIsTestimonialModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPromo?.title || !currentPromo?.image) return;
    
    try {
      if (currentPromo.id) {
        await updateBanner(currentPromo.id, currentPromo);
        toast.success("Promo banner updated");
      } else {
        await addBanner({
          title: currentPromo.title,
          subtitle: currentPromo.subtitle || '',
          image: currentPromo.image,
          link: currentPromo.link || '',
          buttonText: currentPromo.buttonText || 'Shop Now',
          isActive: true,
          type: 'promo'
        });
        toast.success("Promo banner added");
      }
      setIsPromoModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save promo banner");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo banner?")) return;
    try {
      await deleteBanner(id);
      toast.success("Promo banner deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete promo banner");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const bannerId = currentPromo?.id || 'new-promo';
      const extension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${extension}`;
      const path = `promo-banners/${bannerId}/${fileName}`;
      const downloadURL = await uploadFile(file, path);
      setCurrentPromo(prev => ({ ...prev, image: downloadURL }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-gray-400 mb-4" size={32} />
        <p className="text-gray-500">Loading homepage management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Management</h1>
          <p className="text-gray-500 text-sm mt-1">Control the content and sections of your homepage.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
        >
          <div className="flex items-center gap-2">
            <Settings size={16} />
            General Settings
          </div>
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'testimonials' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            Testimonials
          </div>
        </button>
        <button
          onClick={() => setActiveTab('promo')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'promo' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon size={16} />
            Promo Banners
          </div>
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm max-w-4xl">
          <form onSubmit={handleUpdateSettings} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Layout size={18} className="text-blue-500" />
                  Hero Section
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hero Title (Fallback)</label>
                  <input
                    type="text"
                    value={settings.heroTitle || ''}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hero Subtitle (Fallback)</label>
                  <textarea
                    value={settings.heroSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none h-24 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  Featured Section
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                  <input
                    type="text"
                    value={settings.featuredTitle || ''}
                    onChange={(e) => setSettings({ ...settings, featuredTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.featuredSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, featuredSubtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <RefreshCw size={18} className="text-green-500" />
                  Best Sellers Section
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                  <input
                    type="text"
                    value={settings.bestSellersTitle || ''}
                    onChange={(e) => setSettings({ ...settings, bestSellersTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.bestSellersSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, bestSellersSubtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare size={18} className="text-purple-500" />
                  Testimonials Section
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                  <input
                    type="text"
                    value={settings.testimonialsTitle || ''}
                    onChange={(e) => setSettings({ ...settings, testimonialsTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, showNewsletter: !settings.showNewsletter })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.showNewsletter ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showNewsletter ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-bold">Show Newsletter Section</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button type="submit" size="lg">Save All Settings</Button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => { setCurrentTestimonial({}); setIsTestimonialModalOpen(true); }}>
              <Plus size={18} className="mr-2" />
              Add Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < (t.rating || 5) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setCurrentTestimonial(t); setIsTestimonialModalOpen(true); }}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm italic text-gray-600">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <button
                    onClick={() => updateTestimonial(t.id, { isActive: !t.isActive }).then(fetchData)}
                    className={`p-2 rounded-xl transition-colors ${t.isActive ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                  >
                    {t.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Banners Tab */}
      {activeTab === 'promo' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => { setCurrentPromo({}); setIsPromoModalOpen(true); }}>
              <Plus size={18} className="mr-2" />
              Add Promo Banner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promoBanners.map((p) => (
              <div key={p.id} className="bg-white rounded-[2rem] border shadow-sm overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => { setCurrentPromo(p); setIsPromoModalOpen(true); }}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-gray-600 hover:text-black transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{p.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Link: {p.link || 'None'}</span>
                    <button
                      onClick={() => updateBanner(p.id, { isActive: !p.isActive }).then(fetchData)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${p.isActive ? 'bg-gray-100 text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                    >
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{currentTestimonial?.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTestimonial} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Customer Name</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial?.name || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Role / Location</label>
                <input
                  type="text"
                  value={currentTestimonial?.role || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Testimonial Text</label>
                <textarea
                  required
                  value={currentTestimonial?.text || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, text: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none h-32 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={currentTestimonial?.rating || 5}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsTestimonialModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Testimonial</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{currentPromo?.id ? 'Edit Promo Banner' : 'Add Promo Banner'}</h2>
              <button onClick={() => setIsPromoModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSavePromo} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Banner Title</label>
                <input
                  type="text"
                  required
                  value={currentPromo?.title || ''}
                  onChange={(e) => setCurrentPromo({ ...currentPromo, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subtitle</label>
                <input
                  type="text"
                  value={currentPromo?.subtitle || ''}
                  onChange={(e) => setCurrentPromo({ ...currentPromo, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                <div className="flex gap-3">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      required
                      value={currentPromo?.image || ''}
                      onChange={(e) => setCurrentPromo({ ...currentPromo, image: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
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
                        "p-4 rounded-xl transition-all border border-dashed",
                        isUploading ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                      )}
                    >
                      {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 px-2">Enter a URL or upload a file from your device.</p>
                {currentPromo?.image && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border">
                    <img src={currentPromo.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Button Text</label>
                  <input
                    type="text"
                    value={currentPromo?.buttonText || ''}
                    onChange={(e) => setCurrentPromo({ ...currentPromo, buttonText: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Link URL</label>
                  <input
                    type="text"
                    value={currentPromo?.link || ''}
                    onChange={(e) => setCurrentPromo({ ...currentPromo, link: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 ring-black/5 outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsPromoModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Banner</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
