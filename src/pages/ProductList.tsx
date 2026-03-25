import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/sampleData';
import { getProducts } from '../services/productService';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    let result = [...products];

    // Category Filter
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [categoryParam, sortBy, searchQuery, products]);

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {categoryParam 
              ? CATEGORIES.find(c => c.slug === categoryParam)?.name 
              : 'All Products'}
          </h1>
          <p className="text-gray-500 max-w-xl">
            Discover our curated selection of premium home products. From minimalist furniture to elegant decor, find the perfect pieces for your space.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`block text-sm transition-colors ${!categoryParam ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`block text-sm transition-colors ${categoryParam === cat.slug ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="price-1" className="rounded border-gray-300" />
                    <label htmlFor="price-1" className="text-sm text-gray-500">Under $100</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="price-2" className="rounded border-gray-300" />
                    <label htmlFor="price-2" className="text-sm text-gray-500">$100 - $500</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="price-3" className="rounded border-gray-300" />
                    <label htmlFor="price-3" className="text-sm text-gray-500">$500 - $1000</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="price-4" className="rounded border-gray-300" />
                    <label htmlFor="price-4" className="text-sm text-gray-500">Over $1000</label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border shadow-sm">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium px-4 py-2 bg-gray-50 rounded-lg"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium hidden sm:block uppercase tracking-wider">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm font-medium bg-transparent outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); handleCategoryChange(null); }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Categories</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => { handleCategoryChange(null); setIsFilterOpen(false); }}
                      className={`text-left py-2 px-4 rounded-lg text-sm transition-colors ${!categoryParam ? 'bg-black text-white' : 'bg-gray-50 text-gray-500'}`}
                    >
                      All Products
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { handleCategoryChange(cat.slug); setIsFilterOpen(false); }}
                        className={`text-left py-2 px-4 rounded-lg text-sm transition-colors ${categoryParam === cat.slug ? 'bg-black text-white' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Price Range</h3>
                  <div className="space-y-4">
                    {['Under $100', '$100 - $500', '$500 - $1000', 'Over $1000'].map((range, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input type="checkbox" id={`mob-price-${i}`} className="w-5 h-5 rounded border-gray-300 accent-black" />
                        <label htmlFor={`mob-price-${i}`} className="text-sm text-gray-600 font-medium">{range}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                    Show Results
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
