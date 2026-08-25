import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EditorialMenu } from './components/EditorialMenu';
import { DeliveryModal } from './components/DeliveryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { LocationFooter } from './components/LocationFooter';
import type { CartItem } from './types';

export function App() {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Cart Actions ────────────────────────────────────────────────────
  const handleAddToCart = useCallback((name: string, price: number, options?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === name && i.options === options);
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
          options,
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

      {/* MINIMAL HEADER / NAVBAR */}
      <Navbar
        onOpenOrderModal={() => setIsDeliveryModalOpen(true)}
        onOpenCart={() => setIsCheckoutOpen(true)}
        cartCount={totalCartCount}
      />

      {/* EDITORIAL HERO SECTION */}
      <HeroSection onOpenOrderModal={() => setIsDeliveryModalOpen(true)} />

      {/* SILIVE FEATURED ABOUT US SECTION */}
      <AboutSection onOpenOrderModal={() => setIsDeliveryModalOpen(true)} />

      {/* DOORDASH LAYOUT STOREFRONT & MENU */}
      <EditorialMenu
        onOpenOrderModal={() => setIsDeliveryModalOpen(true)}
        onAddToCart={handleAddToCart}
      />

      {/* LOCATION, HOURS & FOOTER */}
      <LocationFooter />

      {/* DELIVERY OPTIONS MODAL */}
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onOpenCheckout={() => {
          setIsDeliveryModalOpen(false);
          setIsCheckoutOpen(true);
        }}
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
