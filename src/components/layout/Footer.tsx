import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black flex items-center gap-1">
              <span className="bg-black text-white px-1.5 py-0.5 rounded">ULTRA</span>
              <span>HOUSE</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium home products designed for modern living. We bring quality, style, and comfort to your home across the GCC.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-500 hover:text-black text-sm transition-colors">All Products</Link></li>
              <li><Link to="/products?category=furniture" className="text-gray-500 hover:text-black text-sm transition-colors">Furniture</Link></li>
              <li><Link to="/products?category=lighting" className="text-gray-500 hover:text-black text-sm transition-colors">Lighting</Link></li>
              <li><Link to="/products?category=decor" className="text-gray-500 hover:text-black text-sm transition-colors">Home Decor</Link></li>
              <li><Link to="/products?category=kitchen" className="text-gray-500 hover:text-black text-sm transition-colors">Kitchenware</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-black text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-black text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-black text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-black text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-black text-sm transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <span className="text-gray-500 text-sm">Sheikh Zayed Road, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-500 text-sm">+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-gray-500 text-sm">support@ultrahouse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} UltraHouse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
