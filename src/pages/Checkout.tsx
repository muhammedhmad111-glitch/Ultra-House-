import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronLeft, 
  CheckCircle2, 
  Lock,
  Wallet
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(3, 'Full name is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['cod', 'online']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
      country: 'United Arab Emirates',
      email: user?.email || '',
      fullName: user?.displayName || '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('email', user.email);
      setValue('fullName', user.displayName || '');
    }
  }, [user, setValue]);

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    try {
      const orderId = await createOrder({
        userId: user?.uid,
        items: cart,
        total: cartTotal,
        status: 'pending',
        shippingAddress: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      });

      if (orderId) {
        setIsSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Thank you for your order!</h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Your order has been placed successfully. We'll send you a confirmation email with your order details and tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b mb-12">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-4">
          <Link to="/cart" className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Contact Information */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input
                    {...register('email')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-black",
                      errors.email ? "border-red-500" : "border-gray-100 bg-gray-50"
                    )}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                  <input
                    {...register('phone')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-black",
                      errors.phone ? "border-red-500" : "border-gray-100 bg-gray-50"
                    )}
                    placeholder="+971 XX XXX XXXX"
                  />
                  {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                  <input
                    {...register('fullName')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-black",
                      errors.fullName ? "border-red-500" : "border-gray-100 bg-gray-50"
                    )}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Street Address</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-black resize-none",
                      errors.address ? "border-red-500" : "border-gray-100 bg-gray-50"
                    )}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                  {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">City</label>
                    <input
                      {...register('city')}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-black",
                        errors.city ? "border-red-500" : "border-gray-100 bg-gray-50"
                      )}
                      placeholder="Dubai"
                    />
                    {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none transition-all focus:border-black"
                    >
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Oman">Oman</option>
                      <option value="Bahrain">Bahrain</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={cn(
                  "relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all",
                  paymentMethod === 'cod' ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                )}>
                  <input type="radio" {...register('paymentMethod')} value="cod" className="sr-only" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Wallet size={24} className="text-black" />
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 size={20} className="text-black" />}
                  </div>
                  <span className="font-bold text-lg mb-1">Cash on Delivery</span>
                  <span className="text-xs text-gray-500">Pay when you receive your order</span>
                </label>

                <label className={cn(
                  "relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all",
                  paymentMethod === 'online' ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                )}>
                  <input type="radio" {...register('paymentMethod')} value="online" className="sr-only" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard size={24} className="text-black" />
                    </div>
                    {paymentMethod === 'online' && <CheckCircle2 size={20} className="text-black" />}
                  </div>
                  <span className="font-bold text-lg mb-1">Online Payment</span>
                  <span className="text-xs text-gray-500">Secure payment via Credit Card</span>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border shadow-sm p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="max-h-[300px] overflow-y-auto mb-8 pr-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border flex-shrink-0">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">${(item.discountPrice || item.price) * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl">${cartTotal}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 text-base mb-6" 
                isLoading={isSubmitting}
              >
                {paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Now'}
              </Button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                  <Lock size={12} />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
