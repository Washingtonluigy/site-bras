import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/admin/AdminPanel';
import { Page } from './types';
import { useSiteSettings } from './hooks/useSiteSettings';

const isAdmin = window.location.pathname === '/admin';

function StoreApp() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [productSlug, setProductSlug] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const { settings } = useSiteSettings();

  const handleNavigate = (page: Page, slug?: string) => {
    setCurrentPage(page);
    if (slug) setProductSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} settings={settings} />
        )}
        {currentPage === 'products' && (
          <Products onNavigate={handleNavigate} />
        )}
        {currentPage === 'product-detail' && (
          <ProductDetail
            slug={productSlug}
            onNavigate={handleNavigate}
            onCartOpen={() => setCartOpen(true)}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} settings={settings} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WhatsAppButton settings={settings} />
    </div>
  );
}

export default function App() {
  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}
