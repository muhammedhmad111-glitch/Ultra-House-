import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Zap, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap size={10} fill="currentColor" />
              Low Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button className="bg-white p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110">
            <Heart size={18} />
          </button>
          <Link to={`/product/${product.id}`} className="bg-white p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110">
            <Eye size={18} />
          </Link>
        </div>

        {/* Quick Buy / Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex flex-col">
          <button
            onClick={handleQuickBuy}
            className="bg-red-600 text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={14} fill="currentColor" />
            <span>Buy Now</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="bg-black text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-yellow-400">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
          {product.stock > 0 && (
            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
              In Stock
            </span>
          )}
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-black text-lg">${product.discountPrice}</span>
              <span className="text-xs text-gray-400 line-through">${product.price}</span>
              <span className="text-[10px] text-red-500 font-bold">Save ${product.price - product.discountPrice}</span>
            </>
          ) : (
            <span className="font-bold text-black text-lg">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
