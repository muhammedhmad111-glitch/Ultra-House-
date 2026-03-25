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
  Wallet,
  ArrowRight,
  ChevronRight,
  Zap,
  Info,
  MapPin
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

type Step = 'info' | 'shipping' | 'payment';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
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
  const formData = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof CheckoutForm)[] = [];
    if (currentStep === 'info') fieldsToValidate = ['email', 'fullName', 'phone'];
    if (currentStep === 'shipping') fieldsToValidate = ['address', 'city', 'country'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      if (currentStep === 'info') setCurrentStep('shipping');
      else if (currentStep === 'shipping') setCurrentStep('payment');
    }
  };

  const prevStep = () => {
    if (currentStep === 'shipping') setCurrentStep('info');
    else if (currentStep === 'payment') setCurrentStep('shipping');
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    try {
      const orderId = await createOrder({
        userId: user?.uid,
        items: cart,
        total: cartTotal - appliedDiscount,
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

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'ULTRA10') {
      setAppliedDiscount(cartTotal * 0.1);
      toast.success('Discount applied!');
    } else {
      toast.error('Invalid discount code');
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

  const steps = [
    { id: 'info', label: 'Info', icon: Info },
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12 border-b mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/cart" className="p-2 hover:bg-white rounded-full transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive ? "bg-black border-black text-white scale-110 shadow-lg" : 
                    isCompleted ? "bg-green-500 border-green-500 text-white" : 
                    "bg-white border-gray-200 text-gray-400"
                  )}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isActive ? "text-black" : "text-gray-400"
                  )}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <AnimatePresence mode="wait">
                {currentStep === 'info' && (
                  <motion.section
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Contact Information</h3>
                      {!user && (
                        <p className="text-sm text-gray-500">
                          Already have an account? <Link to="/login" className="text-black font-bold underline">Login</Link>
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                        <input
                          {...register('email')}
                          className={cn(
                            "w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all focus:border-black text-lg",
                            errors.email ? "border-red-500" : "border-gray-100 bg-gray-50"
                          )}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                        <input
                          {...register('fullName')}
                          className={cn(
                            "w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all focus:border-black text-lg",
                            errors.fullName ? "border-red-500" : "border-gray-100 bg-gray-50"
                          )}
                          placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                        <input
                          {...register('phone')}
                          className={cn(
                            "w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all focus:border-black text-lg",
                            errors.phone ? "border-red-500" : "border-gray-100 bg-gray-50"
                          )}
                          placeholder="+971 XX XXX XXXX"
                        />
                        {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <Button type="button" onClick={nextStep} className="w-full py-5 text-lg font-bold uppercase tracking-widest">
                      Continue to Shipping <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </motion.section>
                )}

                {currentStep === 'shipping' && (
                  <motion.section
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Shipping Address</h3>
                      <button type="button" onClick={prevStep} className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
                        Back to Info
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address</label>
                        <textarea
                          {...register('address')}
                          rows={3}
                          className={cn(
                            "w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all focus:border-black resize-none text-lg",
                            errors.address ? "border-red-500" : "border-gray-100 bg-gray-50"
                          )}
                          placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                        {errors.address && <p className="text-xs text-red-500 font-bold">{errors.address.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                          <input
                            {...register('city')}
                            className={cn(
                              "w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all focus:border-black text-lg",
                              errors.city ? "border-red-500" : "border-gray-100 bg-gray-50"
                            )}
                            placeholder="Dubai"
                          />
                          {errors.city && <p className="text-xs text-red-500 font-bold">{errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Country</label>
                          <select
                            {...register('country')}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none transition-all focus:border-black text-lg"
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
                    <Button type="button" onClick={nextStep} className="w-full py-5 text-lg font-bold uppercase tracking-widest">
                      Continue to Payment <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </motion.section>
                )}

                {currentStep === 'payment' && (
                  <motion.section
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Payment Method</h3>
                      <button type="button" onClick={prevStep} className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
                        Back to Shipping
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <label className={cn(
                        "relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        paymentMethod === 'cod' ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                      )}>
                        <input type="radio" {...register('paymentMethod')} value="cod" className="sr-only" />
                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4">
                          <Wallet size={24} className="text-black" />
                        </div>
                        <div className="flex-grow">
                          <span className="block font-bold text-lg">Cash on Delivery</span>
                          <span className="block text-xs text-gray-500">Pay when you receive your order</span>
                        </div>
                        {paymentMethod === 'cod' && <CheckCircle2 size={24} className="text-black" />}
                      </label>

                      <label className={cn(
                        "relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        paymentMethod === 'online' ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                      )}>
                        <input type="radio" {...register('paymentMethod')} value="online" className="sr-only" />
                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4">
                          <CreditCard size={24} className="text-black" />
                        </div>
                        <div className="flex-grow">
                          <span className="block font-bold text-lg">Online Payment</span>
                          <span className="block text-xs text-gray-500">Secure payment via Credit Card / Apple Pay</span>
                        </div>
                        {paymentMethod === 'online' && <CheckCircle2 size={24} className="text-black" />}
                      </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                      <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Your payment information is encrypted and secure. We never store your full credit card details.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full py-6 text-xl font-bold uppercase tracking-widest shadow-2xl shadow-black/20" 
                      isLoading={isSubmitting}
                    >
                      {paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Now'} — ${cartTotal - appliedDiscount}
                    </Button>
                  </motion.section>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border shadow-xl p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{cart.length} Items</span>
              </h3>
              
              <div className="max-h-[300px] overflow-y-auto mb-8 pr-2 space-y-6 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold truncate mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold">${(item.discountPrice || item.price) * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount Code"
                    className="flex-grow bg-white border rounded-xl px-4 py-2 text-sm outline-none focus:border-black transition-all"
                  />
                  <button 
                    onClick={applyDiscount}
                    className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Try "ULTRA10" for 10% off</p>
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold">${cartTotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">-${appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free Express</span>
                </div>
                <div className="border-t pt-6 flex justify-between items-end">
                  <div>
                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total to pay</span>
                    <span className="font-bold text-3xl tracking-tighter">${cartTotal - appliedDiscount}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-green-600 font-bold uppercase tracking-widest">You save ${appliedDiscount + (cart.reduce((acc, item) => acc + (item.price - (item.discountPrice || item.price)) * item.quantity, 0))}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Lock size={12} />
                  <span>SSL Encrypted & Secure</span>
                </div>
                <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
