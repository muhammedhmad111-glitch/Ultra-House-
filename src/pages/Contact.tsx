import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-gray-50 py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Get in Touch</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Have a question about our products or an existing order? Our team is here to help you create your perfect home.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Send us a message</h2>
              <p className="text-gray-500">We typically respond within 24 hours.</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-black outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-black outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-black outline-none transition-all" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-black outline-none transition-all resize-none" placeholder="Your message here..." />
              </div>
              <Button size="lg" className="w-full">Send Message</Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold">Email Us</h4>
                <p className="text-sm text-gray-500">support@ultrahouse.com</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold">Call Us</h4>
                <p className="text-sm text-gray-500">+971 4 123 4567</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-bold">WhatsApp</h4>
                <p className="text-sm text-gray-500">+971 50 123 4567</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold">Working Hours</h4>
                <p className="text-sm text-gray-500">Mon - Sat: 9AM - 8PM</p>
              </div>
            </div>

            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex items-start gap-6">
              <div className="p-3 bg-gray-100 rounded-xl text-black">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Our Headquarters</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  UltraHouse Tower, Sheikh Zayed Road,<br />
                  Business Bay, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
