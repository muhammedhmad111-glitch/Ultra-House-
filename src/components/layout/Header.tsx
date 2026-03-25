import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Phone, Globe, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from '../SearchOverlay';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const { cartCount } = useCart();
  const { user, signInWithGoogle, logout, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const toggleRTL = () => {
    const newRTL = !isRTL;
    setIsRTL(newRTL);
    document.documentElement.dir = newRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = newRTL ? 'ar' : 'en';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tighter text-black flex items-center gap-1">
            <span className="bg-black text-white px-1.5 py-0.5 rounded">ULTRA</span>
            <span>HOUSE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-black',
                  location.pathname === link.path ? 'text-black' : 'text-gray-500'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={toggleRTL}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Globe size={18} />
              <span>{isRTL ? 'EN' : 'AR'}</span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                >
                  <img 
                    src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} 
                    alt={user.displayName} 
                    className="w-8 h-8 rounded-full object-cover border"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <UserIcon size={20} />
                </button>
              )}

              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border p-2 z-50"
                  >
                    <div className="px-4 py-3 border-b mb-2">
                      <p className="text-sm font-bold truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <Settings size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-xl border-t md:hidden"
            >
              <nav className="flex flex-col p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'py-3 text-lg font-medium border-b border-gray-50 last:border-0',
                      location.pathname === link.path ? 'text-black' : 'text-gray-500'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-lg font-medium"
                  >
                    <Search size={18} />
                    <span>Search Products</span>
                  </button>
                  <a
                    href="https://wa.me/1234567890"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium"
                  >
                    <Phone size={18} />
                    <span>Contact on WhatsApp</span>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

