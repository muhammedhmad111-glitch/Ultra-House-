import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon, 
  X,
  Save,
  LayoutGrid,
  List as ListIcon,
  Star,
  TrendingUp,
  Tag,
  Package as PackageIcon,
  Eye,
  MoreVertical,
  Upload,
  Loader2
} from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { generateProductDescription } from '../../services/geminiService';
import { uploadProductImage } from '../../services/storageService';
import { Product } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    category: 'living-room',
    stock: 10,
    images: [''],
    isFeatured: false,
    isBestSeller: false,
    rating: 4.5,
    reviewsCount: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        images: product.images.length > 0 ? product.images : ['']
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        category: 'living-room',
        stock: 10,
        images: [''],
        isFeatured: false,
        isBestSeller: false,
        rating: 4.5,
        reviewsCount: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const cleanedImages = formData.images?.filter(url => url.trim() !== '') || [];
    if (cleanedImages.length === 0) {
      toast.error("At least one image URL is required");
      return;
    }

    const finalData = {
      ...formData,
      images: cleanedImages,
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, finalData);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(finalData as Omit<Product, 'id'>);
        toast.success("Product added successfully!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      toast.error("Please enter a product name first");
      return;
    }
    setIsGenerating(true);
    try {
      const description = await generateProductDescription(formData.name, formData.category || 'furniture');
      if (description) {
        setFormData(prev => ({ ...prev, description }));
        toast.success("AI Description generated!");
      } else {
        toast.error("Failed to generate description");
      }
    } catch (error) {
      toast.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    
    setUploadingIndex(index);
    try {
      // Use a temporary ID if adding a new product
      const productId = editingProduct?.id || 'new-product';
      const downloadURL = await uploadProductImage(file, productId);
      handleImageUrlChange(index, downloadURL);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploadingIndex(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2 rounded-xl transition-all",
                viewMode === 'table' ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-xl transition-all",
                viewMode === 'grid' ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-black/10">
            <Plus className="mr-2" size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative bg-white p-4 rounded-3xl border shadow-sm">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products by name, category, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
        />
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm">
          <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm text-gray-500 font-medium">
          No products found matching your criteria.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={10} fill="currentColor" />
                      FEATURED
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <TrendingUp size={10} />
                      BEST SELLER
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleOpenModal(product)} className="p-3 bg-white text-black rounded-2xl hover:bg-gray-100 transition-colors shadow-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    product.stock < 10 ? 'text-red-600' : 'text-green-600'
                  )}>
                    {product.stock} in stock
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-black">${product.price.toLocaleString()}</p>
                  {product.discountPrice && (
                    <p className="text-sm text-gray-400 line-through">${product.discountPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-xl object-cover border shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">${product.price.toLocaleString()}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-gray-400 line-through">${product.discountPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                        )} />
                        <span className="text-sm font-medium">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {product.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">FEATURED</span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">BEST SELLER</span>
                        )}
                        {!product.isFeatured && !product.isBestSeller && (
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">STANDARD</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
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
              className="relative bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Product Details & Configuration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 lg:p-12 space-y-10">
                {/* Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-black">
                    <PackageIcon size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">General Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                        placeholder="e.g. Minimalist Velvet Sofa"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-gray-200 focus:ring-2 ring-black/5 transition-all"
                      >
                        <option value="living-room">Living Room</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="dining">Dining</option>
                        <option value="office">Office</option>
                        <option value="outdoor">Outdoor</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Pricing & Inventory */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-black">
                    <Tag size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Pricing & Inventory</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Regular Price ($)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Discount Price ($)</label>
                      <input
                        type="number"
                        value={formData.discountPrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-black">
                      <ListIcon size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Description</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-purple-100 transition-all disabled:opacity-50"
                    >
                      <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all resize-none"
                    placeholder="Describe your product in detail..."
                  />
                </section>

                {/* Images */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-black">
                      <ImageIcon size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Product Images</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline"
                    >
                      + Add Another Image
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.images?.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-3">
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              required
                              value={url}
                              onChange={(e) => handleImageUrlChange(index, e.target.value)}
                              className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-black/5 border border-transparent focus:border-gray-200 transition-all"
                              placeholder="Image URL (e.g. https://...)"
                            />
                            {url && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border shadow-sm">
                                <img src={url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(index, e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              disabled={uploadingIndex === index}
                            />
                            <button
                              type="button"
                              className={cn(
                                "p-4 rounded-2xl transition-all border border-dashed",
                                uploadingIndex === index ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              )}
                            >
                              {uploadingIndex === index ? (
                                <Loader2 size={20} className="animate-spin" />
                              ) : (
                                <Upload size={20} />
                              )}
                            </button>
                          </div>

                          {formData.images!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImageUrl(index)}
                              className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 px-2">Enter a URL or upload a file from your device.</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Toggles */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <label className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl",
                        formData.isFeatured ? "bg-yellow-400 text-black" : "bg-white text-gray-400"
                      )}>
                        <Star size={20} fill={formData.isFeatured ? "currentColor" : "none"} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Featured Product</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Show in hero sections</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.isFeatured} 
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-6 h-6 rounded-lg border-gray-300 text-black focus:ring-black"
                    />
                  </label>

                  <label className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl",
                        formData.isBestSeller ? "bg-blue-500 text-white" : "bg-white text-gray-400"
                      )}>
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Best Seller</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mark as popular choice</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.isBestSeller} 
                      onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                      className="w-6 h-6 rounded-lg border-gray-300 text-black focus:ring-black"
                    />
                  </label>
                </section>

                {/* Actions */}
                <div className="pt-10 flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="flex-grow py-5 text-base font-bold uppercase tracking-widest shadow-xl shadow-black/10">
                    <Save className="mr-2" size={20} />
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
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
