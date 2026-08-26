import { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EditorialMenu } from './components/EditorialMenu';
import { CheckoutModal } from "./components/CheckoutModal";
import { ItemCustomizeModal } from "./components/ItemCustomizeModal";
import { InteractiveMenu } from './components/InteractiveMenu';
import { LocationFooter } from './components/LocationFooter';
import { CateringPage } from './components/CateringPage';
import { EDITORIAL_MENU } from './data/menuData';
import type { CartItem, EditorialMenuItem } from './types';

export type ViewState = 'home' | 'menu' | 'store' | 'catering';

export function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<EditorialMenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Pre-populate with local data so the menu is never empty (works in dev without the API)
  const [menuItems, setMenuItems] = useState<EditorialMenuItem[]>(EDITORIAL_MENU);
  const isLoadingMenu = false;

  useEffect(() => {
    // In production Vercel will serve this route; in local dev it 404s and we
    // gracefully keep the local EDITORIAL_MENU that was set as the default.
    fetch('/api/catalog')
      .then(res => {
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setMenuItems(data);
      })
      .catch(() => {
        // Silently fall back – EDITORIAL_MENU is already loaded
      });
  }, []);

  // ── Initiate Customization Modal ──────────────────────────────────────
  const handleInitiateAdd = useCallback((item: EditorialMenuItem) => {
    setCustomizingItem(item);
  }, []);

  // ── Confirm Customization & Add to Cart ──────────────────────────────
  const handleConfirmAdd = useCallback((name: string, price: number, optionsSummary: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === name && i.options === optionsSummary);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + 1 };
        return updated;
      }
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name,
          price,
          quantity: 1,
          options: optionsSummary,
        },
      ];
    });
    setIsCheckoutOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearCart = useCallback(() => setCartItems([]), []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">

      {/* STICKY NAVBAR */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCart={() => setIsCheckoutOpen(true)}
        cartCount={totalCartCount}
      />

      {/* DYNAMIC VIEW ROUTING */}
      {currentView === 'home' && (
        <>
          <HeroSection onNavigate={setCurrentView} />
          <AboutSection onNavigate={setCurrentView} />
        </>
      )}

      {currentView === 'menu' && (
        <InteractiveMenu items={menuItems} isLoading={isLoadingMenu} />
      )}

      {currentView === 'store' && (
        <EditorialMenu
          items={menuItems}
          isLoading={isLoadingMenu}
          onInitiateAdd={handleInitiateAdd}
        />
      )}

      {currentView === 'catering' && (
        <CateringPage
          items={menuItems}
          isLoading={isLoadingMenu}
          onInitiateAdd={handleInitiateAdd}
        />
      )}

      {/* LOCATION, HOURS & FOOTER (Always visible at bottom) */}
      <LocationFooter />

      {/* ITEM CUSTOMIZATION MODAL (Size, Flavored Rice & Sides) */}
      <ItemCustomizeModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirmAdd={handleConfirmAdd}
      />

      {/* NATIVE SQUARE CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}

export default App;
