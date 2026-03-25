import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
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
  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors">
            <Heart size={18} />
          </button>
        </div>

        {/* Quick Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 font-medium text-sm"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center text-yellow-400">
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-black">${product.discountPrice}</span>
              <span className="text-xs text-gray-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="font-bold text-black">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
