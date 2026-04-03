/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import AdminCategories from './pages/admin/Categories';
import AdminReviews from './pages/admin/Reviews';
import AdminBanners from './pages/admin/Banners';
import AdminHomepage from './pages/admin/Homepage';

// Mock simple pages
const Privacy = () => <Layout><div className="container mx-auto px-4 py-20 max-w-3xl">
  <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
  <div className="prose prose-gray">
    <p>Your privacy is important to us. It is UltraHouse's policy to respect your privacy regarding any information we may collect from you across our website.</p>
    <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
    <h2 className="text-xl font-bold mt-8 mb-4">2. Use of Information</h2>
    <p>We use the information we collect in various ways, including to provide, operate, and maintain our website, improve, personalize, and expand our website, and understand and analyze how you use our website.</p>
  </div>
</div></Layout>;

const Terms = () => <Layout><div className="container mx-auto px-4 py-20 max-w-3xl">
  <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
  <div className="prose prose-gray">
    <p>By accessing the website at UltraHouse, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
    <h2 className="text-xl font-bold mt-8 mb-4">1. Use License</h2>
    <p>Permission is granted to temporarily download one copy of the materials (information or software) on UltraHouse's website for personal, non-commercial transitory viewing only.</p>
  </div>
</div></Layout>;

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-gray-900 antialiased" dir="ltr">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
            <Toaster position="top-center" richColors />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}





