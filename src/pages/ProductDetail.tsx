import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Heart, 
  ChevronRight,
  Check
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { getProductById, getProducts } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      
      if (data) {
        const allProducts = await getProducts();
        const related = allProducts.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-black">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-black truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === i ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviewsCount} reviews)</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-black">${product.discountPrice}</span>
                    <span className="text-xl text-gray-400 line-through">${product.price}</span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                      SAVE ${product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-black">${product.price}</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Urgency Element */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <p className="text-sm text-orange-800 font-medium">
                Hurry! Only <span className="font-bold">{product.stock} items</span> left in stock.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl p-1 bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-grow py-4 text-base"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Add to Cart
                </Button>
                <button className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
              
              <Button variant="outline" className="w-full py-4 border-black text-black hover:bg-black hover:text-white">
                Buy It Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-b">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={20} className="text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Easy Returns</span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="pt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 font-medium">Category:</span>
                <span className="text-gray-900 font-bold capitalize">{product.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 font-medium">Availability:</span>
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <Check size={14} /> In Stock
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b gap-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
          
          <div className="py-10">
            {activeTab === 'description' && (
              <div className="max-w-3xl prose prose-sm">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Experience the perfect blend of form and function with our {product.name}. 
                  Crafted with meticulous attention to detail, this piece is designed to elevate your living space 
                  while providing unparalleled comfort and durability.
                </p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1" />
                    <span>Premium materials sourced from sustainable forests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1" />
                    <span>Expertly handcrafted by master artisans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1" />
                    <span>Minimalist design that fits any modern aesthetic</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="max-w-xl">
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    {[
                      ['Material', 'Solid Wood, Premium Fabric'],
                      ['Dimensions', '210cm x 95cm x 85cm'],
                      ['Weight', '45kg'],
                      ['Assembly', 'Minimal assembly required'],
                      ['Warranty', '2 Years Limited Warranty']
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-4 font-medium text-gray-400">{label}</td>
                        <td className="py-4 font-bold text-right">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-8 rounded-2xl text-center">
                      <h3 className="text-5xl font-bold mb-2">{product.rating}</h3>
                      <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Based on {product.reviewsCount} reviews</p>
                    </div>
                  </div>
                  <div className="flex-grow space-y-6">
                    {[
                      { name: 'John D.', rating: 5, date: '2 days ago', comment: 'Absolutely stunning piece. The quality is even better than expected.' },
                      { name: 'Maria S.', rating: 4, date: '1 week ago', comment: 'Very comfortable and looks great in my living room. Delivery was fast.' }
                    ].map((review, i) => (
                      <div key={i} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{review.name}</h4>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex gap-1 text-yellow-400 mb-3">
                          {[...Array(5)].map((_, j) => <Star key={j} fill={j < review.rating ? "currentColor" : "none"} size={14} />)}
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Write a Review</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart (Mobile & Desktop) */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 py-4 px-4 md:px-6"
          >
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                <div>
                  <h4 className="font-bold text-sm truncate max-w-[200px]">{product.name}</h4>
                  <p className="text-xs font-bold">${product.discountPrice || product.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-grow sm:flex-grow-0">
                <div className="hidden md:flex items-center border rounded-lg p-1 bg-gray-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-white rounded transition-colors"><Minus size={14} /></button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-white rounded transition-colors"><Plus size={14} /></button>
                </div>
                <Button onClick={handleAddToCart} className="flex-grow sm:flex-grow-0 px-8">
                  Add to Cart — ${ (product.discountPrice || product.price) * quantity }
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
