import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { Star, Users, Globe, Heart } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="bg-gray-50 py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block"
          >
            Our Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-6"
          >
            Redefining Modern Living
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            UltraHouse was born from a simple idea: that premium design should be accessible, and home should be a sanctuary of comfort and style.
          </motion.p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Workshop" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight">Craftsmanship First</h2>
              <p className="text-gray-500 leading-relaxed">
                We partner with independent designers and master artisans across the globe to bring you pieces that are not just furniture, but works of art. Every material is handpicked for its durability, texture, and aesthetic appeal.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-black">
                    <Star size={20} />
                  </div>
                  <h4 className="font-bold">Quality</h4>
                  <p className="text-xs text-gray-400">Rigorous testing for every piece we sell.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-black">
                    <Globe size={20} />
                  </div>
                  <h4 className="font-bold">Global</h4>
                  <p className="text-xs text-gray-400">Sourcing the best materials worldwide.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-black">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold">Community</h4>
                  <p className="text-xs text-gray-400">Over 50,000 happy homes across GCC.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-black">
                    <Heart size={20} />
                  </div>
                  <h4 className="font-bold">Passion</h4>
                  <p className="text-xs text-gray-400">Driven by a love for interior design.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Sustainability', text: 'We are committed to reducing our environmental footprint through responsible sourcing and durable design.' },
              { title: 'Transparency', text: 'No hidden fees or misleading descriptions. What you see is exactly what you get.' },
              { title: 'Innovation', text: 'Constantly exploring new materials and technologies to improve the comfort of your home.' }
            ].map((value, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
