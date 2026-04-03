import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/sampleData';
import { getProducts, seedProducts } from '../services/productService';
import { getCategories, seedCategories } from '../services/categoryService';
import { getBanners, seedBanners } from '../services/bannerService';
import { getTestimonials, seedTestimonials } from '../services/testimonialService';
import { getHomepageSettings, seedHomepageSettings, HomepageSettings } from '../services/homepageService';
import { Product, Category, Banner, Testimonial } from '../types';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroBanners, setHeroBanners] = useState<Banner[]>([]);
  const [promoBanners, setPromoBanners] = useState<Banner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          productData, 
          categoryData, 
          heroData, 
          promoData, 
          testimonialData, 
          settingsData
        ] = await Promise.all([
          getProducts(),
          getCategories(),
          getBanners(true, 'hero'),
          getBanners(true, 'promo'),
          getTestimonials(true),
          getHomepageSettings()
        ]);
        
        let finalProducts = productData;
        let finalCategories = categoryData;
        let finalHeroBanners = heroData;
        let finalPromoBanners = promoData;
        let finalTestimonials = testimonialData;
        let finalSettings = settingsData;

        // Seed products if empty
        if (productData.length === 0) {
          await seedProducts();
          finalProducts = await getProducts();
        }

        // Seed categories if empty
        if (categoryData.length === 0) {
          await seedCategories();
          finalCategories = await getCategories();
        }

        // Seed banners if empty
        if (heroData.length === 0) {
          await seedBanners();
          finalHeroBanners = await getBanners(true, 'hero');
        }

        if (testimonialData.length === 0) {
          await seedTestimonials();
          finalTestimonials = await getTestimonials(true);
        }

        if (!settingsData) {
          await seedHomepageSettings();
          finalSettings = await getHomepageSettings();
        }

        setProducts(finalProducts);
        setCategories(finalCategories);
        setHeroBanners(finalHeroBanners);
        setPromoBanners(finalPromoBanners);
        setTestimonials(finalTestimonials);
        setSettings(finalSettings);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);
  const bestSellers = products.filter(p => p.isBestSeller);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanners[0]?.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
              {heroBanners[0]?.title || settings?.heroTitle || "Elevate Your Home With Premium Style"}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg leading-relaxed">
              {heroBanners[0]?.subtitle || settings?.heroSubtitle || "Discover our curated collection of minimalist furniture and decor designed to bring comfort and elegance to your space."}
            </p>
            <div className="flex flex-col sm:grid-cols-2 gap-4">
              <Link to={heroBanners[0]?.link || "/products"}>
                <Button size="lg" className="w-full sm:w-auto">
                  {heroBanners[0]?.buttonText || "Shop Collection"}
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full">
                <Truck className="text-black" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Fast Delivery</h4>
                <p className="text-xs text-gray-500">Across GCC within 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full">
                <ShieldCheck className="text-black" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full">
                <RotateCcw className="text-black" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Easy Returns</h4>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full">
                <Star className="text-black" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Premium Quality</h4>
                <p className="text-xs text-gray-500">Handpicked materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
              <p className="text-gray-500">Explore our diverse range of premium home products.</p>
            </div>
            <Link to="/products" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                  <span className="text-white/70 text-xs font-medium uppercase tracking-wider group-hover:text-white transition-colors">
                    Explore Products
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{settings?.featuredTitle || "Featured Collection"}</h2>
            <p className="text-gray-500">{settings?.featuredSubtitle || "Our most exclusive pieces, handpicked for their exceptional design and craftsmanship."}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      {promoBanners.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
              <img 
                src={promoBanners[0].image} 
                alt={promoBanners[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="px-12 md:px-20 max-w-xl text-white">
                  <h2 className="text-4xl font-bold mb-4">{promoBanners[0].title}</h2>
                  <p className="text-lg text-gray-200 mb-8">{promoBanners[0].subtitle}</p>
                  <Link to={promoBanners[0].link || "/products"}>
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                      {promoBanners[0].buttonText || "Shop Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">{settings?.bestSellersTitle || "Best Sellers"}</h2>
              <p className="text-gray-500">{settings?.bestSellersSubtitle || "The most loved products by our community."}</p>
            </div>
            <Link to="/products" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              Shop All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{settings?.testimonialsTitle || "What Our Customers Say"}</h2>
            <div className="flex justify-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10"
              >
                <p className="text-lg italic mb-6 text-gray-300">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      {settings?.showNewsletter !== false && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gray-100 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Join the UltraHouse Club</h2>
                <p className="text-gray-500 mb-8">Subscribe to get exclusive early access to new collections and special offers.</p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none"
                    required
                  />
                  <Button size="lg">Subscribe</Button>
                </form>
                <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
