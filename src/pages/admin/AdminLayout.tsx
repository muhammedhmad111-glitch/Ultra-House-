import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  Menu, 
  X, 
  Sparkles, 
  Bell, 
  Search, 
  Globe, 
  Plus, 
  Layout, 
  Image as ImageIcon,
  Percent,
  FileText,
  Globe2,
  BarChart3,
  Activity,
  Share2,
  Instagram,
  Facebook,
  Grid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Categories', icon: Sparkles, path: '/admin/categories' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Discounts', icon: Percent, path: '/admin/discounts' },
    { name: 'Content', icon: FileText, path: '/admin/content' },
    { name: 'Homepage', icon: Layout, path: '/admin/homepage' },
    { name: 'Banners', icon: ImageIcon, path: '/admin/banners' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Reports', icon: FileText, path: '/admin/reports' },
    { name: 'Live View', icon: Activity, path: '/admin/live-view' },
    { name: 'Markets', icon: Globe2, path: '/admin/markets' },
    { name: 'Apps', icon: Grid, path: '/admin/apps' },
    { name: 'Facebook & Instagram', icon: Instagram, path: '/admin/sales-channels/meta' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r transition-all duration-300 hidden lg:flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-1">
              <span className="bg-black text-white px-1.5 py-0.5 rounded">ULTRA</span>
              <span>ADMIN</span>
            </Link>
          ) : (
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded font-bold">U</div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className={cn("transition-transform", !isSidebarOpen && "rotate-180")} size={18} />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                location.pathname === item.path 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-black")} />
              {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-black transition-all"
          >
            <Globe size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">View Store</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border text-gray-400 focus-within:ring-2 ring-black/5 transition-all">
              <Search size={18} />
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm text-black w-64" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/admin/products" 
              className="hidden sm:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
            >
              <Plus size={16} />
              ADD PRODUCT
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-xl relative text-gray-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user?.displayName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Administrator</p>
              </div>
              <img 
                src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName} 
                alt={user?.displayName} 
                className="w-10 h-10 rounded-2xl object-cover border shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b">
                <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-1">
                  <span className="bg-black text-white px-1.5 py-0.5 rounded">ULTRA</span>
                  <span>ADMIN</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all",
                      location.pathname === item.path 
                        ? "bg-black text-white shadow-lg shadow-black/10" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="text-base font-bold">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} />
                  <span className="text-base font-bold">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
