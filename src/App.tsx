import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';

import { InteractiveMenu } from './components/InteractiveMenu';
import { LocationFooter } from './components/LocationFooter';
import { CateringPage } from './components/CateringPage';
import { EDITORIAL_MENU } from './data/menuData';
import type { EditorialMenuItem } from './types';

export type ViewState = 'home' | 'menu' | 'catering';

export function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

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



  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">

      {/* STICKY NAVBAR */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* DYNAMIC VIEW ROUTING */}
      {currentView === 'home' && (
        <>
          <HeroSection onNavigate={setCurrentView} />
          <AboutSection />
        </>
      )}

      {currentView === 'menu' && (
        <InteractiveMenu items={menuItems} isLoading={isLoadingMenu} />
      )}


      {currentView === 'catering' && (
        <CateringPage
          items={menuItems}
          isLoading={isLoadingMenu}
        />
      )}

      {/* LOCATION, HOURS & FOOTER (Always visible at bottom) */}
      <LocationFooter />



    </div>
  );
}

export default App;
