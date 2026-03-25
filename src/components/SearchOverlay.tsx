import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { SAMPLE_PRODUCTS } from '../data/sampleData';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = query.length > 1 
    ? SAMPLE_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[100] overflow-y-auto"
        >
          <div className="container mx-auto px-4 md:px-6 pt-20 pb-12">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold tracking-tight">Search Products</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative mb-12">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
              <input
                autoFocus
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-3xl md:text-5xl font-bold tracking-tighter border-b-2 border-gray-100 focus:border-black outline-none transition-all placeholder:text-gray-200"
              />
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Results */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Suggestions</h3>
                {results.length > 0 ? (
                  <div className="space-y-6">
                    {results.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border flex-shrink-0">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold group-hover:text-gray-600 transition-colors">{product.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Start typing to see results...</p>
                )}
              </div>

              {/* Popular Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Popular Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {['Furniture', 'Lighting', 'Home Decor', 'Kitchenware', 'Office', 'Minimalist'].map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${cat.toLowerCase()}`}
                      onClick={onClose}
                      className="px-6 py-3 bg-gray-50 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
