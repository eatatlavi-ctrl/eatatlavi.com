import React, { useState, useEffect } from 'react';
import { Phone, Menu as MenuIcon, X, Sparkles, ShoppingBag } from 'lucide-react';

import type { ViewState } from '../App';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-[#27272A] py-3.5 shadow-2xl' 
        : 'bg-gradient-to-b from-black via-black/80 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between relative">
        
        {/* LOGO */}
        <a href="#" className="flex items-center space-x-3 group">
          <img
            src="/images/LOGOLAVI.png"
            alt="LaVi Restaurant Logo"
            className="h-9 sm:h-11 w-auto object-contain transition-opacity duration-300 group-hover:opacity-85"
          />
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold tracking-[0.2em] text-[#A1A1AA] absolute left-1/2 -translate-x-1/2">
          <button onClick={() => onNavigate('home')} className={`transition-colors ${currentView === 'home' ? 'text-white' : 'hover:text-white'}`}>HOME</button>
          <button onClick={() => onNavigate('menu')} className={`transition-colors ${currentView === 'menu' ? 'text-white' : 'hover:text-white'}`}>MENU</button>
          <a href={currentView === 'home' ? '#about' : '/#about'} onClick={() => onNavigate('home')} className="hover:text-white transition-colors">ABOUT US</a>
          <button onClick={() => onNavigate('catering')} className={`transition-colors ${currentView === 'catering' ? 'text-white' : 'hover:text-white'}`}>CATERING</button>
        </nav>

        {/* RIGHT: PHONE, CART & GOLD CTA BUTTON */}
        <div className="hidden sm:flex items-center space-x-5">
          <a
            href="tel:3479343040"
            className="hidden xl:flex items-center space-x-2 text-xs font-mono tracking-wider text-[#A1A1AA] hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>(347) 934-3040</span>
          </a>



          <button
            onClick={() => window.open('https://eatatlavi.square.site', '_blank')}
            className="bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black font-bold text-xs tracking-[0.2em] uppercase px-6 py-2.5 rounded-none shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>ORDER ONLINE</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="lg:hidden flex items-center space-x-3">
          <button
            onClick={() => window.open('https://eatatlavi.square.site', '_blank')}
            className="sm:hidden bg-[#D4AF37] text-black font-bold text-[10px] tracking-wider uppercase px-3 py-1.5"
          >
            Order
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none p-1"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-[#27272A] px-6 pt-6 pb-8 space-y-6 text-center animate-fadeIn">
          <nav className="flex flex-col space-y-4 text-xs font-medium tracking-[0.2em] uppercase text-[#A1A1AA]">
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }} className={`py-1 ${currentView === 'home' ? 'text-white' : 'hover:text-white'}`}>Home</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('menu'); }} className={`py-1 ${currentView === 'menu' ? 'text-white' : 'hover:text-white'}`}>Menu</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }} className="hover:text-white py-1">About Us</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('catering'); }} className={`py-1 ${currentView === 'catering' ? 'text-white' : 'hover:text-white'}`}>Catering</button>
          </nav>

          <div className="pt-2 flex flex-col space-y-3">
            <a
              href="tel:3479343040"
              className="text-xs font-mono text-[#A1A1AA] flex items-center justify-center space-x-2 py-2 border border-[#27272A]"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Call (347) 934-3040</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.open('https://eatatlavi.square.site', '_blank');
              }}
              className="w-full bg-[#D4AF37] text-black font-bold text-xs tracking-[0.2em] uppercase py-3"
            >
              ORDER ONLINE
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
