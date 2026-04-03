import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  Phone, 
  DollarSign, 
  Truck, 
  Instagram, 
  Facebook, 
  Twitter,
  Save,
  RefreshCw,
  Store,
  ShieldCheck
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'ULTRA HOUSE',
    storeDescription: 'Premium furniture and home decor for modern living.',
    contactEmail: 'support@ultrahouse.com',
    contactPhone: '+1 234 567 890',
    currency: 'USD',
    shippingFee: 50,
    freeShippingThreshold: 500,
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'store');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as StoreSettings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'store'), settings);
      toast.success("Store settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store's general information and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Info */}
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Store size={18} />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest">General Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Store Name</label>
                <input
                  type="text"
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EGP">EGP (LE)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Store Description</label>
              <textarea
                rows={3}
                value={settings.storeDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Mail size={18} />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest">Contact Details</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={settings.contactPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Truck size={18} />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest">Shipping Configuration</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Flat Shipping Fee</label>
              <input
                type="number"
                required
                value={settings.shippingFee}
                onChange={(e) => setSettings(prev => ({ ...prev, shippingFee: Number(e.target.value) }))}
                className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Free Shipping Threshold</label>
              <input
                type="number"
                required
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Globe size={18} />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest">Social Media Links</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Instagram URL"
                value={settings.socialLinks.instagram}
                onChange={(e) => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))}
                className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
              />
            </div>
            <div className="relative">
              <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Facebook URL"
                value={settings.socialLinks.facebook}
                onChange={(e) => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))}
                className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Twitter URL"
                value={settings.socialLinks.twitter}
                onChange={(e) => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))}
                className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="px-12 py-4 font-bold uppercase tracking-widest shadow-xl shadow-black/10">
            {saving ? (
              <>
                <RefreshCw className="mr-2 animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
