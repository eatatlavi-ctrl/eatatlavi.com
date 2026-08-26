import React from 'react';
import { ArrowRight, Truck, Award, Sparkles } from 'lucide-react';

import type { ViewState } from '../App';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black overflow-hidden border-b border-[#27272A]">
      
      {/* BACKGROUND TEXTURE: DESATURATED STOREFRONT & BRICKWORK (STOREFRONT EXTERIOR) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/storefront.jpg"
          alt="LaVi Restaurant Storefront Exterior"
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.18] scale-105"
        />
        {/* Dark Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* DESATURATED LAVI SIGN BACKGROUND WATERMARK */}
      <div className="absolute right-8 top-1/4 opacity-10 pointer-events-none hidden lg:block select-none">
        <span className="font-serif text-[180px] font-bold text-white tracking-widest leading-none">
          LAVI
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-16">
        
        {/* MAIN HERO GRID: LEFT TEXT & RIGHT MAIN FOOD CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: TEXT CONTENT */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-none border border-[#27272A] bg-black/60 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#A1A1AA] uppercase">
                Staten Island &bull; 500 Henderson Ave
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-tight leading-[1.08]">
              Soul Food Meets <br />
              <span className="italic text-[#E5C158] font-normal">Caribbean Heritage</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-[#A1A1AA] max-w-xl font-light leading-relaxed">
              Authentic flavors, hearty portions, and scratch-made comfort in Staten Island.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 pt-4">
              <button
                onClick={() => onNavigate('store')}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-white text-black font-extrabold text-sm tracking-[0.2em] uppercase px-8 py-4 transition-colors flex items-center justify-center space-x-2"
              >
                <span>ORDER ONLINE</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={() => onNavigate('menu')}
                className="border border-[#27272A] hover:border-white text-white font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all text-center w-full sm:w-auto"
              >
                EXPLORE INTERACTIVE MENU
              </button>
            </div>

          </div>

          {/* RIGHT: MAIN FOOD PHOTO CARD (FULL VIBRANT COLOR) */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[#D4AF37]/40 bg-[#09090B] p-3 shadow-2xl group">
              
              <div className="relative overflow-hidden h-[340px] sm:h-[400px]">
                <img
                  src="/images/oxtail.png"
                  alt="Slow Braised Oxtail & 7-Cheese Mac"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* CARD DETAILS FOOTER */}
              <div className="p-4 flex items-center justify-between bg-black border-t border-[#27272A]">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase block">
                    Chef’s Signature Selection
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-light text-white">
                    Slow Braised Oxtail & 7-Cheese Mac
                  </h3>
                </div>

                <button
                  onClick={() => onNavigate('menu')}
                  className="text-xs font-mono tracking-wider uppercase text-black bg-[#D4AF37] hover:bg-white px-4 py-2 font-bold transition-colors"
                >
                  View
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* STATUS BAR WITH DESATURATED ICONS */}
        <div className="pt-8 border-t border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          
          <div className="flex items-center space-x-3.5 p-4 border border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase font-bold">Scratch-Made Daily</h4>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Fresh Caribbean & Soul Food ingredients</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 border border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
            <Truck className="w-6 h-6 text-[#A1A1AA] shrink-0" />
            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase font-bold">Free Local Delivery</h4>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">On all local orders over $35</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 border border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
            <Award className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">City Employee Perks</h4>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Call (347) 934-3040 for ID Verification & Discount</p>
            </div>
          </div>

        </div>

        {/* MINIMALIST GALLERY ROW (3 SMALLER CARDS - ALL IN FULL VIBRANT COLOR) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A1A1AA]">
              Featured Culinary Plates
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#A1A1AA] uppercase">
              Staten Island Kitchen
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: JERK CHICKEN & RICE (FULL COLOR) */}
            <div className="group border border-[#27272A] bg-[#09090B] p-3 text-left transition-all duration-300 hover:border-[#D4AF37]/60">
              <div className="relative overflow-hidden h-52 mb-3 rounded-none">
                <img
                  src="/images/hero_feast.png"
                  alt="Jerk Chicken & Rice"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-1 flex items-baseline justify-between">
                <h4 className="font-serif text-base text-white font-light group-hover:text-[#D4AF37] transition-colors">
                  Jerk Chicken & Rice
                </h4>
                <span className="font-mono text-xs text-[#E5C158] font-bold">
                  $8.99 / $13.99
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] font-light mt-1">
                Authentic Scotch Bonnet jerk rub over fragrant rice & peas.
              </p>
            </div>

            {/* CARD 2: OXTAILS (FULL COLOR) */}
            <div className="group border border-[#D4AF37]/40 bg-[#09090B] p-3 text-left transition-all duration-300 hover:border-[#D4AF37]">
              <div className="relative overflow-hidden h-52 mb-3 rounded-none">
                <img
                  src="/images/oxtail.png"
                  alt="Braised Oxtails"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-1 flex items-baseline justify-between">
                <h4 className="font-serif text-base text-[#E5C158] font-medium transition-colors truncate pr-2">
                  Slow-Braised Oxtails
                </h4>
                <span className="font-mono text-xs text-[#E5C158] font-bold shrink-0">
                  $20.99 / $34.99
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] font-light mt-1">
                6-hour slow-cooked tender meat in a rich, savory butter-bean gravy.
              </p>
            </div>

            {/* CARD 3: RED VELVET CHICKEN & WAFFLES (FULL COLOR) */}
            <div className="group border border-[#27272A] bg-[#09090B] p-3 text-left transition-all duration-300 hover:border-[#D4AF37]/60">
              <div className="relative overflow-hidden h-52 mb-3 rounded-none">
                <img
                  src="/images/red_velvet.png"
                  alt="Red Velvet Chicken & Waffles"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-1 flex items-baseline justify-between">
                <h4 className="font-serif text-base text-white font-light group-hover:text-[#D4AF37] transition-colors">
                  Red Velvet Chicken & Waffles
                </h4>
                <span className="font-mono text-xs text-[#E5C158] font-bold">
                  $18.99
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] font-light mt-1">
                Crispy fried chicken paired with rich cocoa red velvet waffles.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
