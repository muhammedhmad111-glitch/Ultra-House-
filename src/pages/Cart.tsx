import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our collections and find something you love.
          </p>
          <Link to="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Shopping Cart</h1>
          <p className="text-gray-500">You have {cartCount} items in your cart.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl border shadow-sm relative group"
                >
                  <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/product/${item.id}`} className="font-bold text-lg hover:text-gray-600 transition-colors">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 capitalize mb-4">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border rounded-xl p-1 bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">${(item.discountPrice || item.price) * item.quantity}</p>
                        {item.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">${item.price * item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border shadow-sm p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl">${cartTotal}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full py-4 text-base mb-4">
                  Proceed to Checkout
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span>Secure checkout with 256-bit encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={16} className="text-blue-500" />
                  <span>Free delivery on all orders across GCC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
